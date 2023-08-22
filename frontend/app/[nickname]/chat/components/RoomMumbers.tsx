import React, { useState } from 'react'
import { Avatar } from '@nextui-org/react'
import { AiFillStar } from 'react-icons/Ai'
import { FaCrown } from 'react-icons/fa'
import RoomOptions from './RoomOptions'
import { IoIosArrowDown } from 'react-icons/io'

interface RoomMumbersProps {
    info: any,
    user: any,
    isOwner: any,
    isAdmin: any,
}

const RoomMumbers = ( { info, user, isOwner, isAdmin } ) => {

    const [showOptions, setShowOptions] = useState(false)

  return (
    <div className='m-2 border-2 p-2 rounded-lg bg-slate-600 border-slate-500 w-full flex flex-col items-center justify-center' key={user.id}>
        <div className='m-1 w-full flex justify-between items-center px-4 cursor-pointer' onClick={ () => {setShowOptions(old => !old)} }>
            <div className='font-bold flex justify-between items-center gap-3'>
                <Avatar bordered color={"primary"} pointer zoomed src={info.room.users.find(o => o.nickName === user.nickName).photo}/>
                <div>{user.nickName === info.userData.nickname ? 'you' : user.nickName}</div>
                {isOwner(info.room.users.find(o => o.nickName === user.nickName)) ? <FaCrown/> : ''}
                {isAdmin(info.room.users.find(o => o.nickName === user.nickName)) && !isOwner(info.room.users.find(o => o.nickName === user.nickName)) ? <AiFillStar/> : ''}
            </div>
            <div className='w-10 font-extrabold flex items-center justify-center'>
                {user.nickName != info.userData.nickname ?
                     <IoIosArrowDown size={20} fontWeight={'bold'} className={'font-extrabold transition duration-300 delay-130 ' +
                    (showOptions ? 'rotate-180' : '')}/> : ''}
            </div>
        </div>
        {showOptions && <RoomOptions info={info} user={user} isAdmin={isAdmin} isOwner={isOwner} />}
    </div>
  )
}

export default RoomMumbers