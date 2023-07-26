import React, { useContext, useEffect, useState } from 'react'
import user, { Context, gimmeRandom } from '../page'

const ChatBox = (props:any) => {

  const {chatBoxMessages, setChatBoxMessages, userData} = useContext(Context)

  // useEffect( () => {
  //   socket
  //   setChatBoxMessages
  // } )

  return (
    <div>
      {chatBoxMessages.map ((chatBoxMessage) => (<div className={chatBoxMessage.user == userData.nickname ? 'bg-blue-500' : 'bg-gray-500'}
      key={gimmeRandom()}>{chatBoxMessage.user} : {chatBoxMessage.msg}</div>))}
    </div>
  )
}

export default ChatBox