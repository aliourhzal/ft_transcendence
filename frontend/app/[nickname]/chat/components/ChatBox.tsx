import React, { useContext, useEffect, useState } from 'react'
import user, { Context, gimmeRandom } from '../page'
import { Socket } from 'socket.io-client'
import SelfChatBox from './selfChatBox'
import OthersChatBox from './othersChatBox'

const ChatBox = () => {
  
  const {socket, chatBoxMessages, setChatBoxMessages, userData, msg_sent} = useContext(Context)
  
  useEffect( () => {
		socket?.on('add-message', (msg: { user: string; message: string }) => {
			setChatBoxMessages((old:any) => [...old, {user:msg.user, msg:msg.message}] )
			console.log(msg)
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