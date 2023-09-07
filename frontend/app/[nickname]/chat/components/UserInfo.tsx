import React, { useContext, useState } from 'react'
import Popup from './Popup'
import { Avatar } from '@nextui-org/react'
import { BiConversation } from 'react-icons/bi'
import { FaRegUser } from 'react-icons/fa'
import { Context } from '../page'
import { useRouter } from 'next/navigation'

const _picture = ( { src } ) => {
    return (
        <div className='absolute flex items-center w-full justify-center z-20 left-0 top-20'>
            <img className='rounded-full w-60 h-60' src={src}/>
        </div>
    )
}

interface UserInfoProps {
    showUserInfos: any,
    setShowUserInfos: any,
    nickname: any,
    id: any,
    setChatBoxMessages: any,
    setActiveUserConv: any,
    setShowConv: any
}

const UserInfo:React.FC<UserInfoProps> = ( {id, showUserInfos, setShowUserInfos, nickname, setChatBoxMessages, setActiveUserConv, setShowConv} ) => {

    const [showPic, setShowPic] = useState(false)

    const {socket, rooms} = useContext(Context)

    const _router = useRouter()

    socket.emit('get-users', null)

  return (
    nickname && id &&
    <>
    <Popup isOpen={showUserInfos} modalAppearance={() => setShowUserInfos(false)}>
        <img className='rounded-2xl' src={rooms.find(o => o.name === nickname)?.users.find(o => o.id === id)?.cover} alt="" />
        <div className='flex items-center justify-center -mt-7 mb-6'>
            <Avatar pointer size={'xl'} zoomed bordered color={'gradient'} src={rooms.find(o => o.name === nickname)?.users.find(o => o.id === id)?.photo} className='scale-150' onMouseOver={()=>{
                setShowPic(true)
            }} onMouseLeave={() => {setShowPic(false)}}/>
        </div>
        
        <div className='flex flex-col items-center justify-center gap-4'>
            <div className='flex items-center justify-center gap-1 font-bold mt-2'>
                <span>{rooms.find(o => o.name === nickname)?.users.find(o => o.id === id)?.firstName}</span>
                <span>{rooms.find(o => o.name === nickname)?.users.find(o => o.id === id)?.lastName}</span>
            </div>
            <div className='flex gap-4 scale-110 text-whiteSmoke w-20 h-8 rounded-2xl items-center justify-center bg-darken-200'>
                <BiConversation className='transition-all hover:scale-110' title='DM' aria-label='DM' cursor="pointer" size={25} onClick={ () => {
                    setShowUserInfos(false)
                    if (!rooms.find(o => o.name === nickname)) {
                        socket.emit('start-dm', {reciverUserId: rooms.find(o => o.name === nickname)?.users.find(o => o.id === id)?.id})
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
            </div>
        </div>
    </Popup>
    {/* { showPic && showUserInfos && <_picture src={currentUsers.find(o => o.nickname === nickname).profilePic}/>} */}
    </>
  )
}

export default UserInfo