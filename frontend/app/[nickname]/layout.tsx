'use client'
import axios from "axios";
import { useRouter } from "next/navigation";
import SideBar from "./components/sideBar";
import React, { useEffect, useState, useReducer, createContext } from "react";
import { Socket, io } from "socket.io-client";

export const ACTIONS = {
	INIT: 'init',
	UPDATE_AVATAR: 'avatar',
	UPDATE_COVER: 'cover',
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
	coverPic?: string,
	chatSocket: Socket
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
		throw new Error(error);
	}
}

function reducer(state, action) {
	if (action.type === ACTIONS.INIT) {
		const user: UniversalData = {...action.payload.data};
		user.chatSocket = action.payload.socket;
		return({...user});
	}
	else if (action.type === ACTIONS.UPDATE_AVATAR) {
		const update = {...state};
		update.profilePic = action.payload;
		return ({...update});
	}
	else if (action.type === ACTIONS.UPDATE_COVER) {
		console.log(action.payload);
		const update = {...state};
		update.coverPic = action.payload;
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

export const getCookie = (cookieLable: string) => {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [label, content] = cookie.split('=');
        if (label === cookieLable)
            return (content);
    }
	return (undefined)
}

export default function ProfileLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const router = useRouter();
	const [userDataState, dispatch] = useReducer(reducer, {});
	const [completed, setCompleted] = useState(false);
	useEffect(() => {
		// const socket = io('ws://127.0.0.1:3002',{
		// 	auth: {
		// 		token: getCookie('access_token'),
		// 	},
		// });
		fetchUserData('http://127.0.0.1:3000/users/profile')
		.then(res => {
			dispatch({type: ACTIONS.INIT, payload: {
				data: res,
				// socket
			}});
			setCompleted(true);
		})
		.catch(err => {
			console.log(err);
			router.push('/')
		})

	}, [])
	return (
		<userDataContext.Provider value={userDataState}>
			{
				completed && 
				<section className='w-full flex h-screen'> 
					<SideBar dispatch={dispatch}/>
					{children}
				</section>
			}
		</userDataContext.Provider>
    );
}