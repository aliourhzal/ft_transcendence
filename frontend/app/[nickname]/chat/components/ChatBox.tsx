import React, { useContext, useEffect } from 'react'
import Context, { gimmeRandom } from './Context'
import SelfChatBox from './selfChatBox'
import OthersChatBox from './othersChatBox'
import BotChatBox from './BotChatBox'

interface ChatBoxProps {
  activeUserConv: any
}

const ChatBox:React.FC<ChatBoxProps> = ( { activeUserConv } ) => {
  
  const {scrollToBottom, ref, chatBoxMessages, userData, rooms} = useContext(Context)

  useEffect ( () => {
    scrollToBottom();
  }, [])

  console.log(chatBoxMessages)

  return (
    chatBoxMessages.length != 0 &&
    <div className='z-0' ref={ref}>
        {chatBoxMessages.map ((BoxMessage) =>
          BoxMessage.userId != 'bot' ?
              (BoxMessage.userId == userData.id ? <SelfChatBox activeUserConv={activeUserConv} msg={BoxMessage} user={rooms.find(o => o.id === activeUserConv.id)?.users.find(o => o.id === BoxMessage.userId)} key={gimmeRandom()}/>
              : <OthersChatBox msg={BoxMessage.msg} user={rooms.find(o => o.id === activeUserConv.id)?.users.find(o => o.id === BoxMessage.userId)} key={gimmeRandom()}/>)
          : <BotChatBox msg={BoxMessage.msg} key={gimmeRandom()} />
        )}
      </div>
  )
}

export default ChatBox