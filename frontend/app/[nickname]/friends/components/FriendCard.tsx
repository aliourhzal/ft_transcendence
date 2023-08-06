import Container from "@/components/UI/ProfileBoxs";
import { UniversalData } from "../../layout";


export default function FriendCard({user}: {
	user: UniversalData
}) {
	const [lvl, progess] = user.level.toString().split('.');
	console.log(progess);
	console.log(user);
	return (
		<Container className="p-0 overflow-hidden flex flex-col items-center relative">
			<div style={{backgroundImage: `url(${user.coverPic})`}} className="bg-cover bg-center bg-no-repeat w-full h-[150px] rounded-lg"></div>
			<img src={user.profilePic} alt="avatar" className="h-[130px] w-[130px] rounded-full mt-[-90px]" />
			<div className="flex flex-col gap-3 items-center w-full">
				<span className="text-white font-medium text-lg">{user.nickname}</span>
				<div className="flex justify-evenly w-full">
					<div className="flex flex-col items-center">
						<span className="text-blueStrong font-medium">wallet</span>
						<span className="text-white">{user.wallet}</span>
					</div>
					<div className="flex flex-col items-center">
						<span className="text-blueStrong font-medium">level</span>
						<span className="text-white">{lvl}</span>
					</div>
				</div>
				<div className="w-full h-[30px] bg-darken-300 rounded-full">
					<div className={`w-[${progess}%] bg-blueStrong h-full rounded-full flex items-center justify-end p-1`}>
						<span className="text-[12px] font-medium text-white">{`${progess}%`}</span>
					</div>
				</div>
			</div>
			{
				user.status === 'offline' && <div className="absolute top-0 left-0 h-full w-full z-10 bg-black opacity-50"></div>
			}
		</Container>
	);
}