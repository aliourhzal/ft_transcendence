"use client";

import { Socket,io } from "socket.io-client";
import Image from 'next/image'
import { useEffect, useState, createContext, useContext, useRef } from 'react';
import Conversation from './components/conversation';
import RoomForm from './components/createRoom';
import Search from './components/search';
import { getCookie, userDataContext } from "../layout";
import ConvList from "./components/ConvList";
import JoinRoomForm from "./components/joinRoom";
import { SocketAddress } from "net";
import ButtomButtons from "./components/ButtomButtons";
import SearchDm from "./components/SearchDm";
import Notification from "./components/Notification";
import { useRouter } from 'next/navigation'
import { useCookies } from "react-cookie";
import "./style.css"

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

export const getUsersInfo = (users) => {
	let _users: {
		  id: string,
		  nickName: string,
		  firstName: string,
		  lastName: string,
		  photo?: string,
		  type: "OWNER"| "ADMIN" | "USER",
		  isBanned: boolean
	  }[] = []
	// console.log(users)
	users.map( (user) => {
		_users.push(
		  {
			id: user.user.id,
			nickName: user.user.nickname,
			firstName: user.user.firstName,
			lastName: user.user.lastName,
			photo: user.user.profilePic,
			type: user.userType,
			isBanned: user.isBanned,
		  }
		)
	  } 
	)
	  return (_users)
  }

const _cookie = getCookie('access_token')

const socket = io('ws://127.0.0.1:3004',{
	extraHeaders: {
        Authorization: `Bearer ${getCookie('access_token')}`,
    },
})

export default function Chat() {
	
	const [cookies, setCookie, removeCookie] = useCookies();
	// const [new] = useState()

	useEffect ( () => {
		// setInterval(() => {
		// 	console.log("---->", cookies.access_token)
		// }, 5000);
		// console.log('useeeffect')
		// if (cookies.access_token != _cookie){
		// 	console.log('cookie changed !')
		// 	// document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
		// 	removeCookie('access_token')
		// 	const router = useRouter()
		// 	router.push('/')
		// }
	}, [cookies.access_token])

	const ref = useRef(null);

	const userData = useContext(userDataContext);

	const [msg_sent, set_msg_sent] = useState<1 | 2 | undefined>(undefined)
	const [room_created, set_room_created] = useState(false)

	const [rooms, setRooms] = useState<Room[]>([])

	const [chatBoxMessages, setChatBoxMessages] = useState<{user:string, msg:string, roomName?: string, id?:string}[]>([])

	const [showForm, setShowForm] = useState(false)
	const [showJoinForm, setShowJoinForm] = useState(false)
	
	const [showConv, setShowConv] = useState(false)

	const [activeUserConv, setActiveUserConv] = useState<conversation | undefined>(undefined)

	const [showSearchUsersForm, setShowSearchUsersForm] = useState(false)

	const [alertNewMessage, setAlertNewMessage] = useState(false)

	const [convs, setConvs] = useState<conversation[]>([])

	const [notify, setNotify] = useState(false)
	const [notif_text, set_notif_text] = useState('')
	const [notif_type, set_notif_type] = useState('')
	const _notification = (_notif_text: string, _notif_type: string) => {
		set_notif_text(_notif_text)
		set_notif_type(_notif_type)
		setNotify(true)
		setInterval(() => {
			setNotify(false)
			return clearInterval
		}, 5000)
	}

	const scrollToBottom = () => {
        const lastChildElement = ref.current?.lastElementChild;
        lastChildElement?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

	return (
		<main className='select-none h-full w-full'>
			<button id="notification_button" onClick={() => { setNotify(old => !old) }}>
				<svg viewBox="0 0 448 512" id="bell"><path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path></svg>
			</button>
			<Context.Provider value={{alertNewMessage, setAlertNewMessage, ref, showConv, setShowConv, activeUserConv, setActiveUserConv, socket,
				showForm, setShowForm, setChatBoxMessages, chatBoxMessages, userData, showJoinForm, setShowJoinForm, msg_sent, set_msg_sent,
				set_room_created, room_created, rooms, setRooms, showSearchUsersForm, setShowSearchUsersForm, scrollToBottom, _notification, convs,setConvs}}>
				{notify && <Notification text={notif_text} type={notif_type}/>}
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
