import React, { useContext, useState } from 'react'
import Popup from './Popup'
import { Avatar } from '@nextui-org/react'
import { BiConversation } from 'react-icons/Bi'
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

const UserInfo = ( {showUserInfos, setShowUserInfos, nickname, currentUsers} ) => {

    const [showPic, setShowPic] = useState(false)

    const {socket} = useContext(Context)

    const _router = useRouter()

    socket.emit('get-users', null)

  return (
    nickname &&
    <>
    <Popup isOpen={showUserInfos} modalAppearance={() => setShowUserInfos(false)}>
        <img className='rounded-2xl' src={currentUsers.find(o => o.nickname === nickname).coverPic} alt="" />
        <div className='flex items-center justify-center -mt-7 mb-6'>
            <Avatar pointer size={'xl'} zoomed bordered color={'gradient'} src={currentUsers.find(o => o.nickname === nickname).profilePic} className='scale-150' onMouseOver={()=>{
                setShowPic(true)
            }} onMouseLeave={() => {setShowPic(false)}}/>
        </div>
        
        <div className='flex flex-col items-center justify-center gap-4'>
            <div className='flex items-center justify-center gap-1 font-bold mt-2'>
                <span>{currentUsers.find(o => o.nickname === nickname).firstName}</span>
                <span>{currentUsers.find(o => o.nickname === nickname).lastName}</span>
            </div>
            <div className='flex gap-4 scale-110 text-whiteSmoke w-20 h-8 rounded-2xl items-center justify-center bg-darken-200'>
                <BiConversation className='hover:scale-110' title='DM' aria-label='DM' cursor="pointer" size={25} onClick={ () => {
                    setShowUserInfos(false)
                    socket.emit('start-dm', {reciverUserId: currentUsers.find(o => o.nickname === nickname).intra_Id})
                    
                }}/>
                <FaRegUser className='hover:scale-110' title='profile' aria-label='profile' cursor="pointer" size={20} onClick={() => {
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