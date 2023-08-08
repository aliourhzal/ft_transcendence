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
import { SocketAddress } from "net";
import ButtomButtons from "./components/ButtomButtons";
import SearchDm from "./components/SearchDm";

export interface conversation {
	readonly name: string,
	readonly photo: string,
	readonly lastmsg: string, 
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

const socket = io('ws://127.0.0.1:3004',{
	auth: {
		token: getCookie('access_token'),
	},
})

export default function Chat() {

	const userData = useContext(userDataContext);

	const [msg_sent, set_msg_sent] = useState<1 | 2 | undefined>(undefined)
	const [room_created, set_room_created] = useState(false)

	const [rooms, setRooms] = useState<Room[]>([])

	const [chatBoxMessages, setChatBoxMessages] = useState<{user:string, msg:string}[]>([])

	const [showForm, setShowForm] = useState(false)
	const [showJoinForm, setShowJoinForm] = useState(false)
	
	const [showConv, setShowConv] = useState(false)

	const [activeUserConv, setActiveUserConv] = useState<conversation | undefined>(undefined)

	const [showSearchUsersForm, setShowSearchUsersForm] = useState(false)

	return (
		<main className='select-none h-full w-full'>
			<Context.Provider value={{showConv, setShowConv, activeUserConv, setActiveUserConv, socket,
				showForm, setShowForm, setChatBoxMessages, chatBoxMessages, userData, showJoinForm, setShowJoinForm, msg_sent, set_msg_sent,
				set_room_created, room_created, rooms, setRooms, showSearchUsersForm, setShowSearchUsersForm}}>
				<div id='main' className="flex items-center gap-[3vh] flex-grow h-full overflow-y-auto bg-darken-200">
					<div className="flex flex-col items-center justify-center w-[100%] text-sm lg:text-base md:relative md:w-[calc(90%/2)] h-[90vh] text-center">
						<ConvList />
						<ButtomButtons />
					</div>
					<Conversation />
				</div>
				<RoomForm />
				<JoinRoomForm />
				<SearchDm />
		</Context.Provider>
		</main>
	)
}
