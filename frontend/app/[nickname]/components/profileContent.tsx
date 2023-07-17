'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { MatchHistory, GameStats } from "./MatchesNStats";
import { Missions, Achievements } from "./MissionsNAchievements";
import ProfileInfo from "./ProfileInfo";
import SideBar from "./sideBar";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import axios from "axios";
import Router, { useRouter } from "next/navigation";

export const Intra_Id_Context = createContext(null);

export interface Informations {
	intra_Id: number,
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
	console.log(data);
	visitor.nickName = (data.nickname ? data.nickname : undefined);
	visitor.fName = data.firstName;
	visitor.lName = data.lastName;
	visitor.email = data.email;
	visitor.wallet = data.wallet;
	visitor.progress = data.points;
	visitor.avatar = data.profilePic;
	visitor.intra_Id = data.intra_id;
	visitor.password = data.password;
}

export default function ProfileContent()
{
	const router = useRouter();
	let visitor: Informations = {
		intra_Id: 90293,
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
	const [walletState, setWallet] = useState(visitor.wallet);
	const [passwdIs, setPasswd] = useState(visitor.password);

	async function fetchUserData(url: string) {
		//prevent /profile route from getting accessed if user doesn't have access token
		try
		{
			const {data} = await axios.get(url, {
				withCredentials: true
			});
			console.log(data.firstName);
			setValues(visitor, data);//fill visitor object with return server data
		}
		catch(error)
		{
			console.log(error);
			// router.push('http://127.0.0.1:3001/');
		}

		setProfilePic(visitor.avatar);
		setNickname(visitor.nickName);
		setEmail(visitor.email);
		setFname(visitor.fName);
		setLname(visitor.lName);
		setWallet(visitor.wallet);
		setPasswd(visitor.password);

	}
	useEffect(() => {
		fetchUserData('http://127.0.0.1:3000/users/profile');
	}, []);

	return(
		<Intra_Id_Context.Provider value={visitor.intra_Id}>
			{/* <SideBar pass={passwdIs} changePasswd={setPasswd} nickname={nicknameState} changeNickname={setNickname} pic={profilePic} changePic={setProfilePic} /> */}
			<div className="flex flex-col items-center gap-[3vh] flex-grow h-full overflow-y-auto">
				<ProfileInfo wallet={walletState} fname={fNameState} lname={lNameState} email={emailState} changePic={setProfilePic} pic={profilePic} nickname={nicknameState} changeNickname={setNickname} />{/* pass argument */}
				<div className=" playerGameInfo grid grid-cols-1 gap-5 mb-10 w-[90%] h-2/3">
					<MatchHistory />
					<GameStats />
					<Missions />
					<Achievements />
				</div>
			</div>
		</Intra_Id_Context.Provider>
	);
}