'use client'

import { useEffect, useState } from "react";
import { MatchHistory, GameStats } from "./MatchesNStats";
import { Missions, Achievements } from "./MissionsNAchievements";
import ProfileInfo from "./ProfileInfo";
import SideBar from "./sideBar";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import axios from "axios";

interface Infomations {
	nickname: string,
	wallet: number,
	grade: string,
	level: number,
	fName: string,
	lName: string,
	nickName: string,
	progress: number,
	wins: number,
	losses: number,
	password: string,
	avatar : File | string | HTMLImageElement,
	coverPic: File | string | HTMLImageElement
}

export default function ProfileContent() {
	const [profilePic, setProfilePic] = useState('');
	const [nicknameState, setNickname] = useState('');
	async function fetchUserData(url: string) {
		const {data} = await axios.get(url, {
			withCredentials: true
		})
		console.log(data);
		setProfilePic(data.profilePic);
		setNickname(data.nickname);
	}
	useEffect(() => {
		fetchUserData('http://10.11.100.162:3000/users/profile');
	}, []);
	return(
		<section className='w-full flex h-screen'>
			<SideBar name="asalek" pic={profilePic} changePic={setProfilePic} />
			<div className="flex flex-col items-center gap-[3vh] w-[100vw] h-[100vh] overflow-y-auto m-[auto]">
				<ProfileInfo changePic={setProfilePic} pic={profilePic} nickname={nicknameState} changeNickname={setNickname}/>{/* pass argument */}
				<div className="grid md:grid-cols-2 2xl:grid-cols-4 gap-5 mb-10 w-[90%]">
					<MatchHistory />
					<GameStats />
					<Missions />
					<Achievements />
				</div>
			</div>
		</section>
	);
}