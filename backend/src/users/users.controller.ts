import { Controller, Get, Param, Post, Put, Query, Req, Res, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, parse } from 'path';
import { createReadStream} from 'fs';
import { readdir } from 'fs/promises';

@Controller('users')
export class UsersController {
	constructor (private readonly usersService: UsersService) {}

	@UseGuards(AuthGuard('jwt'))
	@Get('profile')
	async getProfile(@Req() request: any) {
		return await this.usersService.fetchUserByNickname(request.user.nickname);
	}

	// this endpoint is to be called when want to change the user avatar
	@UseGuards(AuthGuard('jwt'))
	@Put('profile/avatar')
	@UseInterceptors(FileInterceptor('avatar', {
		// diskStorage for complete controlle of the storage of the file uploaded
		storage: diskStorage({
			// this property accepts the path where files are stored
			destination: './uploads',
			// this property accepts the function that hundles the logic of naming the file uploaded
			filename: (req: any, file, cb) => {
				//extract extension
				const ext = extname(file.originalname);
				// formats the file name e.g 'aourhzal.avatar.png'
				const filename = `${req.user.nickname}.avatar${ext}`
				cb(null, filename);
			}
		})
	}))
	async putUserAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
		// the changeUserAvatar carry the logic of changing the avatar in the database
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
}
