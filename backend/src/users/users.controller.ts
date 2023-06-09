import { Body, Controller, Get, Param, Post, Put, Req, Res, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { parse } from 'path';
import { createReadStream} from 'fs';
import { readdir } from 'fs/promises';
import { saveImageStorage } from './fileTypeValidators';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { comparePasswd, encodePasswd } from 'src/utils/bcrypt';
import { log } from 'console';

@Controller('users')
export class UsersController{
	constructor (
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService
	) {}

	@UseGuards(AuthGuard('jwt'))
	@Get('profile')
	async getProfile(@Req() request: any) {
		return await this.usersService.fetchUserByNickname(request.user.nickname);
	}

	// this endpoint is to be called when want to change the user avatar
	@UseGuards(AuthGuard('jwt'))
	@Put('profile/avatar')
	@UseInterceptors(FileInterceptor('avatar', saveImageStorage))
	async putUserAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
		// the changeUserAvatar carry the logic of changing the avatar in the database
		if (file)
			await this.usersService.changeUserAvatar(req.user.nickname, file);
	}

	// this endpoint is responsible of returning the assets (avatars and cover pic): fileTarget is the name of the returned file
	@Get('avatar/:fileTarget')
	async getUserAvatar(@Param('fileTarget') fileTarget: string) {
		let userFile: any = undefined;
		const assets = await readdir('./uploads');
		
		// loop over the files in './uploads' and set the userFile var to the needed file 
		for (const file of assets) {
			const {base} = parse(file)
			if (base === fileTarget) {
				userFile = file;
				break;
			}
		}
		if (userFile) {
			const file = createReadStream(`./uploads/${userFile}`);
			return new StreamableFile(file);
		}
		else
		{
			const file = createReadStream('./uploads/man.png');
			return new StreamableFile(file);
		}
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('/profile/nickName')
	async setting(@Body('newNickname') newNickname: string, @Req() req: any, @Res() response: Response)
	{
		if ((await this.usersService.findOneByNickname(newNickname)))
			throw new Error("already in use NickName");
		else
		{
			this.usersService.updateUserNickName(req.user.sub, newNickname);
			const Pay = {
					nickname : newNickname,
					sub : req.user.sub
			}
			const access_token = await this.jwtService.signAsync(Pay);
			response.cookie('access_token', access_token);
			response.end('ok');
		}
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('/profile/password')
	async passwordSetting(@Body('confirmPass') newPassword: string, @Req() req: any, @Res() response: Response)
	{
		const re: RegExp = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
		if (!re.test(newPassword))
			throw new Error("wrong password schema");
		try{
			this.usersService.setHashedPassword(req.user.sub, encodePasswd(newPassword));
			response.end('ok');
		}
		catch(err)
		{throw new Error("critical Error");}
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('/profile/checkPassword')
	async checkPassword(@Body('oldPass') oldPassword: string, @Req() req: any, @Res() response: Response)
	{
		const user = await this.usersService.findOneByNickname(req.user.nickname);
		if (!comparePasswd(oldPassword, user.password))
		{
			throw new Error("wrong old password");
		}
		else
			response.end('ok');
	}
}
