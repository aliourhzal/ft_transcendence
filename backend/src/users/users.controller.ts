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

	@UseGuards(AuthGuard('jwt'))
	@Put('profile/avatar')
	@UseInterceptors(FileInterceptor('avatar', {
		storage: diskStorage({
			destination: './uploads',
			filename: (req: any, file, cb) => {
				const ext = extname(file.originalname);
				const filename = `${req.user.nickname}.avatar${ext}`
				cb(null, filename);
			}
		})
	}))
	async putUserAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
		await this.usersService.changeUserAvatar(req.user.nickname, file);
	}

	@Get('avatar/:fileTarget')
	async getUserAvatar(@Param('fileTarget') fileTarget: string) {
		let userFile: any = undefined;
		const assets = await readdir('./uploads');

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
	}
}
