'use client'

import {BsFillPersonFill} from "react-icons/bs";
import {BsFillChatSquareDotsFill} from "react-icons/bs";
import {FaTableTennis} from "react-icons/fa";
import MyModal from "./modalPopup";
import { useContext } from "react";
import { userDataContext } from "../layout";

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
		<a className="flex flex-col md:flex-row items-center gap-5" href="/profile" onClick={() => console.log('helo')}>
			<props.icon  style={{color: 'white', fontSize: '24px'}}/>
			<span className="text-md text-whiteSmoke hidden sm:inline capitalize">{props.option}</span>
		</a>
	);
}

export default function SideBar(props: any)
{
	const userData = useContext(userDataContext);
	return (
			<section className="h-full py-4 bg-darken-100 flex flex-col items-center w-[20vw] max-w-[150px]">
				<div className="flex flex-col items-center pt-[20%] gap-5">
					<img className=" w-1/2 aspect-square rounded-full" src={userData.profilePic} alt="user_pic" />
					<h2 className="text-whiteSmoke sm:text-base lg:text-[20px] ">{userData.nickname}</h2>
				</div>
				<div className=" flex flex-col gap-9 mt-[55%]">
					<NavOption icon={BsFillPersonFill} option='profile'/>
					<NavOption icon={BsFillChatSquareDotsFill} option='chat'/>
					<NavOption icon={FaTableTennis} option='game'/>
				</div>
				<div className="h-full w-[44%] flex justify-center items-end">
					<MyModal dispatch={props.dispatch}/>
				</div>
			</section>
	);
}