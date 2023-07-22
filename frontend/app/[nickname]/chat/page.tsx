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

export interface user {
  readonly name: string,
  readonly photo: string,
  readonly last_msg: string, 
  readonly id: number,
}

export const Context = createContext<any>(undefined)

export default function Chat() {
  
    const getAccessToken = () => {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [label, content] = cookie.split('=');
            if (label === 'access_token')
                return (content);
        }
    }

  const [users, setUsers] = useState<user[]>([
    {name:"test", photo:"", last_msg:"yooo", id:0},
    {name:"lmfao", photo:"", last_msg:"yooo", id:1},
    {name:"lol", photo:"", last_msg:"yooo", id:2},
    {name:"xd", photo:"", last_msg:"yooo", id:3},
  ])

  const [socket, setSocket] = useState<any>();
  
  useEffect( () => {
    setSocket(io('ws://localhost:3000',{
      auth: {
        token: getAccessToken(),
      },
    }) );
  }, [])

  const [showForm, setShowForm] = useState(false)
  
  const [showConv, setShowConv] = useState(false)

  const [activeUserConv, setActiveUserConv] = useState<user | undefined>(undefined)
  
  return (
    <main className='select-none h-full w-full overflow-y-auto'>
      <Context.Provider value={{showConv, setShowConv, activeUserConv, setActiveUserConv, users, setUsers, socket}}>
        <RoomForm convUsers={users} setConvUsers={setUsers} showForm={showForm} setShowForm={setShowForm}/>
        <div id='main' className="flex items-center gap-[3vh] flex-grow h-full overflow-y-auto bg-darken-200 ">
			<div className="flex flex-col items-center justify-center w-[100%] text-sm bg-red-500 lg:text-base md:relative md:w-[calc(90%/2)] h-[90vh] text-center">
				<div className=' flex items-center justify-center w-[100%] bg-green-500'>
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

				<div className='flex justify-between items-center w-[50%] bg-green-500 h-[8%]'>
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



