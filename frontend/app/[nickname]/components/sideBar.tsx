'use client'

import {BsFillPersonFill} from "react-icons/bs";
import {BsFillChatSquareDotsFill} from "react-icons/bs";
import {FaTableTennis} from "react-icons/fa";
import MyModal from "./modalPopup";
import { useContext } from "react";
import { userDataContext } from "../layout";
import { useRouter } from "next/navigation";

interface SideBarProps {
	nickname: string,
	avatar: string,
	passwd: boolean,
	changeNickname: Function,
	changePasswd: Function,
	changeAvatar: Function
}

export function NavOption(props: any) {
	return (
		<a className="cursor-pointer flex flex-col md:flex-row items-center gap-5" onClick={() => 
			props.router.push("http://127.0.0.1:3001/" + props.nickname + '' + props.location)
		}>
			<props.icon  style={{color: 'white', fontSize: '24px'}}/>
			<span className="text-md text-whiteSmoke hidden sm:inline capitalize">{props.option}</span>
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
					<NavOption icon={BsFillPersonFill} router={router} nickname={props.nickname} location='/' option='profile'/>
					<NavOption icon={BsFillChatSquareDotsFill} nickname={props.nickname} router={router} location='/' option='chat'/>
					<NavOption icon={FaTableTennis} router={router} nickname={props.nickname} location='/game' option='game'/>
				</div>
				<div className="h-full w-[44%] flex justify-center items-end">
					<MyModal dispatch={props.dispatch}/>
				</div>
			</section>
	);
}