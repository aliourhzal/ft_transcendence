import React from 'react'
import user from '../page'

const ChatBox = (props:any) => {
  return (
    <div>
      {props.msgs.map ((item:any) => (<div className={item.user == 'self' ? 'bg-blue-500' : 'bg-gray-500'} key={item.id}>{item.user} : {item.msg}</div>))}
    </div>
  )
}

export default ChatBox