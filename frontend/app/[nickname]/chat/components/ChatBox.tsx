import React, { useContext, useEffect, useState } from 'react'
import user, { Context } from '../page'

const ChatBox = (props:any) => {

  const {socket} = useContext(Context)

	const [chatBoxMessages, setChatBoxMessages] = useState<any>([
		{user:'lmao', msg:'yo'},
		{user:'self', msg:'hello'}
	])

  useEffect( () => {
    socket.on('')
    // setChatBoxMessages
  })

  return (
    <div>
      {chatBoxMessages.map ((chatBoxMessages) => (<div className={chatBoxMessages.user == 'self' ? 'bg-blue-500' : 'bg-gray-500'}
      key={chatBoxMessages.msg}>{chatBoxMessages.user} : {chatBoxMessages.msg}</div>))}
    </div>
  )
}

export default ChatBox