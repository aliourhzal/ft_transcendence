
import ProfileContent from "./profileContent";
import SideBar from "./sideBar";

export default function Profile() {
    return (
        <main className='h-full w-full bg-darken-200 flex '>
            {/*side bar*/}
            <SideBar />
            <ProfileContent />
        </main>
    );
}