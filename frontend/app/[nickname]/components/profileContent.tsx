
'use client'
import { MatchHistory, GameStats } from "./MatchesNStats";
import { Missions, Achievements } from "./MissionsNAchievements";
import ProfileInfo from "./ProfileInfo";
import { useContext } from "react";
import { userDataContext } from "../layout";
import FriendsCarouselBar from "./friendsCarouselBar";

export default function ProfileContent()
{
	const userData = useContext(userDataContext);
	return(
		<div className="flex flex-col items-center gap-[2vh] flex-grow h-full overflow-y-auto">
			<ProfileInfo data={userData}/>
			<FriendsCarouselBar />
			<div className=" playerGameInfo grid grid-cols-1 gap-5 mb-10 w-[90%]">
				<MatchHistory />
				<GameStats />
				<Missions />
				<Achievements />
			</div>
		</div>
	);
}