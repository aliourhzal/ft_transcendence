
import { MatchHistory, GameStats } from "./MatchesNStats";
import ProfileInfo from "./ProfileInfo";

export default function ProfileContent() {
    return(
        <section className='w-10/12 flex min-[1020px]:items-center justify-center h-screen ml-[auto]'>
            <div className='flex flex-col items-center gap-8 lg:flex-row mb-10'>
                <ProfileInfo />{/* pass argument */}
                <div className="flex flex-col gap-8 xl:w-3/6 w-5/6">
                    <MatchHistory />
                    <GameStats />{/* pass argument */}
                </div>
            </div>
        </section>
    );
}