import React, { useContext, useEffect, useState } from 'react'
import user, { Context } from '../page'

const ChatBox = (props:any) => {

  const {chatBoxMessages, setChatBoxMessages} = useContext(Context)

  // useEffect( () => {
  //   socket
  //   setChatBoxMessages
  // } )

  return (
    <div>
      {chatBoxMessages.map ((chatBoxMessage) => (<div className={chatBoxMessage.user == 'self' ? 'bg-blue-500' : 'bg-gray-500'}
      key={chatBoxMessage.msg}>{chatBoxMessage.user} : {chatBoxMessage.msg}</div>))}
    </div>
  )
}

export default ChatBox