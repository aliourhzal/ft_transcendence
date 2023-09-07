import React, { useContext, useEffect } from 'react'
import user, { Context, gimmeRandom } from '../page'
import { Socket } from 'socket.io-client'
import SelfChatBox from './selfChatBox'
import OthersChatBox from './othersChatBox'
import BotChatBox from './BotChatBox'

interface ChatBoxProps {
  activeUserConv: any
}

const ChatBox:React.FC<ChatBoxProps> = ( { activeUserConv } ) => {
  
  const {scrollToBottom, ref, chatBoxMessages, userData, rooms} = useContext(Context)

  // let temp = document.getElementById('chatbox')

  useEffect ( () => {
    scrollToBottom();
  }, [])

  return (
    chatBoxMessages.length != 0 &&
    <div className='z-0' ref={ref}>
        {chatBoxMessages.map ((BoxMessage) =>
          BoxMessage.userId != 'bot' ?
              (BoxMessage.userId == userData.id ? <SelfChatBox msg={BoxMessage.msg} user={rooms.find(o => o.id === activeUserConv.id).users.find(o => o.id === BoxMessage.userId)} key={gimmeRandom()}/>
              : <OthersChatBox msg={BoxMessage.msg} user={rooms.find(o => o.id === activeUserConv.id).users.find(o => o.id === BoxMessage.userId)} key={gimmeRandom()}/>)
          : <BotChatBox msg={BoxMessage.msg} key={gimmeRandom()} />
        )}
      </div>
  )
}

export default ChatBox