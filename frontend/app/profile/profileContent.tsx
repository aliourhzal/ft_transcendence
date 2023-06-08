
import { MatchHistory, GameStats } from "./MatchesNStats";
import ProfileInfo from "./ProfileInfo";

export default function ProfileContent() {
    return(
        <section className='w-11/12 flex flex-col items-center justify-center gap-5 xl:flex-row'>
            <ProfileInfo />{/* pass argument */}
            <div className="flex flex-col xl:w-2/6 w-3/4 gap-5">
                <MatchHistory />{/* pass argument */}
                <GameStats />{/* pass argument */}
            </div>
        </section>
    );
}