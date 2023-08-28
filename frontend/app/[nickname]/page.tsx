'use client'

import { UniversalData, userDataContext } from "../contexts/UniversalData";
import { useContext, useEffect, useState } from "react";

import { MatchHistory, GameStats } from "./components/MatchesNStats";
import { Missions, Achievements } from "./components/MissionsNAchievements";
import ProfileInfo from "./components/ProfileInfo";
import FriendsCarouselBar from "./components/friendsCarouselBar";
import axios from "axios";
import NotFound from "./components/not-found";

export default function Profile(props) {
	const [completed, setCompleted] = useState(false);
	const [err, setErr] = useState(false);
	const loggedUser = useContext(userDataContext)
	const [userData, setUserData] = useState<UniversalData>(loggedUser);

	async function fetchUserData(nickname: string) {
		try {
			const {data} = await axios.get('http://127.0.0.1:3000/users/profile', {
				params: {
					nickname: props.params.nickname
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

	useEffect(() => {
		if (loggedUser.nickname !== props.params.nickname)
			fetchUserData(props.params.nickname);
		else 
			setCompleted(true);
	}, [])
	return (
		<main className='h-full w-full bg-darken-200 overflow-y-auto'>
			<div className="flex flex-col items-center gap-[2vh] flex-grow h-full overflow-y-auto relative">
				{
					completed && !err ?
					<>
						<ProfileInfo data={userData} currentUser={loggedUser.nickname === props.params.nickname}/>
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
			</div>
		</main>
	);
}