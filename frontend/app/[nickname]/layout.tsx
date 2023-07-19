'use client'
import axios from "axios";

import SideBar from "./components/sideBar";
import React, { useEffect, useState, useReducer, createContext } from "react";

export const ACTIONS = {
	INIT: 'init',
	UPDATE_AVATAR: 'avatar',
	UPDATE_NICKNAME: 'nickname',
	UPDATE_PASSWD: 'passwd'
}

export interface UniversalData {
	intra_Id?: number,
	wallet?: number,
	grade?: string,
	level?: number,
	firstName?: string,
	lastName?: string,
	email?: string,
	nickname?: string,
	progress?: number,
	wins?: number,
	losses?: number,
	password?: boolean,
	profilePic?: string,
	coverPic?: File | string | HTMLImageElement
}

export const userDataContext = createContext<UniversalData>(null);

export async function fetchUserData(url: string) {
	//prevent /profile route from getting accessed if user doesn't have access token
	try
	{
		const {data} = await axios.get(url , {
		 	withCredentials: true
		});
		return (data);
	}
	catch(error)
	{
		console.log(error);
	}
}

function reducer(state, action) {
	if (action.type === ACTIONS.INIT) {
		return ({...action.payload})
	}
	else if (action.type === ACTIONS.UPDATE_AVATAR) {
		const update = {...state};
		update.profilePic = action.payload;
		return ({...update});
	}
	else if (action.type === ACTIONS.UPDATE_NICKNAME) {
		const update = {...state};
		update.nickname = action.payload;
		return ({...update});
	}
	else if (action.type === ACTIONS.UPDATE_PASSWD) {
		const update = {...state};
		update.password = action.payload;
		return ({...update});
	}
	else
		return state;
}

export default function ProfileLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const [userDataState, dispatch] = useReducer(reducer, {})
	useEffect(() => {
		fetchUserData('http://127.0.0.1:3000/users/profile').then(res => {
			dispatch({type: ACTIONS.INIT, payload: res});
		});
	}, [])
	return (
		<userDataContext.Provider value={userDataState}>
			{
				userDataState.level && 
				<section className='w-full flex h-screen'> 
					<SideBar dispatch={dispatch}/>
					{children}
				</section>
			}
		</userDataContext.Provider>
    );
}