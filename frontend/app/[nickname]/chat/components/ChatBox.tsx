import React, { useContext, useEffect, useState } from 'react'
import user, { Context, gimmeRandom } from '../page'
import { Socket } from 'socket.io-client'
import SelfChatBox from './selfChatBox'
import OthersChatBox from './othersChatBox'

const ChatBox = () => {
  
  const {socket, chatBoxMessages, setChatBoxMessages, userData, msg_sent, rooms, setRooms, activeUserConv} = useContext(Context)
  
  useEffect( () => {
    socket?.on('add-message', (msg) => {
      console.log("********", msg, "********")
      let temp_rooms = [...rooms]
      temp_rooms.find(o => o.name === activeUserConv.name).msgs.push(msg)
      setRooms(temp_rooms)
      // setChatBoxMessages(rooms.find(o => o.name == activeUserConv.name).msgs)
        // console.log(rooms.find(o => o.name === activeUserConv.name).msgs)
        // rooms.find(o => o.name === activeUserConv.name)
        // ((old:any) => [...old, {user:msg.user, msg:msg.message}] )
        // setChatBoxMessages((old:any) => [...old, {user:msg.user, message:msg.msg}] )
	  	})
	}, [msg_sent])

    let temp = document.getElementById('chatbox')
    useEffect ( () => {
      if (temp)
        temp.scrollTop = temp.scrollHeight
    }, [temp, chatBoxMessages])
  
  return (
    <div>
      {chatBoxMessages.map ((BoxMessage) => 
        (BoxMessage.user == userData.nickname ? <SelfChatBox msg={BoxMessage.msg} user={BoxMessage.user} key={gimmeRandom()}/>
          : <OthersChatBox msg={BoxMessage.msg} user={BoxMessage.user} key={gimmeRandom()}/>))}
    </div>
  )
}

export default ChatBox