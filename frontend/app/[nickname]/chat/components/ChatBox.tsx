import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import user, { Context, gimmeRandom } from '../page'
import { Socket } from 'socket.io-client'
import SelfChatBox from './selfChatBox'
import OthersChatBox from './othersChatBox'
import BotChatBox from './BotChatBox'

const ChatBox = () => {
  
  const {scrollToBottom, ref, socket, chatBoxMessages, setChatBoxMessages, userData, msg_sent, rooms, setRooms, activeUserConv} = useContext(Context)
  
  const [currentRoom, setCurrentRoom] = useState(rooms.find(o => o.name === activeUserConv.name))

  const addmsg = (msg) => {
    let temp_rooms = [...rooms]
    temp_rooms.find(o => o.name === activeUserConv.name)?.msgs.push({user:msg.user, msg:msg.msg})
    setRooms(temp_rooms)
    // setChatBoxMessages(rooms.find(o => o.name == activeUserConv.name).msgs)
    // console.log(rooms.find(o => o.name === activeUserConv.name).msgs)
    // rooms.find(o => o.name === activeUserConv.name)
    // ((old:any) => [...old, {user:msg.user, msg:msg.message}] )
    console.log("______", msg, "________")
    if (activeUserConv.name == msg.roomName) {
      setChatBoxMessages((old:any) => [...old, {user:msg.user, msg:msg.msg, id:msg.idOfmsg}])
    }
  }
  
  useEffect( () => {
    // if (msg_sent) {
        socket.on('add-message', addmsg)
        return () => socket.off('add-message', addmsg)
    // }
	},[msg_sent, chatBoxMessages])

  // let temp = document.getElementById('chatbox')

  useEffect ( () => {
    scrollToBottom();
  }, [])

  return (
    chatBoxMessages.length != 0 &&
      <div className='z-0' ref={ref}>
        {chatBoxMessages.map ((BoxMessage) =>
          BoxMessage.user != 'bot' ?
              (BoxMessage.user == userData.nickname ? <SelfChatBox msg={BoxMessage.msg} user={currentRoom?.users.find(o => o.nickName === BoxMessage.user)} key={gimmeRandom()}/>
              : <OthersChatBox msg={BoxMessage.msg} user={currentRoom.users.find(o => o.nickName === BoxMessage.user)} key={gimmeRandom()}/>)
          : <BotChatBox msg={BoxMessage.msg} key={gimmeRandom()} />
        )}
      </div>
  )
}

export default ChatBox