import React, { useContext, useState } from 'react'
import Popup from './Popup'

import { BiVolumeMute } from "react-icons/Bi";
import { BiUserMinus } from "react-icons/Bi";
import { BiUserX } from "react-icons/Bi";
import { TbUserUp } from "react-icons/Tb";
import { TbUserDown } from "react-icons/Tb";
import { BiConversation } from "react-icons/Bi";
import { AiOutlineUsergroupAdd } from "react-icons/Ai";

import { UniversalData } from '../../layout';
import { Avatar } from '@nextui-org/react';
import NewRoomUsers from './NewRoomUsers';
import { Context } from '../page';

interface RoomInfoProps {
    room:any
    setShow: any
    show: boolean
    userData: UniversalData
}


const RoomInfo: React.FC<RoomInfoProps> = (info) => {
    
    const {socket} = useContext(Context)

    const hide = () => {
        info.setShow(false)
        setShowUsersForm(false)
    }
    
    const isAdmin = (user) => {
        if (user.type === 'OWNER' || user.type === 'ADMIN')
            return true
        return false
    }

    const promoteUser = (id) => { socket.emit('setOtherAasAdministrators', {roomName:info.room.name, newAdminUser:id}) }

    const demoteteUser = (id) => {

    }

    const kickUser = (id) => {

    }

    const banUser = (id) => {
        
    }

    const muteUser = (id) => {

    }

    const   addUsersToRoom = (newUsers) => {
        setShowUsersForm(false)
        console.log(newUsers)
    }

    
    const [showUsersForm, setShowUsersForm] = useState(false)

  return (
    <Popup isOpen={info.show} modalAppearance={hide}>
        <div className='flex items-end justify-center m-4'>
            <Avatar zoomed text={info.room.name} bordered color={"primary"} alt={info.room.name} className="ml-8 w-auto h-auto"></Avatar>
            <AiOutlineUsergroupAdd color={showUsersForm ? 'rgb(41 120 242)' : ''} cursor={'pointer'} className='hover:text-whiteSmoke' onClick={ () => setShowUsersForm(old => !old) }/>
        </div>
        {showUsersForm && <NewRoomUsers addUsers={addUsersToRoom} />}
        <div className='flex flex-col justify-center items-center overflow-y-scroll'>
            {info.room.users.map(user => (
                    <div className='m-2 border-2 p-2 rounded-lg bg-slate-600 border-slate-500 w-full flex flex-col items-center justify-center' key={user.id}>
                        <div className='m-1 w-full flex justify-between items-center'>
                            <div className='font-bold flex justify-between items-center gap-3'>
                                <Avatar bordered color={"primary"} pointer zoomed src={info.room.users.find(o => o.nickName === user.nickName).photo}/>
                                <div>{user.nickName === info.userData.nickname ? 'you' : user.nickName}</div>
                            </div>
                            <div className='flex items-center gap-2'>
                                {(isAdmin(info.room.users.find(o => o.nickName === info.userData.nickname)) && user.nickName != info.userData.nickname) &&
                                    <>
                                        { isAdmin(info.room.users.find(o => o.nickName === user.nickName)) ? 
                                            <TbUserDown className='hover:text-whiteSmoke text-blueStrong' title='demote' aria-label='demote' cursor="pointer" size={20} onClick={demoteteUser}/>
                                            :   <TbUserUp className='hover:text-whiteSmoke text-blueStrong' title='promote' strokeWidth={2.3} aria-label='promote' cursor="pointer" size={25} onClick={() => {promoteUser(user.id)}}/>
                                        }
                                        <BiUserMinus className='hover:text-whiteSmoke text-blueStrong' title='kick' strokeWidth={0} aria-label='kick' cursor="pointer" size={30} onClick={kickUser}/>
                                        <BiUserX className='hover:text-whiteSmoke text-blueStrong' title='ban' aria-label='ban' cursor="pointer" size={30} onClick={banUser}/>
                                        <BiVolumeMute className='hover:text-whiteSmoke text-blueStrong' title='mute' aria-label='mute' cursor="pointer" size={25} onClick={muteUser}/>
                                    </>}
                                { user.nickName != info.userData.nickname &&
                                <BiConversation className='hover:text-whiteSmoke text-blueStrong' title='DM' aria-label='DM' cursor="pointer" size={25}/>}
                            </div>
                        </div>
                    </div>
                ) )}
        </div>
        <div className='w-full flex items-center justify-center'>
            <button type="button" className="w-auto text-white bg-red-900 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Leave</button>
        </div>
    </Popup>
  )
}

export default RoomInfo