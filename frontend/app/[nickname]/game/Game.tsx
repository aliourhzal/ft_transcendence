'use client'

import { useContext, useEffect, useState } from "react";
import { userDataContext } from "../layout";
import Canvas from "./components/Canvas";
import { WebsocketContext } from "@/app/context_sockets/gameWebSocket";
import loadingPong from "./utils/loadingPong.json";
import Lottie from "react-lottie";
import { data } from "autoprefixer";

const startbuttonGame = {
    loop: true,
    autoplay: true,
    animationData: loadingPong,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
};

export default function Game(props: any)
{		
	const socket = useContext(WebsocketContext);
	const userData = useContext(userDataContext);
	// const [loading, setLoading] = useState(true); 
	const [opData, setOpData] = useState<{loading:boolean, nickname: string, avatar: string}>({
		loading: true,
		nickname: '',
		avatar: ''
	});

	useEffect(() => {
		socket.on("playersInfo", (data: {nickname:string, avatar:string}) => {
			setOpData({loading: true, ...data});
		});
	}
	,[]);

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
				<div className="w-[80%] aspec flex justify-between max-sm:">
					<div className="flex items-center gap-x-5">
						<img className="w-16 h-16 rounded-full" src={userData.profilePic} alt="man_hhhh" />
						<h2 className=" text-whiteSmoke">{userData.nickname}</h2>
					</div>
					<div className="flex items-center gap-x-5">
						<img className="w-16 h-16 rounded-full" src={opData.avatar} alt="man_hhhh" />
						<h2 className=" text-whiteSmoke">{opData.nickname}</h2>
					</div>
				</div>
				<Canvas colors={props.colors} socket={socket} specials={props.specials} themeN={props.themeN} ball={props.ball}  hell={props.hell} opData={setOpData}/>
			</div>

			{/* <Navbar/ > */}
			{/* <Script src="../../game-script.js" defer></Script> */}
		</section>
	);
}
