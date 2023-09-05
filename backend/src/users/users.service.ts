/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { Match, PrismaClient, User } from '@prisma/client';
import { unlinkSync } from 'fs';
import { extname } from 'path';
import { parse } from 'path';
import { createReadStream} from 'fs';
import { readdir } from 'fs/promises';
import { UserData } from 'src/utils/userData.interface';
import { twoFactorAuth } from 'src/QrCode/qr.services';
import * as achievements from './achievements.json';
import * as sizeOf from "image-size"

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

	async findOneById(id: string) {
		return await this.prisma.user.findUnique({
			where: {
				id
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
					status: 'online'
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
		if (!user)
			throw new NotFoundException('user not found');
		const {password, ...ret} = user;
		if (user.password !== '')
			ret["password"] = true;
		else
			ret["password"] = false;
		return (ret);
	}

	async changeUserCatalogue(nickname: string , file: Express.Multer.File, category: string) {
		const ext = extname(file.originalname);
		let path = `${process.env.BACK_HOST}/users/uploads/${nickname}.${category}${ext}`;
		try {
			sizeOf.imageSize(file.path);
		} catch (e) {
			unlinkSync(`uploads/${category}/${nickname}.${category}${ext}`);
			path = `${process.env.BACK_HOST}/users/uploads/default.${category}.png`;
		}
		await this.prisma.user.update({
			where: {
				nickname
			},
			data: {
				[category === 'avatar' ? 'profilePic' : 'coverPic']: path
			}
		});
		return path;
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
		if (provider !== 'cdn.intra.42.fr' && provider !== `http://127.0.0.1:3000/users/uploads/default.${category}.png`)
		{
			const oldImage = category === 'avatar' ? user.profilePic.split('/')[5] :  user.coverPic.split('/')[5];

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
			const file = createReadStream(`./uploads/${category}/default.${category}.png`);
			return new StreamableFile(file);
		}
	}

	async findOneByIdWithRequests(id: string) {
		return await this.prisma.user.findUnique({
			where: {
				id
			},
			include: {
				sentRequests: true,
				userFriends: true
			}
		})
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

	async findOneByIdWithReceived(id: string) {
		return await this.prisma.user.findUnique({
			where: {
				id
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

	async getFriendsWithId(id: string) {
		try {
			const {userFriends} = await this.prisma.user.findUnique({
				where: {
					id
				},
				include: {
					userFriends: true
				}
			})
			return (userFriends);
		} catch(err) {
			console.log(id + ' user not found');
		}
	}

	async getFriendsWithNickname(nickname: string) {
		try {
			const {userFriends} = await this.prisma.user.findUnique({
				where: {
					nickname
				},
				include: {
					userFriends: true
				}
			})
			return (userFriends);
		} catch(err) {
			console.log(nickname + ' user not found');
		}
	}

	async isPossibleToSendRequest(friendNickname: string, nickname: string) {
		const target = await this.findOneByNickname(friendNickname);
		const user = await this.findOneByNicknameWithRequests(nickname);
		for (const request of user.sentRequests) {
			if (request.targetId === target.id)
				return (false);
		}
		for (const friend of user.userFriends) {
			if (friend.id === target.id)
				return (false);
		}
		return (true);
	}

	async acceptRequest(requestId: string, id: string) {
		const request = await this.prisma.friendRequest.findUnique({
			where: {
				id: requestId
			},
			include: {
				sender: true,
				target: true
			}
		})
		const user = await this.findOneById(id);
		if (user.id !== request.target.id)
			throw new HttpException('no such request', HttpStatus.BAD_REQUEST);
		await this.prisma.user.update({
			where: {
				id
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
		return (request.sender.id);
	}

	async sendRequest(friendNickname: string, id: string) {
		const sender = await this.findOneById(id);
		if (!sender)
			return ('');
		const newFriend = await this.findOneByNickname(friendNickname);
		const user = await this.findOneByNicknameWithRequests(sender.nickname);

		// to prevent sending the request to your self
		if (newFriend.nickname === user.nickname)
			return("that's you");

		// to prevent sending request of the same user more than once
		for (const request of user.sentRequests) {
			if (request.targetId === newFriend.id)
				return ("request already sent");
		}
		// to prevent sending request to a friend
		for (const friend of user.userFriends) {
			if (friend.id === newFriend.id)
				return ("that your friend");
		}
		await this.prisma.friendRequest.create({
			data: {
				senderId: user.id,
				targetId: newFriend.id
			}
		});
		return ('');
	}

	async refuseRequest(requestId: string, id: string) {
		const request = await this.prisma.friendRequest.findUnique({
			where: {
				id: requestId
			},
			include: {
				target: true
			}
		});
		const user = await this.findOneById(id);
		if (user.id !== request.target.id)
			throw new HttpException('no such request', HttpStatus.BAD_REQUEST);
		await this.prisma.friendRequest.delete({
			where: {
				id: requestId
			}
		})
	}

	async removeFriend(friendId: string, id: string) {
		const user = await this.findOneByIdWithRequests(id);
		const friend = await this.findOneByIdWithRequests(friendId);

		if (!user || !friend)
			throw new NotFoundException('user not found!!');
		await this.prisma.user.update({
			where: {
				id
			},
			data: {
				userFriends: {
					disconnect: [{id: friend.id}]
				}
			}
		})
		await this.prisma.user.update({
			where: {
				id: friendId
			},
			data: {
				userFriends: {
					disconnect: [{id: user.id}]
				}
			}
		})
	}

	async getFriendsRequestsWithNickname(nickName: string) {
		const user = await this.findOneByNickname(nickName);
		const received = await this.findOneByIdWithReceived(user.id);
		return (received.receivedRequest);
	}

	async getFriendsRequestsWithId(id: string) {
		const received = await this.findOneByIdWithReceived(id);
		return (received.receivedRequest);
	}

	async updateUserStatus(id: string, status: string) {
		try {
			await this.prisma.user.update({
				where: {
					id
				},
				data: {
					status
				}
			})
		} catch(err) {
			console.log(`${id} not found!!`);
		}
	}

	async	updateUserQr(id: string, secret: string)
	{
		try{
			await this.prisma.user.update({
				where: {
					id,
					twoFactorAuth: false
				},
				data: {
					AsciiSecretQr: secret
				}
			});
			return await this.prisma.user.findFirst({where:{id}});
		}catch(err){
			console.log("failed to set Qr true !!!")
		}
	}

	async	twoFactorOff(id: string)
	{
		try{
			await this.prisma.user.update({
				where: {
					id
				},
				data: {
					twoFactorAuth: false
				}
			});
		}catch(err){
			console.log("failed to turn Off Qr validation !")
		}
	}

	async	twoFactorOn(id: string)
	{
		try{
			await this.prisma.user.update({
				where: {
					id
				},
				data: {
					twoFactorAuth: true
				}
			});
		}catch(err){
			console.log("failed to turn On Qr validation !")
		}
	}

	async	createMatch(p1 :string, p2: string, score1:number, score2: number)
	{
		const user1 = await this.findOneByNickname(p1);
		const user2 = await this.findOneByNickname(p2);
		if (!user1 || !user2)
			throw new NotFoundException("not users to insert in match");
		const match = await this.prisma.match.create({
			data:{
				players:{
					connect:[
						user1,
						user2
					]
				},
				score1: [user1.id, score1],
				score2: [user2.id, score2]
			}
		});
	}

	async	returnMatches(nickname: string)
	{
		const user = await this.prisma.user.findFirst({
			where :{
				nickname: nickname
			},
			include : {
				matches : {
					include : {
						players :true
					}
				}
			}
		})
		if (!user)
			throw new NotFoundException('user not found while fetching his matches!!');
		return user;
	}

	async	stats(nickname : string)
	{
		let matchesStats = {
			total : 0,
			totalP : 0,
			scoreW : 0,
			scoreL : 0,
			wins : 0,
			loss : 0
		}
		let s1: number, s2 : number;

		const {matches} = await this.returnMatches(nickname);
		matches.map(x => {
			matchesStats.total++;
			s1 = (x.players[0].id === x.score1[0] ? parseInt(x.score1[1].toString()) : parseInt(x.score2[1].toString()));
			s2 = (x.players[1].id === x.score1[0] ? parseInt(x.score1[1].toString()) : parseInt(x.score2[1].toString()));
			matchesStats.totalP += (s1 + s2);
			if (x.players[0].nickname === nickname)
			{
				matchesStats.scoreW += s1;//(x.score1[0] === x.players[0].id ? s1 : s2);
				matchesStats.scoreL += s2;//(x.score1[0] === x.players[0].id ? s2 : s1);
				(s1 > s2 ? matchesStats.wins++ : matchesStats.loss++);
				
			}
			else
			{
				matchesStats.scoreW += s2;
				matchesStats.scoreL += s1;
				(s2 > s1 ? matchesStats.wins++ : matchesStats.loss++);
			}
		});
		return matchesStats;
	}

	async matchHistory(nickName: string)
	{
		let history : {}[] = []
		const matches = (await this.returnMatches(nickName)).matches;

		matches.map(x => {
			let match = {
				player1:{
					avatar	: x.players[0].profilePic,
					nickname : x.players[0].nickname,
					score: (x.players[0].id === x.score1[0] ? x.score1[1] : x.score2[1])
					// score : x.scores[0],
				},
				player2:{
					avatar : x.players[1].profilePic,
					nickname : x.players[1].nickname,
					score: (x.players[1].id === x.score1[0] ? x.score1[1] : x.score2[1])
				}
			}
			history.push( match );
		});
		return history;
	}

	async getAchievements(nickname: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				nickname
			},
			include: {
				achievements: true
			}
		});
		if (!user)
			throw new NotFoundException('user not found while fetching his achievements!!');
		if (!user.achievements)
			return [];
		return (user.achievements);
	}

	async getMissions(nickname: string) {
		const acs = await this.getAchievements(nickname);
		const missions = [];
		let breakerLvl = 0;
		let seniorityLvl = 0;
		let humiliatorLvl = 0;
		let hat_trick = true;

		acs.forEach(a => {
			if (a.category === 'breaker' && a.level > breakerLvl) {
				breakerLvl = a.level
			}
			else if (a.category === 'seniority' && a.level > seniorityLvl) {
				seniorityLvl = a.level
			}
			else if (a.category === 'humiliator' && a.level > humiliatorLvl) {
				humiliatorLvl = a.level
			}
			else if (a.category === 'hat-trick')
				hat_trick = false
		});
		if (hat_trick)
			missions.push(achievements.missions.hat_trick);
		if (breakerLvl < achievements.missions.theBreaker.length)
			missions.push(achievements.missions.theBreaker[breakerLvl]);
		if (seniorityLvl < achievements.missions.Seniority.length)
			missions.push(achievements.missions.Seniority[seniorityLvl]);
		if (humiliatorLvl < achievements.missions.Humiliator.length)
			missions.push(achievements.missions.Humiliator[humiliatorLvl]);

		return (missions);
	}

	async incrementLvl(nickname:string, xp: number) {
		const user = await this.findOneByNickname(nickname);
		const newLvl = +(user.level + (xp / 100)).toFixed(2);
		console.log(newLvl);
		await this.prisma.user.update({
			where: {
				nickname
			},
			data: {
				level: newLvl
			}
		});

	}
}
