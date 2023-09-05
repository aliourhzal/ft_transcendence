import React, { useContext, useState } from 'react'
import Popup from './Popup'

import { AiOutlineUsergroupAdd } from "react-icons/Ai";
import { FiEdit3 } from "react-icons/Fi";

import { UniversalData } from '../../../contexts/UniversalData';
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
    allUsers: any[]
    setAlertText: any,
    setShowAlert: any
}


const RoomInfo: React.FC<RoomInfoProps> = (info) => {
    
    const {setConvs, socket, setRooms, _notification, userData} = useContext(Context)

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

    const unvalidUsers = (users) => {
        var _unvalidUsers: string[] = []
        users.map(user => {
            if (!info.allUsers.find(o => o.nickname === user) || user === userData.nickname)
                _unvalidUsers.push(user)
        })
        return _unvalidUsers
    }

    const   addUsersToRoom = async (e, newUsers) => {
        e.preventDefault()
        const _unvalidUsers = unvalidUsers(newUsers)
        if (_unvalidUsers.length) {
            info.setAlertText('unvalid users : ' + _unvalidUsers)
            info.setShowAlert(true)
        }
        else if (newUsers.length) {
            socket.emit('add-room-users', {roomName: info.room.name, users: newUsers})
            setShowUsersForm(false)
        }
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
    }

    const changeRoomType = async (newType:string) => {
        console.log(newType)
        newType === 'public' ? socket.emit('delete-room-password', {roomName:info.room.name}) :
        socket.emit('make-room-protected', {roomId:info.room.id, newPassword: newType})
        setshowRoomEditForm(false)
    }

    const [showUsersForm, setShowUsersForm] = useState(false)
    const [showRoomEditForm, setshowRoomEditForm] = useState(false)

  return (
    <>
    <SocketComponent setRooms={setRooms} setInfoUpdate={setInfoUpdate} setConvs={setConvs} _notification={_notification}/>
    {(info.room && info.show) &&
        <Popup isOpen={info.show} modalAppearance={hide}>
            <div className='flex items-center justify-center gap-4 -mt-8'>
                <h1 className='transition-all bg-blueStrong py-1 px-3 absolute top-0 hover:scale-105 cursor-none font-extrabold text-sm rounded-t-lg rounded-b-full'>{info.room.name.substring(0, 10)}</h1>
                {isAdmin(info.room.users.find(o => o.nickName === info.userData.nickname)) &&
                    <div className='transition-all flex items-center p-3 bg-slate-500 rounded-full hover:scale-110 hover:text-whiteSmoke cursor-pointer'>
                        <AiOutlineUsergroupAdd size={19} color={showUsersForm ? 'rgb(41 120 242)' : ''} cursor={'pointer'} className='hover:text-whiteSmoke' onClick={ () => {
                            setShowUsersForm(old => !old)
                            showRoomEditForm ? setshowRoomEditForm(false) : ''
                        }}/>
                    </div>
                }
                <Avatar pointer src={info.room.photo} size={"xl"} zoomed text={info.room.name} bordered color={"gradient"} alt={info.room.name} className="w-auto h-auto"></Avatar>
                {isAdmin(info.room.users.find(o => o.nickName === info.userData.nickname)) &&
                    <div className='transition-all flex items-center p-3 bg-slate-500 rounded-full hover:scale-110 hover:text-whiteSmoke cursor-pointer' onClick={ () => {
                        setshowRoomEditForm(old => !old)
                        showUsersForm ? setShowUsersForm(false) : ''
                    }}>
                        <FiEdit3 size={19} color={showRoomEditForm ? 'rgb(41 120 242)' : ''} cursor={'pointer'} className='hover:text-whiteSmoke'/>
                    </div>
                }
            </div>
            {showUsersForm && <NewRoomUsers addUsers={addUsersToRoom} />}
            {showRoomEditForm && <EditRoom _setNewName={setNewName} _setNewPass={setNewPass} roomType={info.room.type} changeRoomType={changeRoomType}/>}
            <div className='my-4 h-65 flex flex-col justify-start items-center overflow-y-scroll overflow-x-hidden'>
                {info.room.users.map(user => (
                    <RoomMumbers info={info} user={user} isOwner={isOwner} isAdmin={isAdmin} key={gimmeRandom()} hide={hide} allUsers={info.allUsers} />
                ))}
            </div>
            <div className='w-full flex items-center justify-center'>
                <button type="button" className="w-auto text-white bg-blueStrong hover:bg-red-300 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300" onClick={
                    () => { socket.emit('leave-room', { roomName: info.room.name}); hide() }
                }>Leave</button>
            </div>
        </Popup>
    }
    </>
  )
}

export default RoomInfo