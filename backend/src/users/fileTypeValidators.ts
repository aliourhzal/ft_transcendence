
import { diskStorage } from 'multer';
import { extname } from 'path';

export const saveImageStorage = {
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
	}),
	fileFilter(req: any, file: Express.Multer.File, callback: Function) {
		const type = file.mimetype.split('/')[0];
		if (type !== 'image')
			callback(null, false);
		else
			callback(null, true);
	},
}
