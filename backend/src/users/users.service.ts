import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'
@Injectable()
export class UsersService {
	private readonly prisma = new PrismaClient()
	async findOneByNickname(nickname: string) {
		return await this.prisma.user.findUnique({
			where: {
				nickname
			}
		})
	}

	async findOneByIntraID(intra_id: number) {
		return await this.prisma.user.findUnique({
			where: {
				intra_id
			}
		})
	}
	
	async createNewUser(userData: UserData) {
		let user: any;
		try {
			user = await this.prisma.user.create({
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
		} catch {
			return (null);
		}
		const {password, ...ret} = user;
        return (ret);
	}
}
