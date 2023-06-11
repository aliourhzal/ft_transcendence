
import { MatchHistory, GameStats } from "./MatchesNStats";
import ProfileInfo from "./ProfileInfo";
import SideBar from "./sideBar";

export default function ProfileContent() {
    return(
        <section className='w-full flex flex-col items-center h-screen gap-5'>
            <SideBar name="asalek"/>
            <ProfileInfo />{/* pass argument */}
            {/* <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
                <MatchHistory />
                <GameStats />
            </div> */}
        </section>
    );
}