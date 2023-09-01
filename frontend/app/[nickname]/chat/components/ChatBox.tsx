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
  
  const {scrollToBottom, ref, socket, chatBoxMessages, setChatBoxMessages, userData, rooms, setRooms} = useContext(Context)

  const addmsg = (msg) => {
    let temp_rooms = [...rooms]
    temp_rooms.find(o => o.name === activeUserConv.name)?.msgs.push({user:msg.user, msg:msg.msg})
    setRooms(temp_rooms)
    console.log(activeUserConv)
    if (rooms.find(o => o.id === activeUserConv.id).id == msg.roomId) {
      console.log("lmfaoing")
      setChatBoxMessages((old:any) => [...old, {user:msg.user, msg:msg.msg, id:msg.idOfmsg}])
    }
  }
  
  useEffect( () => {
    // if (msg_sent) {
        socket.on('add-message', addmsg)
        return () => socket.off('add-message', addmsg)
    // }
	},[chatBoxMessages])

  // let temp = document.getElementById('chatbox')

  useEffect ( () => {
    scrollToBottom();
  }, [])

  return (
    chatBoxMessages.length != 0 &&
    <div className='z-0' ref={ref}>
        {chatBoxMessages.map ((BoxMessage) =>
          BoxMessage.user != 'bot' ?
              (BoxMessage.user == userData.nickname ? <SelfChatBox msg={BoxMessage.msg} user={rooms.find(o => o.id === activeUserConv.id)?.users.find(o => o.nickName === BoxMessage.user)} key={gimmeRandom()}/>
              : <OthersChatBox msg={BoxMessage.msg} user={rooms.find(o => o.id === activeUserConv.id)?.users.find(o => o.nickName === BoxMessage.user)} key={gimmeRandom()}/>)
          : <BotChatBox msg={BoxMessage.msg} key={gimmeRandom()} />
        )}
      </div>
  )
}

export default ChatBox