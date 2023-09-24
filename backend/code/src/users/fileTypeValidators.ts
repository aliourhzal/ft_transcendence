
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from './users.service';

export const saveAvatarStorage = {
	// diskStorage for complete controlle of the storage of the file uploaded
	storage: diskStorage({
		// this property accepts the path where files are stored
		destination: './uploads/avatar',
		// this property accepts the function that hundles the logic of naming the file uploaded
		filename: (req: any, file, cb) => {
			//extract extension
			const ext = extname(file.originalname);
			// formats the file name e.g 'aourhzal.avatar.png'
			const filename = `${req.user.nickname}.avatar${ext}`
			cb(null, filename);
		}
	}),
	async fileFilter(req: any, file: Express.Multer.File, callback: Function) {
		const type = file.mimetype.split('/')[0];
		if (type !== 'image')
			callback(null, false);
		else {
			const usersService = new UsersService();
			await usersService.deletePreviousImage(req.user.nickname, 'avatar');
			callback(null, true);
		}
	},
}

export const saveCoverStorage = {
	// diskStorage for complete controlle of the storage of the file uploaded
	storage: diskStorage({
		// this property accepts the path where files are stored
		destination: './uploads/cover',
		// this property accepts the function that hundles the logic of naming the file uploaded
		filename: (req: any, file, cb) => {
			//extract extension
			const ext = extname(file.originalname);
			// formats the file name e.g 'aourhzal.avatar.png'
			const filename = `${req.user.nickname}.cover${ext}`
			cb(null, filename);
		}
	}),
	async fileFilter(req: any, file: Express.Multer.File, callback: Function) {
		const type = file.mimetype.split('/')[0];
		if (type !== 'image')
			callback(null, false);
		else {
			const usersService = new UsersService();
			await usersService.deletePreviousImage(req.user.nickname, 'cover');
			callback(null, true);
		}
	},
}

