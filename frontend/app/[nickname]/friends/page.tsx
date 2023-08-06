'use client'

import CircularProgress from '@mui/material/CircularProgress';

import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { IoMdSend } from 'react-icons/io'
import FriendsRequests from "./components/FriendsRequest";
import { InvitationSocketContext } from "@/app/context_sockets/InvitationWebSocket";
import FriendCard from "./components/FriendCard";
import { UniversalData } from "../layout";

export default function Friends() {
	const [requestErr, setRequestErr] = useState<{display: boolean, response: {err: boolean, msg: string}}>({display: false, response: {err: false, msg: ''}});
	const [isLoading, setIsLoading] = useState(false);
	const [friends, setFriends] = useState<UniversalData[]>([]);
	const socket = useContext(InvitationSocketContext);

	async function onSubmitHandler(e) {
		e.preventDefault();
		const nickname = e.target[0].value;
		console.log(nickname);
		setIsLoading(true);
		socket.emit('send-request', {
			friend: nickname
		})
		setIsLoading(false);
		e.target[0].value = '';
		e.target[0].blur();
	}

	useEffect(() => {
		axios.get('http://127.0.0.1:3000/users/friends', {
			withCredentials: true
		})
		.then(res => {
			setFriends(res.data);
		})
		socket.on('receive-friends', data => {
			console.log(data.nickname);
			setFriends(oldFriends => [...oldFriends, data]);
		});
		socket.on('request-response', response => {
			setRequestErr({display: true, response});
			setTimeout(() => {
				setRequestErr({display: false, response})
			}, 2500);
		})
	}, [])

	return (
		<main className='h-full w-full bg-darken-200 overflow-y-auto relative'>
			<span className={`px-3 py-1 ${requestErr.response.err ? 'bg-red-500': 'bg-green-500'} z-50 absolute top-[35px] left-[50%] translate-x-[-50%] translate-y-[-50%] text-sm text-white rounded-md ${requestErr.display ? 'opacity-100' : 'opacity-0'} ease-in duration-200`}>{requestErr.response.msg}</span>
			<div className=" gap-[3vh] flex-grow h-full overflow-y-auto">
				<div className="sticky top-0 flex w-full backdrop-blur-xl p-3 z-2co0">
					<form className="w-[90%] sm:w-[75%] flex gap-3" onSubmit={onSubmitHandler}>
						<input className="p-3 rounded-xl text-white bg-darken-300 outline-none w-[70%]" type="text" placeholder="enter Nickname"/>
						<button type="submit" className="p-3 bg-darken-300 rounded-xl flex items-center justify-center">
							{
								isLoading ? <CircularProgress size="1.5rem"/> :
								<>
									<span className="text-white font-medium text-sm md:block hidden">Send Request</span>
									<span className="md:hidden block">
										<IoMdSend color="white" size="1.5rem"/>
									</span>
								</>
							}
						</button>
					</form>
					<FriendsRequests />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-5 p-5">
					{
						friends.length > 0 ? friends.map((friend) => {
							return(
								<FriendCard key={friend.nickname} user={friend}/>
							);
						}) : <span className="text-white font-medium text-xl absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] ">You have no Friends</span>
					}
				</div>
			</div>
		</main>
	);
}