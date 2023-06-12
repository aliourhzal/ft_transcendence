
import { MatchHistory, GameStats } from "./MatchesNStats";
import { Missions } from "./MissionsNAchievements";
import ProfileInfo from "./ProfileInfo";
import SideBar from "./sideBar";

interface infomations{
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
	avatar : File | string | HTMLImageElement
}

export default function ProfileContent() {
	return(
		<section className='w-full flex h-screen'>
			<SideBar name="asalek"/>
			<div className="flex flex-col items-center gap-[3vh] w-[100vw] h-[100vh] overflow-y-auto m-[auto]">
				<ProfileInfo />{/* pass argument */}
				<div className="grid md:grid-cols-2 2xl:grid-cols-4 gap-5 mb-10 w-[90%]">
					<MatchHistory />
					<GameStats />
					<Missions />
					<GameStats />
				</div>
			</div>
		</section>
	);
}