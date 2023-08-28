'use client'

import {BsFillPersonFill} from "react-icons/bs";
import {BsFillChatSquareDotsFill} from "react-icons/bs";
import {FaTableTennis} from "react-icons/fa";
import {FaUserFriends} from "react-icons/fa";
import { RiLogoutBoxFill } from "react-icons/ri"
import MyModal from "./modalPopup";
import { useContext } from "react";
import { userDataContext } from "../../contexts/UniversalData";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie"
import { InvitationSocketContext } from "@/app/contexts/InvitationWebSocket";

interface SideBarProps {
	nickname: string,
	avatar: string,
	passwd: boolean,
	changeNickname: Function,
	changePasswd: Function,
	changeAvatar: Function
}

export function NavOption(props: any) {
	const [cookies, setCookie, removeCookie] = useCookies(["access_token", "login"]);
	const socket = useContext(InvitationSocketContext);
	const emitRoomsRequest = () => {
		props.socket.emit('chat', {jwt: cookies.access_token, socketID: props.socket.id});
	}

	const logout = () => {
		removeCookie('access_token')
		socket.emit('logout');
		removeCookie('login');
		props.router.push("http://127.0.0.1:3001/");
	}

	return (
		<a className="cursor-pointer flex flex-col md:flex-row items-center gap-5" onClick={()=>{
			if (props.location === 'chat')
				emitRoomsRequest()
			else if (props.location === 'logout') {
				logout();
				return ;
			}
			// props.router.push(props.nickname + props.location);
			props.router.push("http://127.0.0.1:3001/" + props.nickname + '/' + (props.location ?? ''));
		}}>
			<props.icon  style={{color: 'white', fontSize: '24px'}}/>
			<span className="text-md text-whiteSmoke hidden sm:inline capitalize">{props.location ?? 'profile'}</span>
		</a>
	);
}

export default function SideBar(props: any)
{
	const router = useRouter();
	const userData = useContext(userDataContext);
	return (
			<section className="h-full py-4 bg-darken-100 flex flex-col items-center w-[20vw] max-w-[150px]">
				<div className="flex flex-col items-center pt-[20%] gap-5">
					<img className=" w-1/2 aspect-square rounded-full" src={userData.profilePic} alt="user_pic" />
					<h2 className="text-whiteSmoke sm:text-base lg:text-[20px] ">{userData.nickname}</h2>
				</div>
				<div className=" flex flex-col gap-9 mt-[55%]">
					<NavOption icon={BsFillPersonFill} router={router} nickname={userData.nickname}/>
					<NavOption icon={BsFillChatSquareDotsFill} nickname={userData.nickname} router={router} location='chat' socket={userData.chatSocket}/>
					<NavOption icon={FaTableTennis} router={router} nickname={userData.nickname} location='game'/>
					<NavOption icon={FaUserFriends} router={router} nickname={userData.nickname} location='friends'/>
				</div>
				<div className="h-full w-[44%] flex flex-col justify-end items-center gap-9 pt-9">
					<MyModal dispatch={props.dispatch}/>
					<NavOption icon={RiLogoutBoxFill} router={router} nickname={userData.nickname} location='logout'/>
				</div>
			</section>
	);
}