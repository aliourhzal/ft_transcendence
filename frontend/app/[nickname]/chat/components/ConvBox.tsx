import React, { useContext, useEffect, useRef, useState } from 'react'
// import Image from 'next/image'
import { conversation } from '../page'
import {Avatar} from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { Context } from '../page'
import axios from 'axios'
import { getCookie } from '../../layout'

interface ConvBoxProps {
    data : conversation
}

const ConvBox: React.FC<ConvBoxProps> = (data) => {

  const {rooms, setActiveUserConv, setShowConv, setChatBoxMessages} = useContext(Context)

  const handleClick = async () => {
    setShowConv(true)
    setActiveUserConv(data.data)
    // if (new_msg_notif.name == activeUserConv.name)
    //   notify_conv_msg(false, '')
    try {
      await axios.post('http://127.0.0.1:3000/rooms/select-room', {roomId:rooms.find(o => o.name === data.data.name).id}, {
        withCredentials: true,
        headers: {
            'Authorization': `Bearer ${getCookie('access_token')}`,
                'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
    })
      .then((res) => {
          setChatBoxMessages(res.data.msg)
      })
    } catch(error) {
        // alert(error)
        console.log(error)
    }
    // const response = await fetch('http://127.0.0.1:3000/rooms/join-room', {method:'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({roomName:data.data.name, auth: socket.auth['token'], socket:socket.id})}).then((response) => response.json())
  }

  const activeDiv = (div:HTMLDivElement) => {
    var divs = document.getElementsByClassName('convGroup') as HTMLCollectionOf<HTMLElement>
    if (divs) {
      for (var i = 0; i < divs.length; i++) {
        if (divs[i] == div)
          divs[i].style.backgroundColor = "rgb(59 130 246)"
        else
          divs[i].style.backgroundColor = "rgb(39 39 42)"
      }
    }
  }

  return (
    <div tabIndex={0} className="cursor-pointer convGroup z-0 bg-zinc-800 focus:bg-blueStrong hover:bg-zinc-700 w-[70%] left-[15%] h-[100px] relative my-3 rounded-md active:bg-blue-500 flex items-center justify-start" onClick={(e) => {
        handleClick();
        activeDiv(e.currentTarget);
        // scrollToBottom()
      }}>
        {/* {data && <div className='absolute z-0 h-[100px] w-full flex flex-col items-end justify-center bg-transparent'>
          <span className='mx-5 animate-ping inline-flex w-2 h-2 rounded-full bg-blueStrong z-10 opacity-90'></span>
        </div>} */}
        <div className="left-[30%] top-[25%] absolute text-gray-200 font-medium">{data.data.name}</div>
        <img alt={data.data.name} width={45} height={45} className="rounded-full border-2 border-slate-300 w-30 h-30 ml-4" src={data.data.photo} />
        <div className="left-[30%] top-[50%] absolute text-gray-200 text-opacity-70 font-normal">{
            data.data.lastmsg ? data.data.lastmsg.length > 15 ? data.data.lastmsg.substring(0, 15)+'...' : data.data.lastmsg : ''}</div>
        {/* <div className="left-[85%] top-[70%] lg:top-[50%] absolute text-gray-200 text-opacity-70 font-normal">10:30</div> */}
    </div>
  )
}

export default ConvBox