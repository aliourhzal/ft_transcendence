'use client'

import { useEffect, useState } from "react";
import { MatchHistory, GameStats } from "./MatchesNStats";
import { Missions, Achievements } from "./MissionsNAchievements";
import ProfileInfo from "./ProfileInfo";
import SideBar from "./sideBar";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import axios from "axios";

export interface Informations {
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
	avatar?: string,
	coverPic?: File | string | HTMLImageElement
}

function setValues(visitor:Informations, data:any)
{
	visitor.nickName = (data.nickname ? data.nickname : undefined);
	visitor.fName = data.firstName;
	visitor.lName = data.lastName;
	visitor.email = data.email;
	visitor.wallet = data.wallet;
	visitor.progress = data.points;
	visitor.avatar = data.profilePic;
}

export default function ProfileContent()
{
	let visitor: Informations = {
		wallet: 0,
		grade : '',
		level : 0,
		fName: '',
		lName: '',
		email: '',
		nickName: '',
		progress : 0,
		wins : 0,
		losses : 0,
		password : false,
		avatar : 'images/man.png',
		coverPic : ''
	};
	const [profilePic, setProfilePic] = useState(visitor.avatar);
	const [nicknameState, setNickname] = useState(visitor.nickName);
	const [emailState, setEmail] = useState(visitor.email);
	const [fNameState, setFname] = useState(visitor.fName);
	const [lNameState, setLname] = useState(visitor.lName);
	async function fetchUserData(url: string) {
		const {data} = await axios.get(url, {
			withCredentials: true
		})
		console.log(data);
		setValues(visitor, data);//fill visitor object with return server data
	}
	useEffect(() => {
		fetchUserData('http://127.0.0.1:3000/users/profile');
	}, []);

	return(
		<section className='w-full flex h-screen'>
			<SideBar nickname={nicknameState} changeNickname={setNickname} pic={profilePic} changePic={setProfilePic} />
			<div className="flex flex-col items-center gap-[3vh] w-[100vw] h-[100vh] overflow-y-auto mb-10">
				<ProfileInfo fname={fNameState} lname={lNameState} email={emailState} changePic={setProfilePic} pic={profilePic} nickname={nicknameState} changeNickname={setNickname} />{/* pass argument */}
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