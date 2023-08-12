'use client'

import { useContext, useEffect, useState } from "react";
import { userDataContext } from "../layout";
import Canvas from "./components/Canvas";
import { WebsocketContext } from "@/app/context_sockets/gameWebSocket";

/*
	send via socket emit :  
		players: Y Width Height Id 
		ball:   X & Y Size
		Score
*/


export default function Game(props: any)
{		
	const socket = useContext(WebsocketContext);
	const userData = useContext(userDataContext);
	const [nickname, setN] = useState("");
	const [avatar, setA] = useState("");
	const [com, setCom] = useState(false);
	let opData : {nickname: string, profilePic: string} = {
		nickname: "notSetYet",
		profilePic: ""
	}

	useEffect(()=>{

		socket.on("playersInfo", (data: {nickname:string, profilePic:string}) => {
			opData = {...data};
			setCom(true);
		});
	}
	,[]);

	return (
		<section className="flex w-full h-full items-center bg-darken-200">
			{
				com &&
				<div className="flex flex-col justify-center items-center w-full gap-5 h-full">
					<div className="w-[80%] aspec flex justify-between max-sm:">
						<div className="flex items-center gap-x-5">
							<img className="w-16 h-16" src={userData.profilePic} alt="man_hhhh" />
							<h2 className=" text-whiteSmoke">{userData.nickname}</h2>
						</div>
						<div className="flex items-center gap-x-5">
							<h2 className="text-whiteSmoke">{opData.nickname}</h2>
							<img className="w-16 h-16" src={opData.profilePic} alt="man_hhhh" />
						</div>
					</div>
					<Canvas socket={socket} themeN={props.themeN} ball={props.ball}  hell={props.hell} />
				</div>

			}
			{/* <Navbar/ > */}
			{/* <Script src="../../game-script.js" defer></Script> */}
		</section>
	);
}
