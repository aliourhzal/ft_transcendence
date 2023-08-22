import React, { useContext, useState } from 'react'
import { BiConversation, BiUserMinus, BiUserX, BiVolumeMute } from 'react-icons/Bi'
import { TbUserDown, TbUserUp } from 'react-icons/Tb'
import { Context } from '../page'
import Ban from './Ban'
import Mute from './Mute'

interface RoomOptionsProps {
    info : any,
    user: any,
    isAdmin: any,
    isOwner: any,
}

const RoomOptions:React.FC<RoomOptionsProps> = ( { info, user, isAdmin, isOwner } ) => {

    const {socket} = useContext(Context)

    const promoteUser = async (id) => { socket.emit('user-promotion', {roomName:info.room.name, newAdminId:id}) }

    const demoteteUser = async (id) => { socket.emit('user-demote', {roomName:info.room.name, dmotedUserId:id}) }

    const kickUser = async (id) => { socket.emit('kick-user', {roomName:info.room.name, kickedUserId:id}) }

    const banUser = async (id, duration) => {
        var temp_duration: number

        if (duration === '2')
            temp_duration = 120
        else if (duration === '1')
            temp_duration = 3600
        else if (duration === '8')
            temp_duration = 3600 * 8
        else if (duration === 'permanent')
            temp_duration = -1
        else
            return

        console.log(id, temp_duration)
        socket.emit('ban-user', {roomName:info.room.name, bannedUserId:id, duration: temp_duration * 1000})
    }

    const muteUser = async (id, duration, durationType) => {
        var temp_duration: number
    
        if (durationType === 'hours')
            temp_duration = duration * 60 * 60
        else if (durationType === 'days')
            temp_duration = duration * 60 * 60 * 24
        else if (durationType === 'permanent')
            temp_duration = -1
        else
            return

        if (temp_duration > 3 * 60 * 60 * 24)
            temp_duration = -1
        console.log(id, temp_duration, durationType)
        socket.emit('mute-user', {roomName:info.room.name, mutedUserId:id, duration: temp_duration * 1000})
    }

  return (
    <div className='flex items-center gap-2'>
        {(isAdmin(info.room.users.find(o => o.nickName === info.userData.nickname)) && user.nickName != info.userData.nickname) &&
            !isOwner(info.room.users.find(o => o.nickName === user.nickName)) &&
            <>
                { isAdmin(info.room.users.find(o => o.nickName === user.nickName)) ? isOwner(info.room.users.find(o => o.nickName === info.userData.nickname)) &&
                    <TbUserDown className='hover:text-whiteSmoke text-blueStrong' title='demote' aria-label='demote' cursor="pointer" size={20} onClick={() => {demoteteUser(user.id)}}/>
                    :
                    isOwner(info.room.users.find(o => o.nickName === info.userData.nickname)) && <TbUserUp className='hover:text-whiteSmoke text-blueStrong' title='promote' strokeWidth={2.3} aria-label='promote' cursor="pointer" size={25} onClick={() => {promoteUser(user.id)}}/>
                }
                <BiUserMinus className='hover:text-whiteSmoke text-blueStrong' title='kick' strokeWidth={0} aria-label='kick' cursor="pointer" size={30} onClick={() => {kickUser(user.id)}}/>
                <Ban banUser={banUser} user={user}/>
                <Mute muteUser={muteUser} user={user}/>
            </>}
        { user.nickName != info.userData.nickname &&
        <BiConversation className='hover:text-whiteSmoke text-blueStrong' title='DM' aria-label='DM' cursor="pointer" size={25}/>}
    </div>
  )
}

export default RoomOptions