import Container from "@/components/UI/ProfileBoxs";
import { UniversalData } from "../../layout";


export default function FriendCard({user}: {
	user: UniversalData
}) {
	return (
		<Container className="p-0 overflow-hidden flex flex-col items-center relative">
			<div style={{backgroundImage: `url(${user.coverPic})`}} className="bg-cover bg-center bg-no-repeat w-[100%] h-[150px] rounded-lg"></div>
			<div className="translate-y-[-50%] flex flex-col items-center">
				<img src={user.profilePic} alt="avatar" className="h-[130px] w-[130px] rounded-full" />
				<span className="text-white font-medium text-lg">{user.nickname}</span>
			</div>
			{/* <div className="absolute top-0 left-0 h-full w-full z-10 bg-black opacity-50"></div> */}
		</Container>
	);
}