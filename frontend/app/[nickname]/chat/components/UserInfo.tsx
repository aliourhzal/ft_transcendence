import React, { useContext, useState } from 'react'
import Popup from './Popup'
import { Avatar } from '@nextui-org/react'
import { BiConversation } from 'react-icons/bi'
import { FaRegUser } from 'react-icons/fa'
import { PiGameControllerBold } from 'react-icons/pi'
import { Context } from '../page'
import { useRouter } from 'next/navigation'

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
                    if (!rooms.find(o => o.name === nickname)) {
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
                        setActiveUserConv(rooms.find(o => o.name === nickname))
                        setShowConv(true)
                        setChatBoxMessages(rooms.find(o => o.name === nickname)?.msgs)
                      }
                }}/>
                <FaRegUser className='transition-all hover:scale-110' title='profile' aria-label='profile' cursor="pointer" size={20} onClick={() => {
                    _router.push(`/${nickname}`)
                }}/>
                <PiGameControllerBold  className='transition-all hover:scale-110' title='profile' aria-label='invite to game' cursor="pointer" size={23} onClick={() => {
                    socket.emit('send-message', {message:`${userData.nickname} invited you to a pong game %GameInvit%`, roomId:rooms.find(o => o.id === activeUserConv.id).id})
                    _router.push(`/${userData.nickname}/game?id=${id}`)
                }}/>
            </div>
        </div>
    </Popup>
    </>
  )
}

export default UserInfo