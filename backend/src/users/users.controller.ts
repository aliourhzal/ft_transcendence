/* eslint-disable prettier/prettier */
import { BadRequestException, Body, ConflictException, Controller, Get, Param, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveAvatarStorage, saveCoverStorage } from './fileTypeValidators';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { comparePasswd, encodePasswd } from 'src/utils/bcrypt';
import { ChangeNicknameDTO, ChangePassDTO } from 'src/dto/configureUser';

@Controller('users')
export class UsersController{
	constructor (
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService
	) {}

	@UseGuards(AuthGuard('jwt'))
	@Get('profile')
	async getProfile(@Query('nickname') nickname: string, @Req() request: any) {
		if (!nickname)
			return await this.usersService.fetchUserByNickname(request.user.nickname);
		return await this.usersService.fetchUserByNickname(nickname);
	}

	// this endpoint is to be called when want to change the user avatar
	@UseGuards(AuthGuard('jwt'))
	@Put('profile/avatar')
	@UseInterceptors(FileInterceptor('avatar', saveAvatarStorage))
	async putUserAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
		// the changeUserAvatar carry the logic of changing the avatar in the database
		if (file)
			await this.usersService.changeUserCatalogue(req.user.nickname, file, 'avatar');
	}

	// this endpoint is to be called when want to change the user avatar
	@UseGuards(AuthGuard('jwt'))
	@Put('profile/cover')
	@UseInterceptors(FileInterceptor('cover', saveCoverStorage))
	async putUserCover(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
		if (file)
			await this.usersService.changeUserCatalogue(req.user.nickname, file, 'cover');
	}

	// this endpoint is responsible of returning the assets (avatars and cover pic): fileTarget is the name of the returned file
	@Get('uploads/:fileTarget')
	async getUserAvatar(@Param('fileTarget') fileTarget: string) {
		return this.usersService.serveUploads(fileTarget);
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('/profile/nickName')
	async setting(@Body() nicknameObj: ChangeNicknameDTO, @Req() req: any, @Res() response: Response)
	{
		if ((await this.usersService.findOneByNickname(nicknameObj.newNickname)))
			throw new ConflictException("already in use NickName");
		else
		{
			this.usersService.updateUserNickName(req.user.sub, nicknameObj.newNickname);
			const Pay = {
					nickname : nicknameObj.newNickname,
					sub : req.user.sub
			}
			const access_token = await this.jwtService.signAsync(Pay);
			response.cookie('access_token', access_token);
			response.end('ok');
		}
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('/profile/password')
	async passwordSetting(@Body() passwordObj: ChangePassDTO, @Req() req: any, @Res() response: Response)
	{
		const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
		if (!re.test(passwordObj.newPassword))
			throw new BadRequestException('this password is weak choose another')
		try{
			this.usersService.setHashedPassword(req.user.sub, encodePasswd(passwordObj.newPassword));
			response.end('ok');
		}
		catch(err)
		{throw new BadRequestException("this error from users.controller.ts/passwordSetting()");}
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('/profile/checkPassword')
	async checkPassword(@Body('oldPass') oldPassword: string, @Req() req: any, @Res() response: Response)
	{
		const user = await this.usersService.findOneByNickname(req.user.nickname);
		if (user && !comparePasswd(oldPassword, user.password))
		{
			throw new BadRequestException("wrong old password");
		}
		else
			response.end('ok');
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('/friend/requests')
	async getRequest(@Body('nickname') friendName:string, @Req() request: any)
	{
		return await this.usersService.getFriendsRequestsWithNickname(request.user.nickname);
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('/friend/checkFriend')
	async checkIsFriend(@Query('nickname') friendName: string, @Req() request: any)
	{
		return await this.usersService.isPossibleToSendRequest(friendName, request.user.nickname);
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('/friends')
	async getFriends(@Req() request: any) {
		return await this.usersService.getFriendsWithNickname(request.user.nickname);
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('/profile/stats')
	async stats(@Query('nickname') nickname: string, @Req() req: any)
	{
		if (!nickname)
			return await this.usersService.stats(req.user.nickname);
		return await this.usersService.stats(nickname);
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('/profile/history')
	async history(@Query('nickname') nickname: string, @Req() req: any)
	{
		if (!nickname)
			return await this.usersService.matchHistory(req.user.nickname);
		return await this.usersService.matchHistory(nickname);
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('/profile/achievements')
	async getAchievements(@Query('nickname') nickname: string, @Req() req: any)
	{
		if (!nickname)
			return await this.usersService.getAchievements(req.user.nickname);
		return await this.usersService.getAchievements(nickname);
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('/profile/missions')
	async getMissions(@Query('nickname') nickname: string, @Req() req: any)
	{
		if (!nickname)
			return await this.usersService.getMissions(req.user.nickname);
		return await this.usersService.getMissions(nickname);
	}

}
