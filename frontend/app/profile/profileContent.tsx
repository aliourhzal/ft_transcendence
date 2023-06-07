
import { MatchHistory } from "./MatchesNStats";
import ProfileInfo from "./ProfileInfo";

export default function ProfileContent() {
    return(
        <section className='w-11/12 flex items-center justify-center gap-5'>
            <ProfileInfo />
            <div className="flex flex-col w-2/6">
                <MatchHistory />
            </div>
        </section>
    );
}