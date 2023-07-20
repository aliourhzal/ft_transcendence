
import ProfileContent from "./components/profileContent";
// import SideBar from "./sideBar";

export default function Profile(props) {
	console.log('1');
    return (
        <main className='h-full w-full bg-darken-200 overflow-y-auto'>
            <ProfileContent />
        </main>
    );
}