'use client'
import axios from "axios";
import { useRouter } from "next/navigation";
import SideBar from "./components/sideBar";
import React, { useEffect, useState, useReducer } from "react";
import { UniversalData, userDataContext } from "../contexts/UniversalData";

export const ACTIONS = {
	INIT: 'init',
	UPDATE_AVATAR: 'avatar',
	UPDATE_COVER: 'cover',
	UPDATE_NICKNAME: 'nickname',
	UPDATE_PASSWD: 'passwd'
}

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
		return({...user});
	}
	else if (action.type === ACTIONS.UPDATE_AVATAR) {
		const update = {...state};
		update.profilePic = action.payload;
		return ({...update});
	}
	else if (action.type === ACTIONS.UPDATE_COVER) {
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

export function getCookie(cookieLable: string) {
	if (typeof document === 'undefined')
		return ;
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
		fetchUserData('http://127.0.0.1:3000/users/profile')
		.then(res => {
			dispatch({type: ACTIONS.INIT, payload: {
				data: res,
			}});
			setCompleted(true);
		})
		.catch(err => {
			router.push('/')
		})

	}, [])
	return (
		<userDataContext.Provider value={userDataState}>
			{
				completed && 
				<section className='w-full flex h-screen'> 
					<SideBar dispatch={dispatch}/>{/*any page.tsx have a sideBare*/}
					{children} {/*page.tsx*/}
				</section>
			}
		</userDataContext.Provider>
    );
}