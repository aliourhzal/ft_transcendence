'use client'

import {BsFillPersonFill} from "react-icons/bs";
import {BsFillChatSquareDotsFill} from "react-icons/bs";
import {FaTableTennis} from "react-icons/fa";
import {FaUserFriends} from "react-icons/fa";
import { RiLogoutBoxFill } from "react-icons/ri"
import MyModal from "./modalPopup";
import { useContext, useEffect, useState } from "react";
import { userDataContext } from "../../contexts/UniversalData";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie"
import { InvitationSocketContext } from "@/app/contexts/InvitationWebSocket";
import Link from "next/link";
import { io } from "socket.io-client";
import { getCookie } from "../layout";

interface SideBarProps {
	nickname: string,
	avatar: string,
	passwd: boolean,
	changeNickname: Function,
	changePasswd: Function,
	changeAvatar: Function
}

const socket = io(`ws://${process.env.NEXT_PUBLIC_BACK}:3004`,{
	extraHeaders: {
		Authorization: `Bearer ${getCookie('access_token')}`,
    },
})

export function NavOption(props: any) {

	// const [chatNotif, setChatNotif] = useState(false)
	const socket = useContext(InvitationSocketContext);

	// useEffect(() => {
	// 	socket.on('notifyChat', () => { setChatNotif(true) })
	// }, [])

	return (
		<Link href={`http://${process.env.NEXT_PUBLIC_FRONT}:3001/` + props.nickname + '/' + (props.location ?? '')} 
			className="cursor-pointer flex flex-col md:flex-row items-center gap-5 relative" onClick={()=>{
			// if (props.location === 'chat')
			// 	setChatNotif(false)
			// props.router.push(props.nickname + props.location);
			// props.router.push(`http://${process.env.NEXT_PUBLIC_FRONT}:3001/` + props.nickname + '/' + (props.location ?? ''));
		}}>
			<props.icon  style={{color: 'white', fontSize: '24px'}}/>
			{/* { props.location === 'chat' && chatNotif && <span className='animate-pulse rounded-full bg-red-500 opacity-90 border-2 border-red-500 w-2 h-2 z-10 -top-2 -left-2 absolute'></span>} */}
			<span className="text-md text-whiteSmoke hidden sm:inline capitalize">{props.location ?? 'profile'}</span>
		</Link>
	);
}

export default function SideBar(props: any)
{
	const router = useRouter();
	const userData = useContext(userDataContext);
	const socket = useContext(InvitationSocketContext);
	const [cookies, setCookie, removeCookie] = useCookies(["access_token", "login"]);
	const logout = () => {
		removeCookie('access_token')
		socket.emit('logout');
		removeCookie('login');
		router.push(`http://${process.env.NEXT_PUBLIC_FRONT}:3001/`);
	}
	return (
			<section className="h-full py-4 bg-darken-100 flex flex-col items-center w-[20vw] max-w-[150px]">
				<div className="flex flex-col items-center pt-[20%] gap-5">
					<img className=" w-1/2 aspect-square rounded-full" src={userData.profilePic} alt="user_pic" />
					<h2 className="text-whiteSmoke sm:text-base lg:text-[20px] ">{userData.nickname}</h2>
				</div>
				<div className=" flex flex-col gap-9 mt-[55%]">
					<NavOption icon={BsFillPersonFill} router={router} nickname={userData.nickname}  id={userData.id}/>
					<NavOption icon={BsFillChatSquareDotsFill} nickname={userData.nickname} router={router} id={userData.id} location='chat' socket={userData.chatSocket}/>
					<NavOption icon={FaTableTennis} router={router} nickname={userData.nickname} id={userData.id} location='game'/>
					<NavOption icon={FaUserFriends} router={router} nickname={userData.nickname} id={userData.id} location='friends'/>
				</div>
				<div className="h-full w-[44%] flex flex-col justify-end items-center gap-9 pt-9">
					<MyModal dispatch={props.dispatch}/>
					<button onClick={() => logout()} className="cursor-pointer flex flex-col md:flex-row items-center gap-5 relative">
						<RiLogoutBoxFill style={{color: 'white', fontSize: '24px'}}/>
						<span className="text-md text-whiteSmoke hidden sm:inline capitalize">Logout</span>
					</button>
					{/* <NavOption icon={RiLogoutBoxFill} router={router} nickname={userData.nickname} id={userData.id} location='logout'/> */}
				</div>
			</section>
	);
}