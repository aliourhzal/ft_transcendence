"use client";

import { io } from "socket.io-client";
import { useEffect, useState, createContext, useContext, useRef } from 'react';
import Conversation from './components/conversation';
import RoomForm from './components/createRoom';
import { getCookie } from "../layout";
import { userDataContext } from "../../contexts/UniversalData"
import ConvList from "./components/ConvList";
import JoinRoomForm from "./components/joinRoom";
import ButtomButtons from "./components/ButtomButtons";
import SearchDm from "./components/SearchDm";
import Notification from "./components/Notification";
import { useRouter, useSearchParams } from 'next/navigation'
import { useCookies } from "react-cookie";
import "./style.css"
import UserInfo from "./components/UserInfo";
import MyAlert from "./components/MyAlert";

export interface conversation {
	readonly name: string,
	readonly photo: string,
	readonly cover?: string
	readonly lastmsg: {userId: string, msg:string}, 
	readonly id: number,
	readonly pending?: boolean
}

export const Context = createContext<any>(undefined)

export const gimmeRandom = () => {
	const date = new Date();
	return Math.random()
};

export interface Room {
	msgs: {userId:string, msg:string}[],
	id: string,
	name: string,
	type: string,
	lastmsg: {userId: string, msg: string},
	photo?: string,
	users: {
		id: string,
		nickName: string,
		firstName: string,
		lastName: string,
		photo?: string,
		cover?: string,
		type: "OWNER"| "ADMIN" | "USER",
		isMuted: string
	}[],
	pending: boolean
}

export const getUsersInfo = (users) => {
	let _users: {
		  id: string,
		  nickName: string,
		  firstName: string,
		  lastName: string,
		  photo?: string,
		  cover?: string,
		  type: "OWNER"| "ADMIN" | "USER",
		  isMuted: string
	  }[] = []
	users.map( (user) => {
		_users.push(
			{
			id: user.user.id,
			nickName: user.user.nickname,
			firstName: user.user.firstName,
			lastName: user.user.lastName,
			photo: user.user.profilePic,
			cover: user.user.coverPic,
			type: user.userType,
			isMuted: user.isMuted,
			}
		)
	  } 
	)
	return (_users)
}

export const setDmUsers = (users) => {
	let _users: {
		  id: string,
		  nickName: string,
		  firstName: string,
		  lastName: string,
		  photo?: string,
		  cover?: string,
		  type: "OWNER"| "ADMIN" | "USER",
		  isMuted: string
	  }[] = []
	users.map( (user) => {
		_users.push(
			{
			id: user.id,
			nickName: user.nickname,
			firstName: user.firstName,
			lastName: user.lastName,
			photo: user.profilePic,
			cover: user.coverPic,
			type: 'USER',
			isMuted: 'UNMUTED',
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

export interface _Notification {
	text: string
	type: string
}

export default function Chat() {
	// alert('')
	const [cookies, setCookie, removeCookie] = useCookies();
	
	const searchParams = useSearchParams();
	
	const [refresh, setRefresh] = useState(false)
	
	const [blockedUsers, setBlockedUsers] = useState([])

	useEffect( () => {
		console.log('test')
		const dmId = searchParams.get('id');
		if (dmId)
			socket.emit('start-dm', {reciverUserId: dmId})
		socket.emit('get-rooms', null)
		socket.on('all-blocked-users', (res) => {setBlockedUsers(res.allUsersBlockedByMe)})
		socket.on('blocked-user', (res) => {console.log(res); setBlockedUsers(old => [...old, res.blockedUser])})
	}, [])
	// const [new] = useState()

	// useEffect ( () => {
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
	// }, [cookies.access_token])

	const ref = useRef(null);
	const msgInputRef = useRef(null);

	const userData = useContext(userDataContext);

	const [room_created, set_room_created] = useState(false)

	const [rooms, setRooms] = useState<Room[]>([])

	const [chatBoxMessages, setChatBoxMessages] = useState<{userId:string, msg:string, roomId?: string, id?:string}[]>([])

	const [showForm, setShowForm] = useState(false)
	const [showJoinForm, setShowJoinForm] = useState(false)
	
	const [showConv, setShowConv] = useState(false)

	const [showUserInfos, setShowUserInfos] = useState(false)
	const [userInfoNick, setUserInfoNick] = useState('')
	const [userInfoId, setUserInfoId] = useState('')

	const [activeUserConv, setActiveUserConv] = useState<conversation | undefined>({
		name: '.',
		photo: '',
		cover: '',
		lastmsg: {userId: '', msg: ''}, 
		id: 0,
	})

	const [showSearchUsersForm, setShowSearchUsersForm] = useState(false)

	const [alertNewMessage, setAlertNewMessage] = useState(false)

	const [convs, setConvs] = useState<conversation[]>([])

	const [notify, setNotify] = useState(false)

	const [notifications, setNotifications] = useState<_Notification[]>([])
	const [newNotif, setNewNotif] = useState(false)
	const _notification = (_notif_text: string, _notif_type: string) => {
		// set_notif_text(_notif_text)
		setNotifications(_param => {
			_param.unshift({text: _notif_text, type: _notif_type})
			return _param
		})
		setNewNotif(true)
		// setNotify(true)
		// setInterval(() => {
		// 	setNotify(false)
		// 	return clearInterval
		// }, 5000)
	}

	const scrollToBottom = () => {
        const lastChildElement = ref.current?.lastElementChild;
        lastChildElement?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

	const [showAlert, setShowAlert] = useState(false)
	const [alertText, setAlertText] = useState('')

	const [deviceType, setDeviceType] = useState('normal')
    useEffect( () => {
      typeof window != 'undefined' ? (window.innerWidth <= 970 ? setDeviceType('small') : setDeviceType('normal')) : setDeviceType('normal')
      typeof window != 'undefined' ? window.onresize = () => {
        if (window.innerWidth <= 970)
          setDeviceType('small')
        else
          setDeviceType('normal')
      } : setDeviceType('normal')

    } , [])

	useEffect( () => {
		document.addEventListener('keydown', (e) => {
			if (e.key === "Escape") {
				setShowConv(false)
				setActiveUserConv({
					name: '.',
					photo: '',
					cover: '',
					lastmsg: {userId: '', msg: ''}, 
					id: 0,
				})
				setChatBoxMessages([])
			}
		});
	}, [])

	const internalError = (text:string) => {
		setAlertText(text)
		setShowAlert(true)
	}


	return (
		<main className='scrollbar-none select-none h-full w-full relative'>
			{showAlert && <MyAlert showAlert={showAlert} setShowAlert={setShowAlert} text={alertText}/>}
			{!(showConv && deviceType != 'normal') && <Notification newNotif={newNotif} setNewNotif={setNewNotif} notifications={notifications} notify={notify} setNotify={setNotify}/>}
			<Context.Provider value={{internalError, setAlertNewMessage, ref, showConv, setShowConv, socket,
				showForm, setShowForm, setChatBoxMessages, chatBoxMessages, userData, showJoinForm, setShowJoinForm,
				set_room_created, room_created, rooms, setRooms, showSearchUsersForm, setShowSearchUsersForm, scrollToBottom, _notification,
				convs, setConvs, setShowUserInfos, setUserInfoNick, msgInputRef, setRefresh, setUserInfoId}}>
				<div id='main' className="flex items-center gap-[3vh] flex-grow h-full overflow-y-auto bg-darken-200">
					<div className={"flex flex-col items-center justify-center text-sm lg:text-base h-[90vh] text-center " +
					(deviceType === 'normal' ? 'w-[calc(90%/2)]' : 'w-[100%]')}>
						<ConvList activeUserConv={activeUserConv} setActiveUserConv={setActiveUserConv} />
						<ButtomButtons />
					</div>
					<Conversation setAlertText={setAlertText} setShowAlert={setShowAlert} activeUserConv={activeUserConv} deviceType={deviceType} setShowConv={setShowConv} showConv={showConv} setActiveUserConv={setActiveUserConv} />
				</div>
				<RoomForm setShowAlert={setShowAlert} setAlertText={setAlertText} setConvs={setConvs} set_room_created={set_room_created} showForm={showForm} setShowForm={setShowForm} />
				<JoinRoomForm />
				<SearchDm blockedUsers={blockedUsers} setShowSearchUsersForm={setShowSearchUsersForm} showSearchUsersForm={showSearchUsersForm} setActiveUserConv={ setActiveUserConv } />
				<UserInfo showUserInfos={showUserInfos} setShowUserInfos={setShowUserInfos} nickname={userInfoNick} id={userInfoId} setActiveUserConv={setActiveUserConv} setChatBoxMessages={setChatBoxMessages} setShowConv={setShowConv}/>
			</Context.Provider>
		</main>
	)
}
