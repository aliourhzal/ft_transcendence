
'use client'
import { MatchHistory, GameStats } from "./MatchesNStats";
import { Missions, Achievements } from "./MissionsNAchievements";
import ProfileInfo from "./ProfileInfo";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { userDataContext } from "../layout";

export default function ProfileContent()
{
	const router = useRouter();
	const userData = useContext(userDataContext);
	return(
		<div className="flex flex-col items-center gap-[3vh] flex-grow h-full overflow-y-auto">
			<ProfileInfo data={userData}/>
			<div className=" playerGameInfo grid grid-cols-1 gap-5 mb-10 w-[90%] h-2/3">
				<MatchHistory />
				<GameStats />
				<Missions />
				<Achievements />
			</div>
		</div>
	);
}