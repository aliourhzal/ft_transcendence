import React, { useContext, useState } from 'react'
import Popup from './Popup'
import { Avatar } from '@nextui-org/react'
import { BiConversation } from 'react-icons/bi'
import { FaRegUser } from 'react-icons/fa'
import { PiGameControllerBold } from 'react-icons/pi'
import Context from './Context'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { getCookie } from '../../layout'

interface UserInfoProps {
    showUserInfos: any,
    setShowUserInfos: any,
    nickname: any,
    id: any,
    setChatBoxMessages: any,
    setActiveUserConv: any,
    setShowConv: any
    activeUserConv: any
}

const UserInfo:React.FC<UserInfoProps> = ( {id, showUserInfos, setShowUserInfos, nickname, setChatBoxMessages, setActiveUserConv, activeUserConv, setShowConv} ) => {

    const {socket, rooms, userData} = useContext(Context)

    const _router = useRouter()

    const getDm = async (data) => {
        try {
          await axios.post('http://127.0.0.1:3000/rooms/select-room', {roomId:rooms.find(o => o.id === data.id)?.id}, {
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${getCookie('access_token')}`,
              'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
            })
          .then((res) => {
            setChatBoxMessages(res.data.msg)
          })
        } catch(error) {
          // alert(error)
          console.log(error)
        }
        setShowConv(true)
      }

  return (
    nickname && id &&
    <>
    <Popup isOpen={showUserInfos} modalAppearance={() => setShowUserInfos(false)}>
        <img className='rounded-2xl' src={rooms.find(o => o.name === activeUserConv.name)?.users.find(o => o.id === id)?.cover} alt="" />
        <div className='flex items-center justify-center -mt-7 mb-6'>
            <Avatar pointer size={'xl'} zoomed bordered color={'gradient'} src={rooms.find(o => o.name === activeUserConv.name)?.users.find(o => o.id === id)?.photo} className='scale-150' />
        </div>
        
        <div className='flex flex-col items-center justify-center gap-4'>
            <div className='flex items-center justify-center gap-1 font-bold mt-2'>
                <span>{rooms.find(o => o.name === activeUserConv.name)?.users.find(o => o.id === id)?.firstName}</span>
                <span>{rooms.find(o => o.name === activeUserConv.name)?.users.find(o => o.id === id)?.lastName}</span>
            </div>
            <div className='flex gap-4 scale-110 text-whiteSmoke w-32 h-8 rounded-2xl items-center justify-center bg-darken-200'>
                <BiConversation className='transition-all hover:scale-110' title='DM' aria-label='DM' cursor="pointer" size={25} onClick={ () => {
                    setShowUserInfos(false)
                    if (!rooms.find(o => o.name === nickname) && rooms.find(o => o.name === nickname)?.type != 'DM') {
                        socket.emit('start-dm', {reciverUserId: id})
                        setActiveUserConv({
                            name: '.',
                            photo: '',
                            lastmsg: {userId: '', msg: ''}, 
                            id: 0,
                        })
                        setChatBoxMessages([])
                        setShowConv(false)
                        // setActiveUserConv(rooms.find(o => o.name === user.nickname))
                      }
                      else {
                        if (rooms.filter(o => o.name === nickname)[0].type === 'DM') {
                            setActiveUserConv(rooms.find(o => o.name === nickname))
                            getDm(rooms.find(o => o.name === nickname))
                        }
                        else {
                            setActiveUserConv(rooms.filter(o => o.name === nickname)[1])
                            getDm(rooms.filter(o => o.name === nickname)[1])
                        }
                      }
                }}/>
                <FaRegUser className='transition-all hover:scale-110' title='profile' aria-label='profile' cursor="pointer" size={20} onClick={() => {
                    _router.push(`/${nickname}`)
                }}/>
                { rooms.find(o => o.id === activeUserConv.id)?.type === 'DM' &&
                <PiGameControllerBold  className='transition-all hover:scale-110' title='profile' aria-label='invite to game' cursor="pointer" size={23} onClick={() => {
                    if (rooms.find(o => o.id === activeUserConv.id)?.type === 'DM') {
                        socket.emit('send-message', {message:`%GameInvite%`, roomId:rooms.find(o => o.id === activeUserConv.id)?.id})
                        _router.push(`/${userData.nickname}/game?id=${id}`)
                    }
                    else {
                        if (rooms.find(o => o.id === activeUserConv.id)?.name === nickname && rooms.find(o => o.id === activeUserConv.id)?.type === 'DM')
                            socket.emit('send-message', {message: '%GameInvite%', roomId:rooms.find(o => o.id === activeUserConv.id)?.id})
                        else
                            socket.emit('start-dm', {reciverUserId: id})
                    }
                    setShowUserInfos(false)
                }}/>}
            </div>
        </div>
    </Popup>
    </>
  )
}

export default UserInfo