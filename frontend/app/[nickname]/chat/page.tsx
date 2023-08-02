"use client";

import { Socket,io } from "socket.io-client";
import Image from 'next/image'
import { useEffect, useState, createContext, useContext } from 'react';
import Conversation from './components/conversation';
import RoomForm from './components/createRoom';
import Search from './components/search';
import { getCookie, userDataContext } from "../layout";
import ConvList from "./components/ConvList";
import JoinRoomForm from "./components/joinRoom";

export interface conversation {
	readonly name: string,
	readonly photo: string,
	readonly last_msg: string, 
	readonly id: number,
}

export const Context = createContext<any>(undefined)

export const gimmeRandom = () => {
	const date = new Date();
	return Math.random()
};

export interface Room {
	msgs: {user:string, msg:string}[],
	id: string,
	name: string,
	type: string,
	lastmsg: string,
	users: {
		id: string,
		nickName: string,
		firstName: string,
		lastName: string,
		photo?: string,
		type: "OWNER"| "ADMIN" | "USER",
		isBanned: boolean
	}[]
}

export default function Chat() {

	const userData = useContext(userDataContext);

	const [socket, setSocket] = useState<Socket>();
    
	const [convs, setConvs] = useState<conversation[]>([])

	const [msg_sent, set_msg_sent] = useState(false)
	const [room_created, set_room_created] = useState(false)

	const [rooms, setRooms] = useState<Room[]>([])

	useEffect(() => {
		setSocket(io('ws://127.0.0.1:3004',{
			auth: {
				token: getCookie('access_token'),
			},
		}))
		set_room_created(old => !old)
		// axios.get("http://127.0.0.1:3000/rooms").then(res => console.log(res))
	}, [])

	const [chatBoxMessages, setChatBoxMessages] = useState<{user:string, msg:string}[]>([])

	const [showForm, setShowForm] = useState(false)
	const [showJoinForm, setShowJoinForm] = useState(false)
	
	const [showConv, setShowConv] = useState(false)

	const [activeUserConv, setActiveUserConv] = useState<conversation | undefined>(undefined)
	return (
		<main className='select-none h-full w-full overflow-y-auto'>
			<Context.Provider value={{showConv, setShowConv, activeUserConv, setActiveUserConv, convs, setConvs, socket,
				showForm, setShowForm, setChatBoxMessages, chatBoxMessages, userData, showJoinForm, setShowJoinForm, set_msg_sent,
				set_room_created, room_created, rooms, setRooms}}>
				<RoomForm />
				<JoinRoomForm />
				<div id='main' className="flex items-center gap-[3vh] flex-grow h-full overflow-y-auto bg-darken-200 ">
					<div className="flex flex-col items-center justify-center w-[100%] text-sm lg:text-base md:relative md:w-[calc(90%/2)] h-[90vh] text-center">
						<div className=' flex items-center justify-center w-[100%]'>
							<Image  alt='search' src='/images/loupe.svg' width={20} height={20}/>
							<Search users={convs} />
						</div>

						<ConvList />

						<div className='flex justify-between items-center w-[50%] h-[8%]'>
							<div className='cursor-pointer border-blue-500 border-[6px] bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center' onClick={ () => {
									setShowForm(true);
								}}>
								<Image className='w-auto h-auto' alt='CreateChannel' title='CreateChannel' src='/images/channel.svg'  width={30} height={30}/>
							</div>
							<div className='cursor-pointer border-blue-500 border-[6px] bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center' onClick={ () => {
									setShowJoinForm(true)
								}}>
								<Image title='JoinChannel' className='w-auto h-auto' alt='JoinChannel' src='/images/channel.svg' width={30} height={30}/>
							</div>
							<div className='border-blue-500 border-[6px] bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center'>
								<Image className='w-auto h-auto' alt='new channel' src='/images/groupe.svg' width={25} height={25}/>
							</div>
						</div>
					</div>
					<Conversation />
				</div>
		</Context.Provider>
		</main>
	)
}



