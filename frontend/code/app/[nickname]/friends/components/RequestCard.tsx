'use client'

import { InvitationSocketContext } from "@/app/contexts/InvitationWebSocket";
import { useContext } from "react";
import {BsCheck2} from "react-icons/bs"
import {RxCross1} from "react-icons/rx"

export default function RequestCard({request}) {
	const socket = useContext(InvitationSocketContext);

	function createAcceptFunc(requestId: string) {
		return (async (e) => {
			try {
				socket.emit('accept-request', {
					requestId
				})
			} catch (err) {
			}
		})
	}
	
	function createRefuseFunc(requestId: string) {
		return (async (e) => {
			try {
				socket.emit('refuse-request', {
					requestId
				})
			} catch (err) {
			}
		})
	}

	return(
		<div className="flex rounded-md items-center gap-4 bg-darken-100 p-3 w-full">
			<img src={request.sender.profilePic} alt="avatar" className="h-[50px] aspect-square rounded-full"/>
			<span className="text-white font-medium">{request.sender.nickname}</span>
			<div className="ml-[auto] flex gap-3">
				<button className="h-[90%] aspect-square  rounded-full p-2 border-2 border-slate-500" onClick={createAcceptFunc(request.id)}>
					<BsCheck2 color="rgb(100 116 139)" fontSize="1.2rem"/>
				</button>
				<button className="h-[90%] aspect-square  rounded-full p-2 border-2 border-slate-500" onClick={createRefuseFunc(request.id)}>
					<RxCross1 color="rgb(100 116 139)" fontSize="1.2rem"/>
				</button>
			</div>
		</div>
	);
}