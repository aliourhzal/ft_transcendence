import React, { useContext, useState } from 'react'
import Popup from './Popup'

import { BiVolumeMute } from "react-icons/Bi";
import { BiUserMinus } from "react-icons/Bi";
import { BiUserX } from "react-icons/Bi";
import { TbUserUp } from "react-icons/Tb";
import { TbUserDown } from "react-icons/Tb";
import { BiConversation } from "react-icons/Bi";
import { AiOutlineUsergroupAdd } from "react-icons/Ai";
import { FiEdit3 } from "react-icons/Fi";
import { IoIosArrowDown } from "react-icons/io";
import { RiVipCrown2Fill } from "react-icons/Ri";
import { SlArrowDown, SlArrowUp } from "react-icons/Sl";

import { UniversalData, getCookie } from '../../layout';
import { Avatar } from '@nextui-org/react';
import NewRoomUsers from './NewRoomUsers';
import { Context } from '../page';
import SocketComponent from './SocketComponent';
import EditRoom from './EditRoom';
import axios from 'axios';
import { FaBold } from 'react-icons/fa';
import RoomOptions from './RoomOptions';

interface RoomInfoProps {
    room:any
    setShow: any
    show: boolean
    userData: UniversalData
}


const RoomInfo: React.FC<RoomInfoProps> = (info) => {
    
    const {setConvs, socket, rooms, setRooms, set_room_created, _notification} = useContext(Context)

    const [infoUpdate, setInfoUpdate] = useState(false)

    const hide = () => {
        info.setShow(false)
        setShowUsersForm(false)
    }
    
    const isAdmin = (user) => {
        if (user)
            if (user.type === 'OWNER' || user.type === 'ADMIN')
                return true
        return false
    }

    const isOwner = (user) => {
        if (user.type === 'OWNER')
            return true
        return false
    }



    const   addUsersToRoom = async (e, newUsers) => {
        e.preventDefault()
        setShowUsersForm(false)
        if (newUsers.length)
            socket.emit('add-room-users', {roomName: info.room.name, users: newUsers})
    }

    const   setNewName = async (e, name) => {
        e.preventDefault()
        setshowRoomEditForm(false)
        if (name) {
            console.log(name)
            socket.emit('edit-room-name', { roomName:info.room.name, newName: name })
        }
    }

    const   setNewPass = async (e, pass) => {
        e.preventDefault()
        setshowRoomEditForm(false)
        if (pass) {
            console.log(pass)
            socket.emit('edit-room-password', { roomName:info.room.name, newPassword: pass })
        }
    }

    
    const [showUsersForm, setShowUsersForm] = useState(false)
    const [showRoomEditForm, setshowRoomEditForm] = useState(false)

    const [showOptions, setShowOptions] = useState(false)

  return (
    <>
    <SocketComponent rooms={rooms} socket={socket} setRooms={setRooms} setInfoUpdate={setInfoUpdate} setConvs={setConvs} _notification={_notification}/>
    {info.room &&
        <Popup isOpen={info.show} modalAppearance={hide}>
            <div className='flex items-end justify-center m-4'>
                {isAdmin(info.room.users.find(o => o.nickName === info.userData.nickname)) &&
                    <AiOutlineUsergroupAdd color={showUsersForm ? 'rgb(41 120 242)' : ''} cursor={'pointer'} className='hover:text-whiteSmoke' onClick={ () => {
                        setShowUsersForm(old => !old)
                        showRoomEditForm ? setshowRoomEditForm(false) : ''
                    }}/>
                }
                <Avatar zoomed text={info.room.name} bordered color={"primary"} alt={info.room.name} className="w-auto h-auto"></Avatar>
                {isAdmin(info.room.users.find(o => o.nickName === info.userData.nickname)) &&
                    <FiEdit3  color={showRoomEditForm ? 'rgb(41 120 242)' : ''} cursor={'pointer'} className='hover:text-whiteSmoke' onClick={ () => {
                        setshowRoomEditForm(old => !old)
                        showUsersForm ? setShowUsersForm(false) : ''
                    }}/>
                }
            </div>
            {showUsersForm && <NewRoomUsers addUsers={addUsersToRoom} />}
            {showRoomEditForm && <EditRoom _setNewName={setNewName} _setNewPass={setNewPass} roomType={info.room.type} />}
            <div className='flex flex-col justify-center items-center overflow-y-scroll'>
                {info.room.users.map(user => (
                        <div className='m-2 border-2 p-2 rounded-lg bg-slate-600 border-slate-500 w-full flex flex-col items-center justify-center' key={user.id}>
                            <div className='m-1 w-full flex justify-between items-center px-4 cursor-pointer' onClick={ () => {setShowOptions(old => !old)} }>
                                <div className='font-bold flex justify-between items-center gap-3'>
                                    <Avatar bordered color={"primary"} pointer zoomed src={info.room.users.find(o => o.nickName === user.nickName).photo}/>
                                    <div>{user.nickName === info.userData.nickname ? 'you' : user.nickName}</div>
                                </div>
                                <div className='w-10 font-extrabold flex items-center justify-center'>
                                    {!showOptions && <SlArrowDown size={20} fontWeight={'bold'} className='font-extrabold'/>}
                                    {showOptions && <SlArrowUp className='font-extrabold'/>}
                                </div>
                            </div>
                            {showOptions && <RoomOptions info={info} user={user} isAdmin={isAdmin} isOwner={isOwner}/>}
                        </div>
                    ) )}
            </div>
            <div className='w-full flex items-center justify-center'>
                <button type="button" className="w-auto text-white bg-blueStrong hover:bg-red-300 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={
                    () => { socket.emit('leave-room', { roomId: info.room.id, userId: info.userData.nickname}) }
                }>Leave</button>
            </div>
        </Popup>
    }
    </>
  )
}

export default RoomInfo