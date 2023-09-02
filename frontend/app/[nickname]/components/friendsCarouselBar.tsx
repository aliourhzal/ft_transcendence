'use client'

import React, { useContext, useEffect, useRef, useState } from "react";
import { UniversalData } from "../../contexts/UniversalData";
import { InvitationSocketContext } from "@/app/contexts/InvitationWebSocket";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function FriendBarColumns(props: any)
{
	return (
		<Link href={`http://127.0.0.1:3001/${props.nickname}`}>
			<div /*style={ {animation: "scroll 40s linear infinite",}} className="animate flex flex-row gap-1 h-full items-center cursor-pointer  rounded-md"*/
				className="w-full flex flex-col items-center cursor-pointer"
				>
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
		</Link>
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
	const router = useRouter();
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
			setFriends(oldFriends => [...oldFriends, data]);
		});
		socket.on('update-status', data => {
			setFriends(friends => {
				return friends.map(friend => {
					if (friend.id === data.user)
						friend.status = data.status		
					return friend;
				})
			})
		});
		socket.on('friend-deleted', data => {
			console.log(data);
			const friendIndex = friends.findIndex((friend => friend.nickname === data.friend));
			console.log(friendIndex);
			setFriends(friends => {
				const old = [...friends];
				old.splice(friendIndex, 1);
				return old;
			});
		});
		socket.on('logout', () => {
			router.push('/');
		})
	}, [])

	return (
		<div className="w-[90%] rounded-xl flex bg-darken-100 h-20vh relative">
			{
				friends.length === 0 && <span className="text-white text-lg absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">You Have no Friends</span>
			}
			<div ref={imgCircle} className="overflow-hidden horizontal-scroll h-[110px] flex justify-between items-center w-full ">
				{
					friends.length > 7 && <img ref={imgL} className=" p-2 m-2 rounded-full btn-scroll max-sm:hidden w-[35px] aspect-square" src="../images/L_arrow.png"  alt="" onClick={()=>scrollHorizontal(-1)}/>
				}
				<div ref={imgContainer} className=" storys-container flex items-center justify-center px-4 gap-6">
						{
							friends.map((friend) => {
								return (
									<FriendBarColumns router={router} key={friend.nickname} src={friend.profilePic} nickname={friend.nickname} status={friend.status}/>
								);
							}) 
						}
				</div>
				{
					friends.length > 7 && <img ref={imgR} className=" p-2 m-2 rounded-full btn-scroll max-sm:hidden w-[35px] aspect-square" src="../images/R_arrow.png"  alt="" onClick={()=>scrollHorizontal(1)}/>
				}

			</div>
		</div>
	);
}