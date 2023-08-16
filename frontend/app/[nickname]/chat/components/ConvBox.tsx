import React, { useContext, useEffect, useState } from 'react'
// import Image from 'next/image'
import { conversation } from '../page'
// import { Avatar } from '@nextui-org/react'
import {Avatar} from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { Context } from '../page'
import axios from 'axios'
import { getCookie } from '../../layout'

interface ConvBoxProps {
    data : conversation
}

const ConvBox: React.FC<ConvBoxProps> = (data) => {

  const {setShowConv, setActiveUserConv, setChatBoxMessages} = useContext(Context)
  console.log('CONVBOX YEE')
  const handleClick = async () => {
    setShowConv(true)
    setActiveUserConv(data.data)
    try {
      await axios.post('http://127.0.0.1:3000/rooms/select-room', {roomName:data.data.name}, {
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
    var divs = document.getElementsByClassName('convGroup z-0 bg-zinc-800 w-[70%] left-[15%] h-[100px] relative my-3 rounded-md active:bg-blue-500') as HTMLCollectionOf<HTMLElement>
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
    <div className="convGroup z-0 bg-zinc-800 w-[70%] left-[15%] h-[100px] relative my-3 rounded-md active:bg-blue-500" onClick={(e) => {
        handleClick();
        // activeDiv(e.currentTarget);
        // scrollToBottom()
      }}>
        <div className="left-[30%] top-[25%] absolute text-gray-200 font-medium">{data.data.name}</div>
        <Avatar pointer zoomed text={data.data.name} bordered color={"gradient"} alt={data.data.name} className="w-auto h-auto left-[6%] top-[30%] absolute"
            src={data.data.photo} />
        <div className="left-[30%] top-[50%] absolute text-gray-200 text-opacity-70 font-normal">{
            data.data.lastmsg ? data.data.lastmsg.length > 15 ? data.data.lastmsg.substring(0, 15)+'...' : data.data.lastmsg : ''}</div>
        {/* <div className="left-[85%] top-[70%] lg:top-[50%] absolute text-gray-200 text-opacity-70 font-normal">10:30</div> */}
    </div>
  )
}

export default ConvBox