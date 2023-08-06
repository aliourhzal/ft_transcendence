import React, { useState } from 'react'
import { gimmeRandom } from '../page'
import Popup from './Popup'

import { BiVolumeMute } from "react-icons/Bi";
import { BiUserMinus } from "react-icons/Bi";
import { BiUserX } from "react-icons/Bi";
import { TbUserUp } from "react-icons/Tb";
import { TbUserDown } from "react-icons/Tb";
import { BiMessageRoundedDetail } from "react-icons/Bi";

import { UniversalData } from '../../layout';
import { Avatar, useSSR } from '@nextui-org/react';

interface RoomInfoProps {
    room:any
    setShow: any
    show: boolean
    userData: UniversalData
}


const RoomInfo: React.FC<RoomInfoProps> = (info) => {
    
    const hide = () => {
        info.setShow(false)
    }
    
    const isAdmin = (user) => {
        if (user.type === 'OWNER' || user.type === 'ADMIN')
            return true
        return false
    }

    const promoteUser = () => {

    }
    const demoteteUser = () => {

    }
    const kickUser = () => {

    }
    const banUser = () => {
        
    }
    const muteUser = () => {

    }

    console.log(info.room.users.find(o => o.nickName === info.userData.nickname).type)

    // const [cursor, setCursor] = useState(isAdmin(info.room.users.find(o => o.nickName === info.userData.nickname)) ? 'pointer' : 'not-allowed')

  return (
    <Popup isOpen={info.show} modalAppearance={hide}>
        <div className='flex justify-center m-4'>
            <Avatar zoomed text={info.room.name} bordered color={"gradient"} alt={info.room.name} className="w-auto h-auto"></Avatar>
            {/* <div className='m-4 text-center w-full text-xl font-bold'>{info.name}</div> */}
        </div>
        <div className='flex flex-col justify-center items-center overflow-y-scroll'>
            {info.room.users.map(user => (
                    <div className='m-2 border-2 p-2 rounded-lg bg-slate-600 border-slate-500 w-full flex flex-col items-center justify-center' key={user.id}>
                        <div className='m-1 w-full flex justify-between items-center'>

                            <div className='font-bold flex justify-between items-center'>
                                <Avatar src={info.room.users.find(o => o.nickName === user.nickName).photo}/>
                                <div className='ml-3'>{user.nickName === info.userData.nickname ? 'you' : user.nickName}</div>
                            </div>
                            <div className='w-[40%] flex justify-between'>
                                {(isAdmin(info.room.users.find(o => o.nickName === info.userData.nickname)) && user.nickName != info.userData.nickname) &&
                                    <>
                                        { isAdmin(info.room.users.find(o => o.nickName === user.nickName)) ? 
                                            <TbUserDown title='demote' aria-label='demote' cursor="pointer" size={25} onClick={demoteteUser}/>
                                            :   <TbUserUp title='promote' aria-label='promote' cursor="pointer" size={25} onClick={promoteUser}/>
                                        }
                                        <BiUserMinus title='kick' aria-label='kick' cursor="pointer" size={25} onClick={kickUser}/>
                                        <BiUserX title='ban' aria-label='ban' cursor="pointer" size={25} onClick={banUser}/>
                                        <BiVolumeMute title='mute' aria-label='mute' cursor="pointer" size={25} onClick={muteUser}/>
                                    </>}
                                { user.nickName != info.userData.nickname &&
                                <BiMessageRoundedDetail title='DM' aria-label='DM' cursor="pointer" size={25}/>}
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