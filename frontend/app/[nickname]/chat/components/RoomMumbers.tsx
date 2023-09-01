import React, { useContext, useState } from 'react'
import { Avatar } from '@nextui-org/react'
import { AiFillStar } from 'react-icons/Ai'
import { FaCrown } from 'react-icons/fa'
import RoomOptions from './RoomOptions'
import { IoIosArrowDown } from 'react-icons/io'
import { Context } from '../page'
import { useRouter } from 'next/navigation'

interface RoomMumbersProps {
    info: any,
    user: any,
    isOwner: any,
    isAdmin: any,
    hide: any,
    allUsers: any
}

const RoomMumbers:React.FC<RoomMumbersProps> = ( { info, user, isOwner, isAdmin, hide, allUsers } ) => {

    const _router = useRouter()

    const [showOptions, setShowOptions] = useState(false)

    const {setShowUserInfos, setUserInfoNick, userData, rooms, socket} = useContext(Context)

    socket.emit('get-users', null)

  return (
    <div className='m-2 border-2 p-2 rounded-lg bg-slate-600 border-slate-500 w-full flex flex-col items-center justify-center' key={user.id}>
        <div className='m-1 w-full flex justify-between items-center px-4 cursor-pointer' onClick={ () => {setShowOptions(old => !old)} }>
            <div className='font-bold flex justify-between items-center gap-3 hover:underline' onClick={() => {
                    if (user.nickName === userData.nickname)
                        _router.push(`/${user.nickName}`)
                    else {
                        hide();
                        setUserInfoNick(user.nickName)
                        setShowUserInfos(true)
                    }
                }}>
                <div className='flex items-center gap-2 justify-center'>
                    { rooms.find(o => o.name === user.nickName)?.type === 'DM' && allUsers.find(o => o.nickname === user.nickName).status === 'online' ?
                    <span className='rounded-full bg-green-400 opacity-90 border-2 border-green-500 w-2 h-2 -ml-1'></span>
                    : <span className='w-2 h-2 -ml-1'></span>}
                    <Avatar bordered color={"primary"} pointer zoomed src={info.room.users.find(o => o.nickName === user.nickName).photo} />
                </div>
                <div>{user.nickName === info.userData.nickname ? 'you' : user.nickName}</div>
                {isOwner(info.room.users.find(o => o.nickName === user.nickName)) ? <FaCrown/> : ''}
                {isAdmin(info.room.users.find(o => o.nickName === user.nickName)) && !isOwner(info.room.users.find(o => o.nickName === user.nickName)) ? <AiFillStar/> : ''}
            </div>
            <div className='w-10 font-extrabold flex items-center justify-center'>
                {user.nickName != info.userData.nickname && isAdmin(info.room.users.find(o => o.nickName === userData.nickname))
                    && !isOwner(info.room.users.find(o => o.nickName === user.nickName)) ?
                     <IoIosArrowDown size={20} fontWeight={'bold'} className={'font-extrabold transition duration-300 delay-130 ' +
                    (showOptions ? 'rotate-180' : '')}/> : ''}
            </div>
        </div>
        {showOptions && <RoomOptions info={info} user={user} isAdmin={isAdmin} isOwner={isOwner} />}
    </div>
  )
}

export default RoomMumbers