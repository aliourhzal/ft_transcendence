import { Controller, Get, Param, Post, Put, Redirect, Req, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CustomError, UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { parse } from 'path';
import { createReadStream} from 'fs';
import { readdir } from 'fs/promises';
import { saveImageStorage } from './fileTypeValidators';
import { AuthService } from '../auth/auth.service';
import { response } from 'express';

@Controller('users')
export class UsersController {
	constructor (private readonly usersService: UsersService) {}

	@UseGuards(AuthGuard('jwt'))
	@Get('profile')
	async getProfile(@Req() request: any) {
		console.log(request.user);
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
	async setting(@Req() req: any)
	{
		// const err= new CustomError("test", "333");
		const intra_id = req.body.intraId;
		const NickName = req.body.newNickname;
		
		if ((await this.usersService.findOneByNickname(NickName)))	
			throw new Error("already in use NickName");
		else
		{
			this.usersService.updateUserNickName(intra_id, NickName);
			
			// const user = await this.usersService.findOneByIntraID(intra_id);
			// const { access_token } = await this.authService.login(user);
			// response.cookie('access_token', access_token);
			// response.end('ok');
		}
	}
}
