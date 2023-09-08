import Container from "@/components/UI/ProfileBoxs";
import { UniversalData, userDataContext } from "../../../contexts/UniversalData";
import Link from "next/link"
import { useContext, useEffect, useState } from "react";
import { InvitationSocketContext } from "@/app/contexts/InvitationWebSocket";
import Game from "../../game/Game";


export default function FriendCard({user, setPlay}: {
	user: UniversalData,
	setPlay: Function
}) {
	const [lvl, progess] = user.level.toString().split('.');
	const socket = useContext(InvitationSocketContext);
	const loggedUser = useContext(userDataContext);
	
	function removeFriend() {
		socket.emit('delete-friend', user.id);
	}
	
	return (
		<>
			<Container className="p-0 overflow-hidden flex flex-col items-center relative">
				<div style={{backgroundImage: `url(${user.coverPic})`}} className="bg-cover bg-center bg-no-repeat w-full h-[150px] rounded-lg"></div>
				<img src={user.profilePic} alt="avatar" className="h-[130px] w-[130px] rounded-full mt-[-90px]" />
				<div className="flex flex-col gap-3 items-center w-full">
					<span className="text-white font-medium text-lg">{user.nickname}</span>
					<div className="flex justify-evenly w-full">
						<div className="flex flex-col items-center">
							<span className="text-blueStrong font-medium">wallet</span>
							<span className="text-white">{user.wallet}</span>
						</div>
						<div className="flex flex-col items-center">
							<span className="text-blueStrong font-medium">level</span>
							<span className="text-white">{lvl}</span>
						</div>
					</div>
					<div className="w-full h-[30px] bg-darken-300 rounded-full">
						<div style={{width: `${progess}%`}} className={` bg-blueStrong h-full rounded-full flex items-center justify-end p-1`}>
							<span className="text-[12px] font-medium text-white">{`${progess}%`}</span>
						</div>
					</div>
				</div>
				<div className="flex justify-between w-full">
					<Link href={`/${user.nickname}`} className="p-2 bg-green-500 text-white font-medium rounded-xl">See Profile</Link>
					<Link href={`/${loggedUser.nickname}/game?id=${user.id}`} className="p-2 bg-blue-500 text-white font-medium rounded-xl">Play</Link>
					<button onClick={removeFriend} className="p-2 bg-red-500 text-white font-medium rounded-xl">Remove Friend</button>
				</div>
				{
					user.status === 'offline' && <div className="absolute top-0 left-0 h-full w-full z-10 bg-black opacity-50"></div>
				}
			</Container>
		</>
	);
}

/**
 * 
 * bc: "#FFFFFF"
 * bg: "#353D49"
 * p1: "#2879F2"
 * p2: "#E8EAEB"
 * 
 */