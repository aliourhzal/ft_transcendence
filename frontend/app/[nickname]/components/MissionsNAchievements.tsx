import Container from "@/components/UI/ProfileBoxs";
import axios from "axios";
import { useEffect, useState } from "react";
import { GiMineExplosion, GiBrightExplosion, GiExplosiveMaterials, GiWarAxe, GiCaptainHatProfile, GiSpikedDragonHead, GiBadGnome, GiEvilMinion, GiGoat, GiEvilTower, GiThreeBurningBalls } from "react-icons/gi"
import { FaPoo, FaWpbeginner } from "react-icons/fa"
import { CgHello } from "react-icons/cg"


interface MissionProps {
	description: string,
	xp: number
}
interface Achievement{
	id: string,
	category: string
	level: number,
	title: string,
	description: string,
}



function Mission(props: MissionProps) {
	return (
		<div className='w-full rounded-xl flex items-center justify-between bg-darken-300 p-3 gap-2'>
			<span className="text-white">{props.description}</span>
			<span className="text-blue-600 tracking-[1px]">{`+${props.xp}xp`}</span>
		</div>
	);
}

function selectBreaker(level: number) {
	let icon: any = undefined;
	switch (level) {
		case 1:
			icon = GiMineExplosion;
			break;
		case 2:
			icon = GiBrightExplosion;
			break;
		case 3:
			icon = GiExplosiveMaterials;
			break;
		case 4:
			icon = GiWarAxe;
			break;
	}
	return (icon)
}

function selectSeniority(level: number) {
	let icon: any = undefined;
	switch (level) {
		case 1:
			icon = FaPoo;
			break;
		case 2:
			icon = FaWpbeginner;
			break;
		case 3:
			icon = GiCaptainHatProfile;
			break;
		case 4:
			icon = GiSpikedDragonHead;
			break;
	}
	return (icon)
}

function selectEvil(level: number) {
	let icon: any = undefined;
	switch (level) {
		case 1:
			icon = GiBadGnome;
			break;
		case 2:
			icon = GiEvilMinion;
			break;
		case 3:
			icon = GiGoat;
			break;
		case 4:
			icon = GiEvilTower;
			break;
	}
	return (icon)
}

function Achieve({achievement}: {achievement: Achievement}) {
	let Icon: any;
	switch (achievement.category) {
		case 'breaker':
			Icon = selectBreaker(achievement.level);
			break;
		case 'seniority':
			Icon = selectSeniority(achievement.level);
			break;
		case 'humiliator':
			Icon = selectEvil(achievement.level);
			break;
		case 'Welcome':
			Icon = CgHello;
			break;
		case 'hat-trick':
			Icon = GiThreeBurningBalls;
			break;
	}
	return (
		<div className='w-full rounded-xl flex flex-col items-start justify-between bg-darken-300 p-3 gap-2'>
			<div className="flex gap-5 w-full h-auto items-center">
				<div className="h-10 w-10 rounded-full flex items-center justify-center bg-blueStrong">
					<Icon color='white' size='23'/>
				</div>
				<span className=" text-lg font-bold text-blue-400">{achievement.title}</span>
			</div>
			<p className="text-white tracking-[1px]">{achievement.description}</p>
		</div>
	);
}

export function Missions() {
	const [missions, setMissions] = useState<MissionProps[]>([])
	useEffect(() => {
		axios.get('http://127.0.0.1:3000/users/profile/missions', {
			withCredentials: true,
		})
		.then(res => setMissions(res.data))
		.catch(err => console.log(err));
	}, [])
	return (
		<Container className='p-5 bg-darken-100 rounded-xl flex flex-col gap-5'>
			<h2 className='text-white'>Missions</h2>
			<div className='matchHistoryBody flex flex-col gap-3 overflow-y-auto max-h-[266px]'>
				{
					missions.map(m => {
						return (
							<Mission description={m.description} xp={m.xp}/>
						);
					})
				}
			</div>
		</Container>
	);
}

export function Achievements() {
	const [achievements, setAchievements] = useState<Achievement[]>([])
	useEffect(() => {
		axios.get('http://127.0.0.1:3000/users/profile/achievements', {
			withCredentials: true,
		})
		.then(res => setAchievements(res.data))
		.catch(err => console.log(err));
	}, [])
	return (
		<Container className='p-5 bg-darken-100 rounded-xl flex flex-col gap-5'>
			<h2 className='text-white'>Achievements</h2>
			<div className='matchHistoryBody flex flex-col gap-3 overflow-y-auto max-h-[420px]'>
				{
					achievements.map(a => {
						return(
							<Achieve achievement={a}/>
						);
					})
				}
			</div>
		</Container>
	);
}