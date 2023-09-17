import React, { createContext } from "react";

const Context = createContext<any>(undefined);

export default Context;

export const gimmeRandom = () => {
	const date = new Date();
	return Math.random()
};

export const setDmUsers = (users) => {
	let _users: {
		  id: string,
		  nickName: string,
		  firstName: string,
		  lastName: string,
		  photo?: string,
		  cover?: string,
		  type: "OWNER"| "ADMIN" | "USER",
		  isMuted: string
	  }[] = []
	users.map( (user) => {
		_users.push(
			{
			id: user.id,
			nickName: user.nickname,
			firstName: user.firstName,
			lastName: user.lastName,
			photo: user.profilePic,
			cover: user.coverPic,
			type: 'USER',
			isMuted: 'UNMUTED',
			}
		)
	  } 
	)
	return (_users)
}

export const getUsersInfo = (users) => {
	let _users: {
		  id: string,
		  nickName: string,
		  firstName: string,
		  lastName: string,
		  photo?: string,
		  cover?: string,
		  type: "OWNER"| "ADMIN" | "USER",
		  isMuted: string
	  }[] = []
	users.map( (user) => {
		_users.push(
			{
			id: user.user.id,
			nickName: user.user.nickname,
			firstName: user.user.firstName,
			lastName: user.user.lastName,
			photo: user.user.profilePic,
			cover: user.user.coverPic,
			type: user.userType,
			isMuted: user.isMuted,
			}
		)
	  } 
	)
	return (_users)
}
