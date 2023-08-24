import React, { useContext, useState } from 'react'
import Popup from './Popup'

import { AiOutlineUsergroupAdd } from "react-icons/Ai";
import { FiEdit3 } from "react-icons/Fi";

import { UniversalData, getCookie } from '../../layout';
import { Avatar } from '@nextui-org/react';
import NewRoomUsers from './NewRoomUsers';
import { Context, gimmeRandom } from '../page';
import SocketComponent from './SocketComponent';
import EditRoom from './EditRoom';
import RoomMumbers from './RoomMumbers';

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
        setshowRoomEditForm(false)
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
        if (pass != '') {
            console.log(pass)
            socket.emit('edit-room-password', { roomName:info.room.name, newPassword: pass })
        }
        else
            socket.emit('set-room-public', { roomName:info.room.name, newPassword: pass })
        
    }

    const changeRoomType = async (newType:string) => {
        console.log(newType)
        newType === 'public' ? socket.emit('make-public', {roomName:info.room.name}) :
        socket.emit('make-protected', {roomName:info.room.name, newPassword: newType})
    }

    const [showUsersForm, setShowUsersForm] = useState(false)
    const [showRoomEditForm, setshowRoomEditForm] = useState(false)

  return (
    <>
    <SocketComponent rooms={rooms} socket={socket} setRooms={setRooms} setInfoUpdate={setInfoUpdate} setConvs={setConvs} _notification={_notification}/>
    {(info.room && info.show) &&
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
            {showRoomEditForm && <EditRoom _setNewName={setNewName} _setNewPass={setNewPass} roomType={info.room.type} changeRoomType={changeRoomType}/>}
            <div className='h-65 flex flex-col justify-start items-center overflow-y-scroll overflow-x-hidden'>
                {info.room.users.map(user => (
                    <RoomMumbers info={info} user={user} isOwner={isOwner} isAdmin={isAdmin} key={gimmeRandom()}/>
                ))}
            </div>
            <div className='w-full flex items-center justify-center'>
                <button type="button" className="w-auto text-white bg-blueStrong hover:bg-red-300 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={
                    () => { socket.emit('leave-room', { roomName: info.room.name}); hide() }
                }>Leave</button>
            </div>
        </Popup>
    }
    </>
  )
}

export default RoomInfo