'use client'

import { useContext } from "react";
import { userDataContext } from "../layout";
import Canvas from "./components/Canvas";

/*
	send via socket emit :  
		players: Y Width Height Id 
		ball:   X & Y Size
		Score
*/


export default function Game()
{
	const userData = useContext(userDataContext);

	// function getMousePos(evt: { clientY: number; }){
		
	// 	let rect = canvas.getBoundingClientRect();
	// 	if (evt.clientY < rect.bottom - user.height)
	// 		user.y = evt.clientY - rect.top + 2; 
	// 	else
	// 		return ;
	// }

	//tlat khmis jm3a
	// this hook used to start the game and connect to the socket

	return (
		<section className="flex w-full h-full items-center bg-darken-200">
			<div className="flex flex-col items-center w-full gap-5">
				<div className="w-full flex justify-center gap-96">
					<div className="flex items-center gap-x-5">
						<img className="w-16 h-16" src="../images/man.png" alt="man_hhhh" />
						<h2 className=" text-whiteSmoke">Ayoub</h2>
					</div>
					<div className="flex items-center gap-x-5">
						<h2 className="text-whiteSmoke">Ayoub</h2>
						<img className="w-16 h-16" src="../images/man.png" alt="man_hhhh" />
					</div>
				</div>
				<Canvas />
			</div>
			{/* <Navbar/ > */}
			{/* <Script src="../../game-script.js" defer></Script> */}
		</section>
	);
}
