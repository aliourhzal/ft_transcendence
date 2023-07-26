import React, { useContext, useEffect, useState } from 'react'
import user, { Context, gimmeRandom } from '../page'
import { Socket } from 'socket.io-client'

const ChatBox = (props:any) => {

  const {socket, chatBoxMessages, setChatBoxMessages, userData} = useContext(Context)

  useEffect( () => {
    socket.on('add-message', msg => {
      setChatBoxMessages((old:any) => [...old, {user:msg.user, msg:msg.message}] )
      console.log(msg)
    })
  }, [socket])

  return (
    <div>
      {chatBoxMessages.map ((chatBoxMessage) => (<div className={chatBoxMessage.user == userData.nickname ? 'bg-blue-500' : 'bg-gray-500'}
      key={gimmeRandom()}>{chatBoxMessage.user} : {chatBoxMessage.msg}</div>))}
    </div>
  )
}

export default ChatBox