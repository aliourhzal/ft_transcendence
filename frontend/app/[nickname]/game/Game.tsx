'use client'

import { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../../contexts/UniversalData";
import Canvas from "./components/Canvas";
import { WebsocketContext } from "@/app/contexts/gameWebSocket";
import loadingPong from "./utils/loadingPong.json";
import Lottie from "react-lottie";
import { data } from "autoprefixer";
import { Socket, io } from "socket.io-client";
import { getCookie } from "../layout";
import { useSearchParams } from "next/navigation";

const startbuttonGame = {
    loop: true,
    autoplay: true,
    animationData: loadingPong,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
};

function returnSocket(against: string) {
	return io(`http://${process.env.NEXT_PUBLIC_BACK}:3003`, {
    auth: {
        token: getCookie('access_token')
    },
	query: {
		against
	}
});
}

export default function Game(props: any)
{
	const socket = useContext(WebsocketContext);
	const searchParams = useSearchParams();
	const userData = useContext(userDataContext);
	const [opData, setOpData] = useState<{loading:boolean, nickname: string, avatar: string}>({
		loading: true,
		nickname: '',
		avatar: ''
	});
	console.log('hello: ', searchParams.get('id'));

	useEffect(() => {
		socket.emit('GameMode', {against: searchParams.get('id')});
		socket.on("playersInfo", (data: {nickname:string, avatar:string}) => {
			setOpData({loading: true, ...data});
		});
		return (() => {
			socket.disconnect();
		})
	},[]);

	return (
		
		<section className="flex w-full h-full items-center bg-darken-200 relative">
			{
				opData.loading && <Lottie 
					options={startbuttonGame}
					width={400}
					height={400}
				/>
			}
			<div style={{visibility: `${opData.loading ? 'hidden' : 'visible'}`, zIndex:'10', position: 'absolute'}} className="flex relative flex-col justify-center items-center w-full gap-5 h-full">
				<div className="w-[80%] aspec flex justify-between max-sm:absolute max-sm:top-36">
					<div className="flex items-center gap-x-5">
						<img className="w-16 h-16 rounded-full" src={userData.profilePic} alt="man_hhhh" />
						<h2 className=" text-whiteSmoke">{userData.nickname}</h2>
					</div>
					<div className="flex items-center gap-x-5">
						<h2 className=" text-whiteSmoke">{opData.nickname}</h2>
						<img className="w-16 h-16 rounded-full" src={opData.avatar} alt="man_hhhh" />
					</div>
				</div>
				{
					socket && <Canvas colors={props.colors} socket={socket} specials={props.specials} themeN={props.themeN} ball={props.ball}  hell={props.hell} opData={setOpData}/>
				}
			</div>
		</section>
	);
}
