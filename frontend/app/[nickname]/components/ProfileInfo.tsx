'use client'

import { useContext, useEffect, useState } from "react";

import { UniversalData } from "../../contexts/UniversalData";
import { InvitationSocketContext } from "@/app/contexts/InvitationWebSocket";
import axios from "axios";


export default function ProfileInfo(props: {data: UniversalData, currentUser: boolean})
{
	const levelProgress = `${props.data.level.toString().split('.')[1]}%`;
	const socket = useContext(InvitationSocketContext);
	const [showSendRequest, setShowSendRequest] = useState(!props.currentUser);

	async function sendFriendRequest() {
		socket.emit('send-request', {
			friend: props.data.nickname
		});
	}

	useEffect(() => {
		if (!props.currentUser) {
			axios.get(`http://${process.env.NEXT_PUBLIC_BACK}:3000/users/friend/checkFriend`, {
				params: {
					nickname: props.data.nickname
				},
				withCredentials: true
			})
			.then(res => {
				setShowSendRequest(res.data);
			})
		}
		socket.on('receive-friends', data => {
			if (data.nickname === props.data.nickname)
				setShowSendRequest(false);
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div style={{backgroundImage: `url(${props.data.coverPic})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}} className="text-md flex flex-col justify-between items-center md:justify-end md:items-end gap-3 w-[90%] mt-[3%] min-h-[700px] md:min-h-[550px] h-1/3 rounded-3xl relative">	
			<div className="flex justify-center md:justify-start w-[100%] md:w-[70%] mt-4 md:mt-0">
				<div className="flex w-[90%] md:w-[70%] bg-darken-100/70 backdrop-blur-md justify-around py-3 rounded-full">
					<div className="flex gap-0 flex-col sm:flex-row items-center md:gap-2">
						<h2 className="text-blueStrong">Grade:&nbsp;</h2>
						<p className="text-whiteSmoke">Starter</p>
					</div>
					<div className="flex gap-0 flex-col sm:flex-row items-center md:gap-2">
						<h2 className="text-blueStrong">Wallet:&nbsp;</h2>
						<p className="text-whiteSmoke">{props.data.wallet}</p>
					</div>
					<div className="flex gap-0 flex-col sm:flex-row items-center md:gap-2">
						<h2 className="text-blueStrong">Level:&nbsp;</h2>
						<p className="text-whiteSmoke">{props.data.level.toString().split('.')[0]}</p>
					</div>
				</div>
			</div>
			<div className="flex flex-col md:flex-row items-center w-[100%] bg-darken-100/70 backdrop-blur-md h-[50%] md:h-[40%] rounded-b-3xl">{/* the fname lname div */}
				<div className="w-full md:w-[30%] h-[90px] md:h-full">
					<div style={{backgroundImage: `url(${props.data.profilePic as string})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover'}} className=' flex items-end justify-center p-3 translate-y-[-50%] max-w-[150px] md:max-w-[250px] min-w-[150px] md:w-[70%] w-[40%] h-[auto] aspect-square m-[auto] rounded-full'>
					</div>
				</div>
				<div className="flex flex-col justify-evenly items-center md:items-start w-[100%] md:w-[70%] h-full">
					<div className="flex flex-wrap justify-evenly md:justify-between gap-3 w-[90%] ">{/* row 1 */}
						<div className="flex flex-col gap-1 items-start">
							<h2 className="text-gray-500 text-sm">First Name</h2>
							<p className="text-whiteSmoke">{props.data.firstName}</p>
						</div>
						<div className="flex flex-col gap-1 items-start">
							<h2 className="text-gray-500 text-sm">Last Name</h2>
							<p className="text-whiteSmoke">{props.data.lastName}</p>
						</div>
						<div className="flex flex-col gap-1 items-start ">
							<h2 className="text-gray-500 text-sm">Nickname</h2>
							<p className="text-whiteSmoke">{props.data.nickname}</p>
						</div>
						<div className="flex flex-col items-center gap-1 md:items-start ">
							<h2 className="text-gray-500 text-sm">Email</h2>
							<p className="text-whiteSmoke">{props.data.email}</p>
						</div>
					</div>
					<div className=" w-[90%] rounded-full bg-darken-300 h-9">
						<div className="flex items-center justify-end bg-blue-600 text-xs h-full font-medium text-blue-100 text-center p-2 leading-none rounded-full" style={{width: levelProgress}}>{levelProgress}</div>
					</div>
					{
						!props.currentUser && showSendRequest && 
						<div className="w-[90%] flex justify-center">
							<button className="py-2 px-4 bg-blueStrong text-white rounded-xl font-medium" onClick={sendFriendRequest}>send Request</button>
						</div>
					}
				</div>
			</div>
		</div>
	)
}

//daisyUi
//react-daisyUi
//headlessUi