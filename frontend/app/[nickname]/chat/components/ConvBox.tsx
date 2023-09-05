import React, { useContext, useEffect, useRef, useState } from 'react'
import { conversation } from '../page'
import { Context } from '../page'
import axios from 'axios'
import { getCookie } from '../../layout'

interface ConvBoxProps {
    data : conversation
    allUsers: any[]
    setActiveUserConv: any,
    activeUserConv: any,
    convsFilter: any
}

const ConvBox: React.FC<ConvBoxProps> = ({data, allUsers, setActiveUserConv, activeUserConv, convsFilter}) => {

  const {rooms, setShowConv, setChatBoxMessages, msgInputRef} = useContext(Context)

  const handleClick = async () => {
    if (data.id == activeUserConv.id) {
      setShowConv(false)
      setActiveUserConv({
        name: '.',
        photo: '',
        lastmsg: {userId: '', msg: ''}, 
        id: 0,
      })
      convsFilter('')
      setChatBoxMessages([])
      return ;
    }
    rooms.find(o => o.id === data.id).pending = false
    setActiveUserConv(data)
    setShowConv(true)
    convsFilter('')
    // if (new_msg_notif.name == activeUserConv.name)
    //   notify_conv_msg(false, '')
    try {
      await axios.post('http://127.0.0.1:3000/rooms/select-room', {roomId:rooms.find(o => o.id === data.id).id}, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${getCookie('access_token')}`,
          'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
        })
      .then((res) => {
        setChatBoxMessages(res.data.msg)
        console.log(res.data.msg)
      })
    } catch(error) {
      // alert(error)
      console.log(error)
    }
    if (data.id != activeUserConv.id)
      msgInputRef.current.value = ''
    msgInputRef.current?.focus()
    // const response = await fetch('http://127.0.0.1:3000/rooms/join-room', {method:'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({roomName:data.data.name, auth: socket.auth['token'], socket:socket.id})}).then((response) => response.json())
  }
  
  const [lastmsg, setLastMsg] = useState(rooms.find(o => o.id === data.id).lastmsg)
  const [pending, setPending] = useState(data.pending)
  console.log(lastmsg)

  return (
    <div className={'transition-all duration-200 ' + (activeUserConv.id === data.id ? 'bg-blueStrong' : 'bg-zinc-800 hover:bg-zinc-700') + " cursor-pointer convGroup z-0 focus:bg-blueStrong w-[70%] left-[15%] h-[100px] gap-4 relative my-3 rounded-md active:bg-blue-500 flex items-center justify-start text-[16px]"} onClick={handleClick} onFocus={handleClick}>
        <div className='w-20 h-20 flex items-center justify-center relative mx-[7%]'>
          <img alt={data.name} width={11} height={11} className="rounded-full border-2 border-slate-300 w-11 h-11" src={rooms.find(o => o.id === data.id)?.type === 'DM' ? allUsers.find(o => o.id === rooms.find(o => o.id === data.id)?.users?.find(o => o.nickName === data.name)?.id)?.profilePic : data.photo} />
          { rooms.find(o => o.id === data.id)?.type === 'DM' && allUsers.find(o => o.id === rooms.find(o => o.id === data.id).users.find(o => o.nickName === data.name).id)?.status === 'online' ?
          <span className='rounded-full bg-green-400 opacity-90 border-2 border-green-500 w-2 h-2 absolute top-[65%] right-[15%]'></span>
          : ''}
        </div>
        <div className='flex flex-col justify-center gap-2 w-[100%] h-[50%] items-start'>
          <div className="left-[30%] top-[25%] text-gray-200 font-medium">{rooms.find(o => o.id === data.id).type === 'DM' ? allUsers.find(o => o.id === rooms.find(o => o.id === data.id)?.users?.find(o => o.nickName === data.name)?.id)?.nickname : data.name}</div>
          <div className="left-[30%] top-[50%] text-gray-200 text-opacity-70 font-normal">{
            lastmsg?.msg ? lastmsg?.msg.length > 15 ? allUsers.find(o => o.id === lastmsg.userId).nickname + " : " + lastmsg?.msg.substring(0, 15) + '...' : allUsers.find(o => o.id === lastmsg.userId).nickname + " : " + lastmsg?.msg : ''}</div>
        </div>
        { pending &&
          <span className='mx-5 absolute animate-ping inline-flex w-2 h-2 rounded-full bg-blueStrong z-10 opacity-90 right-0 top-[20%]'></span>
        }
        {/* <div className="left-[85%] top-[70%] lg:top-[50%] absolute text-gray-200 text-opacity-70 font-normal">10:30</div> */}
    </div>
  )
}

export default ConvBox