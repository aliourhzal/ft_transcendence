'use client'

import { useEffect, useState } from "react";
import { MatchHistory, GameStats } from "./MatchesNStats";
import { Missions, Achievements } from "./MissionsNAchievements";
import ProfileInfo from "./ProfileInfo";
import SideBar from "./sideBar";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import axios from "axios";

export interface Informations {
	nickname?: string,
	wallet?: number,
	grade?: string,
	level?: number,
	fName?: string,
	lName?: string,
	email?: string,
	nickName?: string,
	progress?: number,
	wins?: number,
	losses?: number,
	password?: boolean,
	avatar?: File | string | HTMLImageElement,
	coverPic?: File | string | HTMLImageElement
}

export default function ProfileContent() {
	const [profilePic, setProfilePic] = useState('images/man.png');
	const [nicknameState, setNickname] = useState('hello');
	async function fetchUserData(url: string) {
		const {data} = await axios.get(url, {
			withCredentials: true
		})
		setProfilePic(data.profilePic);
		setNickname(data.nickname);
	}
	useEffect(() => {
		// fetchUserData('http://127.0.0.1:3000/users/profile');
	}, []);
	return(
		<section className='w-full flex h-screen'><SideBar nickname={nicknameState} changeNickname={setNickname} pic={profilePic} changePic={setProfilePic} />
			<div className="flex flex-col items-center gap-[3vh] w-[100vw] h-[100vh] overflow-y-auto mb-10">
				<ProfileInfo changePic={setProfilePic} pic={profilePic} nickname={nicknameState} changeNickname={setNickname} />{/* pass argument */}
				<div className=" playerGameInfo grid grid-cols-1 gap-5 mb-10 w-[90%] h-2/3">
					<MatchHistory />
					<GameStats />
					<Missions />
					<Achievements />
				</div>
			</div>
		</section>
	);
}