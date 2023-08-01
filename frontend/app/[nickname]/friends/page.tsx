'use client'

import Container from "@/components/UI/ProfileBoxs";
import CircularProgress from '@mui/material/CircularProgress';

import axios from "axios";
import { useState, useContext, useEffect } from "react";
import FriendsRequests from "./components/FriendsRequest";
import { InvitationSocketContext } from "@/app/context_sockets/InvitationWebSocket";
import FriendCard from "./components/FriendCard";
import { UniversalData } from "../layout";

export default function Friends() {
	const [requestErr, setRequestErr] = useState('');
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
	}

	useEffect(() => {
		axios.get('http://127.0.0.1:3000/users/friends', {
			withCredentials: true
		})
		.then(res => {
			console.log(res.data);
			setFriends(res.data);
		})
		socket.on('receive-friends', data => {
			setFriends(data);
		})
	}, [])

	return (
		<main className='h-full w-full bg-darken-200 overflow-y-auto relative'>
			<div className=" gap-[3vh] flex-grow h-full overflow-y-auto">
				<div className="sticky top-0 flex w-full backdrop-blur-xl p-3 z-50">
					<form className="w-[70%] flex gap-3" onSubmit={onSubmitHandler}>
						<input className="p-3 rounded-xl text-white bg-darken-300 outline-none w-[70%]" type="text" placeholder="You are looking for someone? enter his Nickname"/>
						<button type="submit" className="p-3 text-white font-medium bg-darken-300 rounded-xl flex items-center justify-center w-[140px]">
							{
								isLoading ? <CircularProgress size="1.5rem"/> : <span>Send Request</span>
							}
						</button>
					</form>
					<FriendsRequests />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-5 p-5">
					{
						friends.length > 0 ? friends.map((friend) => {
							return(
								<FriendCard key={friend.intra_Id} user={friend}/>
							);
						}) : <span className="text-white font-medium text-2xl absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">You have no Friends</span>
					}
				</div>
			</div>
		</main>
	);
}