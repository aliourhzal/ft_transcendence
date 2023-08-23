/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { Match, PrismaClient, User } from '@prisma/client';
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
		console.log(fileTarget);
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
				const file = createReadStream(`./uploads/${category}/default.png`);
				return new StreamableFile(file);
			}
		}
	}
	

	async addFriend(friendNickname: string, nickname: string) {

		const friend = await this.findOneByNickname(friendNickname);
		const user =  await this.findOneByNickname(nickname);
		if (!friend || !user) 
		{
			throw new NotFoundException('user not found!!')
		}

		await this.prisma.user.update({
            where: { id: user.id },
            data: {
                userFriends: {
                connect: [{ id: friend.id }],
              },
            },
        })

		await this.prisma.user.update({
            where: { id: friend.id },
            data: {
                userFriends: {
                connect: [{ id: user.id }],
              },
            },
        });
  
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
				scores: [score1, score2]
			}
		});
	}

	async	returnMatches(user: string)
	{
		return await this.prisma.user.findFirst({
			where :{
				nickname: user
			},
			include : {
				matches : {
					include : {
						players :true
					}
				}
			}
		})
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
		const matches = (await this.returnMatches(nickname)).matches;
		matches.map(x => {
			matchesStats.total++;
			matchesStats.totalP += (x.scores[0] + x.scores[1]);
			if (x.players[0].nickname === nickname)
			{
				matchesStats.scoreW += x.scores[0];
				matchesStats.scoreL += x.scores[1];
				(x.scores[0] > x.scores[1] ? matchesStats.wins++ : matchesStats.loss++);
			}
			else
			{
				matchesStats.scoreW += x.scores[1];
				matchesStats.scoreL += x.scores[0];
				(x.scores[1] > x.scores[0] ? matchesStats.wins++ : matchesStats.loss++);
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
					score : x.scores[0],
				},
				player2:{
					avatar : x.players[1].profilePic,
					nickname : x.players[1].nickname,
					score : x.scores[1]
				}
			}
			history.push( match );
		});
		return history;
	}
}
