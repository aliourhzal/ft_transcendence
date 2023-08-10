'use client'

import React, { useContext, useEffect, useRef, useState } from "react";
import { UniversalData } from "../layout";
import { InvitationSocketContext } from "@/app/context_sockets/InvitationWebSocket";
import axios from "axios";

export function FriendBarColumns(props: any)
{
	return (
		<div /*style={ {animation: "scroll 40s linear infinite",}} className="animate flex flex-row gap-1 h-full items-center cursor-pointer  rounded-md"*/
			className="w-full flex flex-col items-center"
			onClick={()=>{alert("clicked");}}>
				<div className="relative w-[60px] aspect-square ">
					<img className="w-[full] h-full rounded-full" src={props.src} alt="f_img" />
					{
						props.status === 'online' &&
						<>
							<span className="animate-ping h-[15px] w-[15px] rounded-full bg-green-500 absolute bottom-0 right-0"></span>
							<span className="h-[15px] w-[15px] rounded-full bg-green-500 absolute bottom-0 right-0"></span>
						</>

					}
				</div>
				<h3 className="w-lg text-white font-medium mt-1">{props.nickname}</h3>
		</div>
	);
}

export default function FriendCarouselBar()
{
	const [friends, setFriends] = useState<UniversalData[]>([]);
	const socket = useContext(InvitationSocketContext);
	const imgContainer = useRef<HTMLDivElement>();
	const imgCircle = useRef<HTMLDivElement>();
	const imgL = useRef<HTMLImageElement>();
	const imgR = useRef<HTMLImageElement>();
	let scrollPos = 0;
	let scrollAmount = 100;
	
	
	function scrollHorizontal(val: number) {
		let maxScroll = -imgContainer.current.offsetWidth + imgCircle.current.offsetWidth;
		scrollPos += (val * scrollAmount);
		if (scrollPos <= 0)
		{
			scrollPos = 0;
			imgL.current.style.opacity = "0";
		}
		else
			imgL.current.style.opacity = "1";
		if (scrollPos >= maxScroll)
		{
			scrollPos = maxScroll
			imgR.current.style.opacity = "0";
		}
		else
		{
			imgR.current.style.opacity = "1";
			// imgR.current.style.display = "true";
		}
		imgContainer.current.style.left = scrollPos + "px";
	}

	useEffect(() => {
		axios.get('http://127.0.0.1:3000/users/friends', {
			withCredentials: true
		})
		.then(res => {
			setFriends(res.data);
		})
		socket.on('receive-friends', data => {
			setFriends(data);
		});
		socket.on('update-status', data => {
			setFriends(friends => {
				return friends.map(friend => {
					if (friend.nickname === data.user)
						friend.status = data.status		
					return friend;
				})
			})
		})
	}, [])

	return (
		<div className="w-[90%] rounded-xl flex bg-darken-100 h-20vh">
			<div ref={imgCircle} className="overflow-hidden horizontal-scroll h-[110px] flex justify-between items-center relative w-full ">
				{
					friends.length > 7 && <img ref={imgL} className=" p-2 m-2 rounded-full btn-scroll max-sm:hidden w-[35px] aspect-square" src="../images/L_arrow.png"  alt="" onClick={()=>scrollHorizontal(-1)}/>
				}
				<div ref={imgContainer} className="storys-container flex items-center justify-center px-4 gap-6">
						{
							friends.length > 0 ? friends.map((friend) => {
								return (
									<FriendBarColumns key={friend.nickname} src={friend.profilePic} nickname={friend.nickname} status={friend.status}/>
								);
							}) : <span className="text-white text-lg absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">You Have no Friends</span>
						}
				</div>
				{
					friends.length > 7 && <img ref={imgR} className=" p-2 m-2 rounded-full btn-scroll max-sm:hidden w-[35px] aspect-square" src="../images/R_arrow.png"  alt="" onClick={()=>scrollHorizontal(1)}/>
				}

			</div>
		</div>
	);
}