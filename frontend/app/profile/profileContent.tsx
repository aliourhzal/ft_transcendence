
import { MatchHistory, GameStats } from "./MatchesNStats";
import ProfileInfo from "./ProfileInfo";
import SideBar from "./sideBar";

export default function ProfileContent() {
	return(
		<section className='w-full flex h-screen'>
			<SideBar name="asalek"/>
			<div className="flex flex-col items-center gap-[3vh] w-[100vw] h-[100vh] overflow-y-auto m-[auto]">
				<ProfileInfo />{/* pass argument */}
				<div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5 mb-10 w-[90%] ">
					<MatchHistory />
					<GameStats />
					<MatchHistory />
					<GameStats />
				</div>
			</div>
		</section>
	);
}