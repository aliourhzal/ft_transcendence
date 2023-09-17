import React, { useContext, useState } from 'react'
import { BiConversation, BiUserMinus } from 'react-icons/bi'
import { TbUserDown, TbUserUp } from 'react-icons/tb'
import { Context } from '../page'
import Ban from './Ban'
import Mute from './Mute'
import { FaRegUser } from 'react-icons/fa'

interface RoomOptionsProps {
    info : any,
    user: any,
    isAdmin: any,
    isOwner: any,
    className: string
}

const RoomOptions:React.FC<RoomOptionsProps> = ( { info, user, isAdmin, isOwner, className } ) => {

    const {socket} = useContext(Context)

    const promoteUser = async (id) => { socket.emit('user-promotion', {roomName:info.room.name, newAdminId:id}) }

    const demoteUser = async (id) => { socket.emit('user-demote', {roomName:info.room.name, dmotedUserId:id}) }

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

        socket.emit('ban-user', {roomName:info.room.name, bannedUserId:id, duration: temp_duration * 1000})
    }

    const muteUser = async (id, duration) => {
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

        if (temp_duration > 3 * 60 * 60 * 24)
            temp_duration = -1

        socket.emit('mute-user', {roomName:info.room.name, mutedUserId:id, duration: temp_duration * 1000})
    }

    const unMuteUser = (id) => {
        socket.emit('unmute-user', {roomName:info.room.name, unmutedUserId:id})
    }

const OptionsIcon = ( { icon } ) => {
    return (
        
        <div className='transition-all cursor-pointer w-11 text-whiteSmoke h-8 rounded-2xl flex items-center justify-center hover:scale-110 hover:text-white bg-darken-200'>
            {icon === 'demote' && <TbUserDown aria-label='demote' cursor="pointer" size={25} onClick={() => {demoteUser(user.id)}}/>}
            {icon === 'promote' && <TbUserUp aria-label='promote' cursor="pointer" size={25} onClick={() => {promoteUser(user.id)}}/>}
            {icon === 'kick' && <BiUserMinus strokeWidth={0} aria-label='kick' cursor="pointer" size={30} onClick={() => {kickUser(user.id)}}/>}
            {icon === 'ban' && <Ban banUser={banUser} user={user}/>}
            {icon === 'mute' && <Mute muteUser={muteUser} unMuteUser={unMuteUser} user={user} _state={info.room.users.find(o => o.nickName === user.nickName).isMuted} />}
        </div>
    )
}


  return (
    <div className={`${className} justify-start`}>
        {(isAdmin(info.room.users.find(o => o.nickName === info.userData.nickname)) && user.nickName != info.userData.nickname) &&
            !isOwner(info.room.users.find(o => o.nickName === user.nickName)) &&
            <>
            <div className='m-2 flex items-center justify-center gap-4'>
                { isAdmin(info.room.users.find(o => o.nickName === user.nickName)) ? isOwner(info.room.users.find(o => o.nickName === info.userData.nickname)) &&
                    <div className='flex flex-col items-center justify-center'><OptionsIcon icon={'demote'} />
                    <span className='bg-darken-300 text-whiteSmoke text-xs font-bold rounded-xl mt-1 w-16 flex items-center justify-center'>demote</span></div>
                    :
                    isOwner(info.room.users.find(o => o.nickName === info.userData.nickname)) &&
                    <div className='flex flex-col items-center justify-center'><OptionsIcon icon={'promote'} /><span className='bg-darken-300 text-whiteSmoke text-xs font-bold rounded-xl mt-1 w-16 flex items-center justify-center'>promote</span></div>
                }
                <div className='flex flex-col items-center justify-center'><OptionsIcon icon={'kick'} /><span className='bg-darken-300 text-whiteSmoke text-xs font-bold rounded-xl mt-1 w-16 flex items-center justify-center'>kick</span></div>
                <div className='flex flex-col items-center justify-center'><OptionsIcon icon={'ban'} /><span className='bg-darken-300 text-whiteSmoke text-xs font-bold rounded-xl mt-1 w-16 flex items-center justify-center'>ban</span></div>
                <div className='flex flex-col items-center justify-center'><OptionsIcon icon={'mute'} /><span className='bg-darken-300 text-whiteSmoke text-xs font-bold rounded-xl mt-1 w-16 flex items-center justify-center'>{info.room.users.find(o => o.nickName === user.nickName).isMuted === 'UNMUTED' ? 'mute' : 'unmute'}</span></div>
            </div>
            </>}
        {/* { user.nickName != info.userData.nickname &&
        <div className='flex gap-2 m-2'> <OptionsIcon icon={'profile'} /> <OptionsIcon icon={'dm'} /> </div>} */}
    </div>
  )
}

export default RoomOptions