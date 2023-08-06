import React from 'react'
import { gimmeRandom } from '../page'
import Popup from './Popup'
import { ImVolumeMute2 } from "react-icons/Im";
import { UniversalData } from '../../layout';
import { Avatar } from '@nextui-org/react';

interface RoomInfoProps {
    room:any
    setShow: any
    show: boolean
    userData: UniversalData
}

// const isAdmin = () => {
//     return 
// }

const RoomInfo: React.FC<RoomInfoProps> = (info) => {

    const hide = () => {
        info.setShow(false)
    }

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
                            <div className='font-bold'>{user.nickName}</div>
                            <div className='w-[40%] flex justify-between'>
                                <img className='cursor-pointer' alt='ban' title='ban' src='/images/ban-user-icon.svg' width={25} height={25}></img>
                                <img className='cursor-pointer' alt='kick' title='kick' src='/images/kick-user-icon.svg' width={30} height={30}></img>
                                <ImVolumeMute2 className='cursor-pointer' size={30}/>
                                {/* <img className='cursor-pointer' alt='mute' title='mute' src='/images/mute-user-icon.svg' width={30} height={30}></img> */}
                                <img className='cursor-pointer' alt='promote' title='promote' src='/images/promote-user-icon.svg' width={30} height={30}></img>
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