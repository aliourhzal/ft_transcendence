import { Injectable } from '@nestjs/common';
import { Match, PrismaClient, User } from '@prisma/client';
import { Player } from 'src/webSocket/Player';
import * as achievements from "./achievements.json"
import { UsersService } from 'src/users/users.service';

type Achievement = {
	category: string,
	level: number,
	title: string,
	description: string,
	xp: number
}

@Injectable()
export class AcheivementsService {
	private readonly prisma = new PrismaClient();

	constructor(private readonly usersService: UsersService) {}

	async findAchievement(title: string) {
		return await this.prisma.achievements.findUnique({
			where: {
				title
			}
		})
	}

	async getUserWithAchievements(nickname: string) {
		return await this.prisma.user.findUnique({
			where: {
				nickname
			},
			include: {
				achievements: true
			}
		})
	}

	async giveAcToUser(nickname: string, achievement: Achievement) {
		const user = await this.usersService.findOneByNickname(nickname);
		const ac = await this.findAchievement(achievement.title);
		if (!user || !ac)
			return ;
		await this.prisma.user.update({
			where: {
				nickname
			}, 
			data: {
				achievements: {
					connect: [{id: ac.id}]
				}
			}
		});
		await this.prisma.achievements.update({
			where: {
				title: achievement.title
			}, 
			data: {
				users: {
					connect: [{id: user.id}]
				}
			}
		});
	}

	async createAchievement(achievement: any) {
		const ac = await this.prisma.achievements.findMany();
		const acMap = ac.filter(a => a.title === achievement.title);
		const {xp, ...rest} = achievement;
		if (acMap.length !== 0)
			return ;
		await this.prisma.achievements.create({
			data: { ...rest}
		});
	}

	async checkBreaker(p1: Player, p2: Player) {
		const winner = p1.score > p2.score ? p1 : p2;
		const user = await this.usersService.findOneByNickname(winner.nickName)
		const {achievements: userAc} = await this.getUserWithAchievements(winner.nickName);
		const {matches} = await this.usersService.returnMatches(winner.nickName);
		const breakers = userAc.filter(a => a.category === 'breaker');
		let wonMatches = 0;
		let matchRequirement = 0;
		let newBreaker: Achievement;
	
		if (breakers.length === 4)
			return;
		switch (breakers.length) {
			case 0:
				newBreaker = achievements.achievements.theBreaker_1;
				matchRequirement = 3;
				break;
			case 1:
				newBreaker = achievements.achievements.theBreaker_2;
				matchRequirement = 5;
				break;
			case 2:
				newBreaker = achievements.achievements.theBreaker_3;
				matchRequirement = 7;
				break;
			case 3:
				newBreaker = achievements.achievements.Mjollnir;
				matchRequirement = 10;
				break;		
		}
		await this.createAchievement(newBreaker);
		if (matches.length < matchRequirement)
			return ; 
		matches.sort((a, b) => {
			return b.playerAt.getTime() - a.playerAt.getTime();
		});
		for(let i = 0; i < matchRequirement; i++) {
			const playerScore = matches[i].score1[0] === user.id ? matches[i].score1[1] : matches[i].score2[1];
			const oppScore = matches[i].score1[0] === user.id ? matches[i].score2[1] : matches[i].score1[1];
			if (playerScore > oppScore)
				wonMatches++;
		}
		if (wonMatches === matchRequirement) {
			await this.giveAcToUser(winner.nickName, newBreaker);
			await this.usersService.incrementLvl(winner.nickName, newBreaker.xp)
		}
	}

	async checkHumiliator(p1: Player, p2: Player) {
		const winner = p1.score > p2.score ? p1 : p2;
		const user = await this.usersService.findOneByNickname(winner.nickName)
		const {achievements: userAc} = await this.getUserWithAchievements(winner.nickName);
		const {matches} = await this.usersService.returnMatches(winner.nickName);
		const humiliates = userAc.filter(a => a.category === 'humiliator');
		let newHumilite: Achievement;
		let matchRequirement = 0;
		let wonMatches = 0;

		if (humiliates.length === 4)
			return;
		switch (humiliates.length) {
			case 0:
				newHumilite = achievements.achievements.Humiliator;
				matchRequirement = 1;
				break;
			case 1:
				newHumilite = achievements.achievements.Demon;
				matchRequirement = 3;
				break;
			case 2:
				newHumilite = achievements.achievements.theDevilPet;
				matchRequirement = 7;
				break;
			case 3:
				newHumilite = achievements.achievements.Satan;
				matchRequirement = 10;
				break;		
		}
		await this.createAchievement(newHumilite);
		if (matches.length < matchRequirement)
			return ;
		for(let i = 0; i < matchRequirement; i++) {
			const oppScore = matches[i].score1[0] === user.id ? matches[i].score2[1] : matches[i].score1[1];
			if (oppScore === 0)
				wonMatches++;
		}
		if (wonMatches === matchRequirement)
			await this.giveAcToUser(user.nickname, newHumilite);
	}

	async checkSeniority(player: Player) {
		const {matches: pMatches} = await this.usersService.returnMatches(player.nickName);
		let Seniority: Achievement = undefined;

		switch (pMatches.length) {
			case 5:
				Seniority = achievements.achievements.Noob;
				break;
			case 10:
				Seniority = achievements.achievements.Bob;
				break;
			case 20:
				Seniority = achievements.achievements.Pro;
				break;
			case 50:
				Seniority = achievements.achievements.Bad_ass;
				break;
		}
		Seniority && await this.createAchievement(Seniority);
		Seniority && await this.giveAcToUser(player.nickName, Seniority)
	}

	async checkForAchievement(p1: Player, p2: Player) {
		await this.checkBreaker(p1, p2);
		await this.checkHumiliator(p1, p2);
		await this.checkSeniority(p1);
		await this.checkSeniority(p2);
	}

	async checkHatTrick(scorer: Player, scoredAt: Player) {
		if (!(scorer.score === 3 && scoredAt.score === 0))
			return ;
		const {achievements: ac} = await this.getUserWithAchievements(scorer.nickName);
		const oldAc = ac.find(a => a.title === 'Hat-trick')
		if (oldAc)
			return ;
		await this.createAchievement(achievements.achievements.hat_trick);
		await this.giveAcToUser(scorer.nickName, achievements.achievements.hat_trick);
	}

	async giveWelcome(nickname: string) {
		const {achievements: ac} = await this.getUserWithAchievements(nickname);
		const oldAc = ac.find(a => a.title === 'Welcome')
		if (oldAc)
			return ;
		await this.createAchievement(achievements.achievements.Welcome);
		await this.giveAcToUser(nickname, achievements.achievements.Welcome);
	}
}