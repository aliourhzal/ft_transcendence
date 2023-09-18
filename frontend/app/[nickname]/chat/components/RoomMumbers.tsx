import React, { useContext, useEffect, useState } from 'react'
import { Avatar } from '@nextui-org/react'
import { FaCrown } from 'react-icons/fa'
import RoomOptions from './RoomOptions'
import { IoIosArrowDown } from 'react-icons/io'
import Context from './Context'
import { useRouter } from 'next/navigation'
import { AiFillStar } from 'react-icons/Ai'
import { userInfo } from 'os'
import axios from 'axios'

interface RoomMumbersProps {
    info: any,
    user: any,
    isOwner: any,
    isAdmin: any,
    hide: any,
}

const RoomMumbers:React.FC<RoomMumbersProps> = ( { info, user, isOwner, isAdmin, hide } ) => {

    const _router = useRouter()

    const [showOptions, setShowOptions] = useState(false)

    const {setShowUserInfos, setUserInfoNick, setUserInfoId,  userData, rooms, socket} = useContext(Context)

    const [userStatus, setUserStatus] = useState<"online" | "offline" | undefined>(undefined)

  const getStatus = async () => {
    try {
    const userId = user.id
      setUserStatus((await axios.post('http://127.0.0.1:3000/users/userStatus', {userId}, {withCredentials: true})).data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect( () => {
    getStatus()
  }, [])

  return (
    <div className='transition-all m-2 border-2 p-2 rounded-lg bg-slate-600 border-slate-500 w-full flex flex-col items-center justify-center' key={user.id}>
        <div className='transition-all hover:scale-105 m-1 w-full flex justify-between items-center px-4 cursor-pointer' onClick={ () => {setShowOptions(old => !old)} }>
            <div className='transition-all font-bold flex justify-between items-center gap-3 hover:underline' onClick={() => {
                    if (user.id === userData.id)
                        _router.push(`/${user.nickName}`)
                    else {
                        hide();
                        setUserInfoNick(user.nickName)
                        setUserInfoId(user.id)
                        setShowUserInfos(true)
                    }
                }}>
                <div className='transition-all flex items-center gap-2 justify-center'>
                    { userStatus === 'online' && userData.id != user.id ?
                    <span className='animate-pulse rounded-full bg-green-400 opacity-90 border-2 border-green-500 w-2 h-2 -ml-1'></span>
                    : <span className='w-2 h-2 -ml-1'></span>}
                    <Avatar bordered color={"primary"} pointer zoomed src={ info.room.users.find(o => o.id === user.id).photo } />
                </div>
                <div>{user.id === info.userData.id ? 'you' : info.room.users.find(o => o.id === user.id)?.nickName}</div>
                {isOwner(info.room.users.find(o => o.id === user.id)) ? <FaCrown/> : ''}
                {isAdmin(info.room.users.find(o => o.id === user.id)) && !isOwner(info.room.users.find(o => o.id === user.id)) ? <AiFillStar/> : ''}
            </div>
            <div className='w-10 font-extrabold flex items-center justify-center'>
                {user.id != info.userData.id && isAdmin(info.room.users.find(o => o.id === userData.id))
                    && !isOwner(info.room.users.find(o => o.id === user.id)) ?
                     <IoIosArrowDown size={20} fontWeight={'bold'} className={'font-extrabold transition duration-300 delay-130 ' +
                    (showOptions ? 'rotate-180' : '')}/> : ''}
            </div>
        </div>
        <RoomOptions className={`transition-all duration-300 delay-130 ${showOptions ? 'flex' : 'hidden'}`} info={info} user={user} isAdmin={isAdmin} isOwner={isOwner} />
    </div>
  )
}

export default RoomMumbers