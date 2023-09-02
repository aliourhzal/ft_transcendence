'use client'

import { UniversalData, userDataContext } from "../contexts/UniversalData";
import { useContext, useEffect, useState } from "react";

import { MatchHistory, GameStats } from "./components/MatchesNStats";
import { Missions, Achievements } from "./components/MissionsNAchievements";
import ProfileInfo from "./components/ProfileInfo";
import FriendsCarouselBar from "./components/friendsCarouselBar";
import axios from "axios";
import NotFound from "./components/not-found";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { InvitationSocketContext } from "@/app/contexts/InvitationWebSocket";

export default function Profile(props) {
	const [completed, setCompleted] = useState(false);
	const [notif, setNotify] = useState("");
	const [err, setErr] = useState(false);
	const loggedUser = useContext(userDataContext)
	const [userData, setUserData] = useState<UniversalData>(loggedUser);
	const socket = useContext(InvitationSocketContext);
	async function fetchUserData(nickname: string) {
		try {
			const {data} = await axios.get('http://127.0.0.1:3000/users/profile', {
				params: {
					nickname
				},
				withCredentials: true
			})
			setUserData(data);
			setCompleted(true);
		} catch (err) {
			setErr(true);
			setCompleted(true);
		}
	}
	const notify = () => {
		setNotify("");
		return toast(notif + " Sent you a friend request !!")
	};
	useEffect(() => {
		socket.on('receive-request', data => {
			if (data.length > 0)
				setNotify(data[data.length - 1]?.sender.nickname);
		});
		if (loggedUser.nickname !== props.params.nickname)
			fetchUserData(props.params.nickname);
		else 
			setCompleted(true);
	}, [])
	return (
		<main className='h-full w-full bg-darken-200 overflow-y-auto'>
			<div className="flex flex-col items-center gap-[2vh] flex-grow h-full overflow-y-auto relative">
				{
					notif && notify()
				}
				{
					completed && !err ?
					<>
						<ProfileInfo data={loggedUser.nickname !== props.params.nickname ? userData : loggedUser} currentUser={loggedUser.nickname === props.params.nickname}/>
						{
							loggedUser.nickname === props.params.nickname && <FriendsCarouselBar />
						}
						<div className=" playerGameInfo grid grid-cols-1 gap-5 mb-10 w-[90%]">
							<MatchHistory />
							<GameStats />
							<Missions />
							<Achievements />
						</div>
					</> : <NotFound nickname={loggedUser.nickname}/>
				}
				<ToastContainer 
					// theme="dark"
				/>
			</div>
		</main>
	);
}