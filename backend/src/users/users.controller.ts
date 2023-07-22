import { Body, Controller, Get, Param, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveAvatarStorage, saveCoverStorage } from './fileTypeValidators';
import { Request, Response } from 'express';
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
	@UseInterceptors(FileInterceptor('avatar', saveAvatarStorage))
	async putUserAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
		// the changeUserAvatar carry the logic of changing the avatar in the database
		if (file)
			await this.usersService.changeUserCatalogue(req.user.nickname, file, 'avatar');
	}

	// this endpoint is to be called when want to change the user avatar
	@UseGuards(AuthGuard('jwt'))
	@Put('profile/avatar')
	@UseInterceptors(FileInterceptor('avatar', saveCoverStorage))
	async putUserCover(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
		// the changeUserAvatar carry the logic of changing the avatar in the database
		if (file)
			await this.usersService.changeUserCatalogue(req.user.nickname, file, 'cover');
	}

	// this endpoint is responsible of returning the assets (avatars and cover pic): fileTarget is the name of the returned file
	@Get('uploads/:fileTarget')
	async getUserAvatar(@Param('fileTarget') fileTarget: string) {
		return this.usersService.serveUploads(fileTarget);
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

	@UseGuards(AuthGuard('jwt'))
	@Get('/friend/:nickname')
	async addFriend(@Param('nickname') friendName:string, @Req() request: any)
	{
		return await this.usersService.addFriend(friendName, request.user.nickname);
	}
}
