"use client";
import { io } from "socket.io-client";

import Image from 'next/image'
import { useEffect, useState, createContext, useContext } from 'react';
import { Component } from 'react';
import Conversation from './components/conversation';
import RoomForm from './components/roomform';
import Search from './components/search';
import UserList from './components/UserList';
import { Socket } from "dgram";
import { userDataContext } from "../layout";

export interface user {
	readonly name: string,
	readonly photo: string,
	readonly last_msg: string, 
	readonly id: number,
}

export interface conversation {
    name: string
}

export const Context = createContext<any>(undefined)

export default function Chat() {
	
    const [rooms, setRooms] = useState<string[]>([])
    const [users, setUsers] = useState<user[]>([])

	const userData = useContext(userDataContext);

    userData.chatSocket.on('list-rooms',(listOfRoomsOfUser: string[]) => {
        for (var i = 0; i < listOfRoomsOfUser.length; i++) {
            var temp = users
            temp.push({name:listOfRoomsOfUser[i], photo:'', last_msg:'lol', id:0})
            setUsers([...temp])
            // console.log(users)
        }
    })

	const [chatBoxMessages, setChatBoxMessages] = useState<any>([
		{user:'lmao', msg:'yo'},
		{user:'self', msg:'hello'}
	])


	const [showForm, setShowForm] = useState(false)
	
	const [showConv, setShowConv] = useState(false)

	const [activeUserConv, setActiveUserConv] = useState<user | undefined>(undefined)
	return (
		<main className='select-none h-full w-full overflow-y-auto'>
			<Context.Provider value={{showConv, setShowConv, activeUserConv, setActiveUserConv, users, setUsers, chatBoxMessages, setChatBoxMessages, rooms}}>
				<RoomForm convUsers={users} setConvUsers={setUsers} showForm={showForm} setShowForm={setShowForm}/>
				<div id='main' className="flex items-center gap-[3vh] flex-grow h-full overflow-y-auto bg-darken-200 ">
			<div className="flex flex-col items-center justify-center w-[100%] text-sm lg:text-base md:relative md:w-[calc(90%/2)] h-[90vh] text-center">
				<div className=' flex items-center justify-center w-[100%]'>
					<Image  alt='search' src='/images/loupe.svg' width={20} height={20}/>
					<Search users={users} />
				</div>

				<UserList items={users} />
				{/* {handle_convs("mustapha", "/assets/images/profile.png", "yoooo whassup nigga lmaolmfoahiehwo", 0)} */}
				{/* <Conversation user={ users[0] } setState={setState} setShowConv={setShowConv}/> */}
				{/* {handle_convs("ali", "/assets/images/profile.png", "yoooo whassup nigga", 1)}
				{handle_convs("ayoub", "/assets/images/profile.png", "yoooo whassup nigga", 2)}
				{handle_convs("taha", "/assets/images/profile.png", "yoooo whassup nigga", 3)}
				{handle_convs("lmfao", "/assets/images/profile.png", "yoooo whassup nigga", 4)}  */}

				<div className='flex justify-between items-center w-[50%] h-[8%]'>
					<div className='border-blue-500 border-[6px] bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center'>
						<Image className='cursor-pointer w-auto h-auto' alt='new channel' title='CreateChannel' src='/images/channel.svg' onClick={ () => {
						setShowForm(true);
						var temp = document.getElementById('main')
						temp ? temp.style.filter = 'blur(1.5rem)' : ''
						}} width={30} height={30}/>
					</div>
					<div className='border-blue-500 border-[6px] bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center'>
						<Image title='JoinChannel' className='w-auto h-auto' alt='new channel' src='/images/channel.svg' width={30} height={30}/>
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



