import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'
import { unlinkSync } from 'fs';
import { extname } from 'path';

@Injectable()
export class UsersService {
	private readonly prisma = new PrismaClient()

	// update a user NickName
	async updateUserNickName(id : string , newNick: string)
	{
		await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				nickname: newNick,
			}
		});
	}

	// this function fetches the user from the database by nickname
	async findOneByNickname(nickname: string) {
		return await this.prisma.user.findUnique({
			where: {
				nickname
			}
		})
	}

	// this function fetches the user from the database by intra id
	async findOneByIntraID(intra_id: number) {
		return await this.prisma.user.findUnique({
			where: {
				intra_id
			}
		})
	}
	
	// this function inserts the user data into the database and return the user data except the password
	async createNewUser(userData: UserData) {
		let user: any;
		try {
			user = await this.prisma.user.create(
			{
				data: {
					intra_id: userData.intra_id,
					firstName: userData.firstName,
					lastName: userData.lastName,
					nickname: userData.login,
					email: userData.email,
					wallet: userData.wallet,
					points: 0,
					level: userData.level,
					grade: userData.grade,
					profilePic: userData.profilePic,
					password: ""
				}
			});
		}
		catch
		{
			return (null);
		}
		const {password, ...ret} = user;
        return (ret);
	}

	async fetchUserByNickname(nickname: string) {
		const user = await this.findOneByNickname(nickname);
		const {password, ...ret} = user;
		if (user.password !== '')
			ret["password"] = true;
		else
			ret["password"] = false;
		return (ret);
	}

	async changeUserAvatar(nickname: string , file: Express.Multer.File) {
		const ext = extname(file.originalname);
		const path = `${process.env.BACK_HOST}/users/avatar/${nickname}.avatar${ext}`;
		await this.prisma.user.update({
			where: {
				nickname
			},
			data: {
				profilePic: path
			}
		});
	}

	async deleteOldAvatar(nickname: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				nickname
			}
		})
		const provider = user.profilePic.split('/')[2]
		if (provider !== 'cdn.intra.42.fr')
		{
			const oldAvatar = user.profilePic.split('/')[5];
			unlinkSync(`uploads/${oldAvatar}`)
		}
	}
	// http://127.0.0.1:3000/users/avatar/aourhzal.avatar.jpeg
}

export class CustomError extends Error {
	code: string;
  
	constructor(message: string, code: string) {
	  super(message);
	  this.code = code;
	}
};
