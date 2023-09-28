'use client'

import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { InvitationSocketContext } from "@/app/contexts/InvitationWebSocket";
import { RiUserReceivedFill } from 'react-icons/ri'
import RequestCard from "./RequestCard";
import Popup from "@/components/UI/Popup";


export default function FriendsRequests() {
	const [requestCounter, setRequestCounter] = useState(0);
	const [displayRequests, setDisplayRequests] = useState(false);
	const [requestArray, setRequestArray] = useState([]);
	const socket = useContext(InvitationSocketContext);

	useEffect(() => {
		const requests = axios.get(`http://${process.env.NEXT_PUBLIC_BACK}:3000/users/friend/requests`, {
			withCredentials: true
		}).then(res => {
			setRequestArray(res.data);
			setRequestCounter(res.data.length);
		}).catch();
		socket.on('receive-request', (data) => {
			setRequestCounter(data.length);
			setRequestArray(data);
		})
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	function modalAppearance() {
		setDisplayRequests(oldState => !oldState)
	}

	return(
		<>
			<button className="p-3 text-white font-medium text-sm bg-darken-300 rounded-xl ml-[auto] relative" onClick={modalAppearance}>
				<span className="text-white font-medium text-sm md:block hidden">Friend Requests</span>
				<span className="md:hidden block">
					<RiUserReceivedFill color="white" size="1.5rem"/>
				</span>
				{
					requestCounter !== 0 && <span className="absolute bottom-[-10px] right-[-10px] bg-red-500 rounded-full h-[30px] aspect-square flex items-center justify-center">{requestCounter}</span>
				}
			</button>
			<Popup additionalClass="flex flex-col gap-4" isOpen={displayRequests} modalAppearance={setDisplayRequests}>
				{
					requestArray.length > 0 ? requestArray.map((request) => {
						return (
							<RequestCard key={request.id} request={request} />
						)
					}) : <span className="font-medium text-base">You have no Friend Requests</span>
				}
			</Popup>
		</>
	);
}