import React, { useContext, useState } from 'react'
import { BiConversation, BiUserMinus, BiUserX, BiVolumeMute } from 'react-icons/Bi'
import { TbUserDown, TbUserUp } from 'react-icons/Tb'
import { Context } from '../page'

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

    const banUser = async (id, duration, durationType) => {
        if (duration <= 0)
        {
            // notify user
            return
        }
        var temp_duration: number

        if (durationType === 'hours')
            temp_duration = duration * 60 * 60
        else if (durationType === 'days')
            temp_duration = duration * 60 * 60 * 24
        else 
            return

        if (temp_duration > 3 * 60 * 60 * 24)
            temp_duration = -1
        console.log(id, temp_duration , durationType)
        socket.emit('ban-user', {roomName:info.room.name, bannedUserId:id, duration: temp_duration * 1000})
    }

    const muteUser = async (id, duration, durationType) => {
        if (duration <= 0)
        {
            // notify user
            return
        }
        var temp_duration: number
    
        if (durationType === 'hours')
            temp_duration = duration * 60 * 60
        else if (durationType === 'days')
            temp_duration = duration * 60 * 60 * 24
        else 
            return

        if (temp_duration > 3 * 60 * 60 * 24)
            temp_duration = -1
        console.log(id, temp_duration, durationType)
        socket.emit('mute-user', {roomName:info.room.name, mutedUserId:id, duration: temp_duration * 1000})
    }

    const [showDuration, setShowDuration] = useState(false)
    const [banDurationType, setBanDurationType] = useState('')
    const [banDuration, setBanDuration] = useState<number>(0)

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
                <BiUserX className='hover:text-whiteSmoke text-blueStrong' title='ban' aria-label='ban' cursor="pointer" size={30} onClick={() => {setShowBanDuration(old => !old)}}/>
                {showDuration && 
                    <div>
                        <span>select ban duration</span>
                        <input type='number' onChange={ (e) => { setBanDuration(+e.target.value) }}/>
                        <select name="banDuration" id="banDuration" onChange={(e) => { setBanDurationType(e.target.value) }}>
                            <option>select unit</option>
                            <option value={"hours"}>hours</option>
                            <option value={"days"}>days</option>
                        </select>
                        <button type="button" className="w-auto text-white bg-red-900 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={() => {
                            banUser(user.id, banDuration, banDurationType)
                            setBanDuration(0)
                            setBanDurationType('')
                            setShowDuration(old => !old)
                        }}>confirm</button>
                    </div>
                }
                <BiVolumeMute className='hover:text-whiteSmoke text-blueStrong' title='mute' aria-label='mute' cursor="pointer" size={25} onClick={ () => { setShowBanDuration(old => !old) }}/>
                {showDuration && 
                    <div>
                        <span>select ban duration</span>
                        <input type='number' onChange={ (e) => { setBanDuration(+e.target.value) }}/>
                        <select name="banDuration" id="banDuration" onChange={(e) => { setBanDurationType(e.target.value) }}>
                            <option>select unit</option>
                            <option value={"hours"}>hours</option>
                            <option value={"days"}>days</option>
                        </select>
                        <button type="button" className="w-auto text-white bg-red-900 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={() => {
                            muteUser(user.id, banDuration, banDurationType)
                            setBanDuration(0)
                            setBanDurationType('')
                            setShowDuration(old => !old)
                        }}>confirm</button>
                    </div>
                }
            </>}
        { user.nickName != info.userData.nickname &&
        <BiConversation className='hover:text-whiteSmoke text-blueStrong' title='DM' aria-label='DM' cursor="pointer" size={25}/>}
    </div>
  )
}

export default RoomOptions