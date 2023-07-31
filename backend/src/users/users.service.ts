/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { unlinkSync } from 'fs';
import { extname } from 'path';
import { parse } from 'path';
import { createReadStream} from 'fs';
import { readdir } from 'fs/promises';
import { UserData } from 'src/utils/userData.interface';

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

	// set a password to the user
	async setHashedPassword(id: string ,password: string)
	{
		await this.prisma.user.update({
			where:{
				id: id,
			},
			data: {
				password: password,
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
					coverPic: userData.coverPic,
					password: "",
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

	async changeUserCatalogue(nickname: string , file: Express.Multer.File, category: string) {
		const ext = extname(file.originalname);
		const path = `${process.env.BACK_HOST}/users/uploads/${nickname}.${category}${ext}`;
		await this.prisma.user.update({
			where: {
				nickname
			},
			data: {
				[category === 'avatar' ? 'profilePic' : 'coverPic']: path
			}
		});
	}

	async deletePreviousImage(nickname: string, category: string) {
		let provider: string;
		const user = await this.prisma.user.findUnique({
			where: {
				nickname
			}
		})
		if (category === 'avatar')
			provider = user.profilePic.split('/')[2];
		else
			provider = user.coverPic;
		if (provider !== 'cdn.intra.42.fr' && provider !== 'http://127.0.0.1:3000/users/uploads/default.cover.jpeg')
		{
			const oldImage = category === 'avatar' ? user.profilePic.split('/')[5] :  user.coverPic.split('/')[5] 
			unlinkSync(`uploads/${category}/${oldImage}`);
		}
	}
	// http://127.0.0.1:3000/users/avatar/aourhzal.avatar.jpeg

	async serveUploads(fileTarget: string) {
		const category = fileTarget.split('.')[1];
		let userFile: any = undefined;
		const assets = await readdir(`./uploads/${category}`);
		
		// loop over the files in './uploads' and set the userFile var to the needed file 
		for (const file of assets) {
			const {base} = parse(file)
			if (base === fileTarget) {
				userFile = file;
				break;
			}
		}
		if (userFile) {
			const file = createReadStream(`./uploads/${category}/${userFile}`);
			return new StreamableFile(file);
		}
		else
		{
			if (category === 'cover') {
				const file = createReadStream(`./uploads/${category}/default.jpg`);
				return new StreamableFile(file);
			}
			if (category === 'avatar')
			{
				const file = createReadStream(`./uploads/${category}/default.png`);
				return new StreamableFile(file);
			}
		}
	}

	async findOneByNicknameWithRequests(nickname: string) {
		return await this.prisma.user.findUnique({
			where: {
				nickname
			},
			include: {
				sentRequests: true,
				userFriends: true
			}
		})
	}

	async findOneByNicknameWithReceived(nickname: string) {
		return await this.prisma.user.findUnique({
			where: {
				nickname
			},
			include: {
				receivedRequest: {
					include: {
						sender: true
					}
				},
				userFriends: true
			}
		})
	}

	async getFriends(nickname: string) {
		const {userFriends} = await this.prisma.user.findUnique({
			where: {
				nickname
			},
			include: {
				userFriends: true
			}
		})
		return (userFriends);
	}

	async acceptRequest(requestId: string, nickname: string) {
		const request = await this.prisma.friendRequest.findUnique({
			where: {
				id: requestId
			},
			include: {
				sender: true,
				target: true
			}
		})
		const user = await this.findOneByNickname(nickname);
		if (user.id !== request.target.id)
			throw new HttpException('no such request', HttpStatus.BAD_REQUEST);
		await this.prisma.user.update({
			where: {
				nickname
			},
			data: {
				userFriends: {
					connect: [{id: request.sender.id}]
				}
			}
		})
		await this.prisma.user.update({
			where: {
				id: request.sender.id
			},
			data: {
				userFriends: {
					connect: [{id: user.id}]
				}
			}
		})
		await this.prisma.friendRequest.delete({
			where: {
				id: request.id
			}
		});
	}

	async sendRequest(friendNickname: string, nickname: string) {
		const newFriend = await this.findOneByNickname(friendNickname);
		const user = await this.findOneByNicknameWithRequests(nickname);
		if (!newFriend) 
			return (1);

		// to prevent sending the request to your self
		if (newFriend.nickname === user.nickname)
			return(1);

		// to prevent sending request of the same user more than once
		for (const request of user.sentRequests) {
			if (request.targetId === newFriend.id)
				return (1);
		}
		// to prevent sending request to a friend
		for (const friend of user.userFriends) {
			if (friend.id === newFriend.id)
				return (1)
		}
		await this.prisma.friendRequest.create({
			data: {
				senderId: user.id,
				targetId: newFriend.id
			}
		});
		return (0);
	}

	async refuseRequest(requestId: string, nickname: string) {
		const request = await this.prisma.friendRequest.findUnique({
			where: {
				id: requestId
			},
			include: {
				target: true
			}
		});
		const user = await this.findOneByNickname(nickname);
		if (user.id !== request.target.id)
			throw new HttpException('no such request', HttpStatus.BAD_REQUEST);
		await this.prisma.friendRequest.delete({
			where: {
				id: requestId
			}
		})
	}

	async getFriendsRequests(nickname: string) {
		const user = await this.findOneByNicknameWithReceived(nickname);
		return (user.receivedRequest);
	}
}
