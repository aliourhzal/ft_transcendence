
import ProfileContent from "./profileContent";

export default function Profile() {
    return (
        <main className='h-full w-full bg-slate-800 flex '>
            <div className='h-full w-1/12 bg-red-500'></div>{/*side bar*/}
            <ProfileContent />
        </main>
    );
}