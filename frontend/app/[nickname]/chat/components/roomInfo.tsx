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

import { UniversalData, getCookie } from '../../layout';
import { Avatar } from '@nextui-org/react';
import NewRoomUsers from './NewRoomUsers';
import { Context } from '../page';
import SocketComponent from './SocketComponent';
import EditRoom from './EditRoom';
import axios from 'axios';

interface RoomInfoProps {
    room:any
    setShow: any
    show: boolean
    userData: UniversalData
}


const RoomInfo: React.FC<RoomInfoProps> = (info) => {
    
    const {setConvs, socket, rooms, setRooms, set_room_created} = useContext(Context)

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

    const promoteUser = async (id) => {
        try {
            await axios.post('http://127.0.0.1:3000/rooms/user-promotion', {roomName:info.room.name, newAdminId:id}, {
               withCredentials: true,
               headers: {
                   'Authorization': `Bearer ${getCookie('access_token')}`,
                       'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
           }).then((res) => {

               console.log(res)
           })
           
       } catch (error) 
       {
           console.log(error)
           // alert(error)
       }
        //  socket.emit('user-promotion', {roomName:info.room.name, newAdminId:id})
    }

    const demoteteUser = async (id) => {
        try {
            await axios.post('http://127.0.0.1:3000/rooms/user-demote', {roomName:info.room.name, dmotedUserId:id}, {
               withCredentials: true,
               headers: {
                   'Authorization': `Bearer ${getCookie('access_token')}`,
                       'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
           }).then((res) => {

               console.log(res)
           })
           
       } catch (error) 
       {
           console.log(error)
           // alert(error)
       }
        // socket.emit('user-demote', {roomName:info.room.name, dmotedUserId:id})
    }

    const kickUser = async (id) => {
        try {
            await axios.post('http://127.0.0.1:3000/rooms/kick-user', {roomName:info.room.name, kickedUserId:id}, {
               withCredentials: true,
               headers: {
                   'Authorization': `Bearer ${getCookie('access_token')}`,
                       'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
           }).then((res) => {

               console.log(res)
           })
           
       } catch (error) 
       {
           console.log(error)
           // alert(error)
       }
        // socket.emit('kick-user', {roomName:info.room.name, kickedUserId:id})
    }

    const banUser = (id) => {
        
    }

    const muteUser = (id) => {

    }

    const   addUsersToRoom = async (e, newUsers) => {
        e.preventDefault()
        setShowUsersForm(false)
        if (newUsers.length) {
            try {
                await axios.post('http://127.0.0.1:3000/rooms/add-room-users', {roomName: info.room.name, users: newUsers}, {
                   withCredentials: true,
                   headers: {
                       'Authorization': `Bearer ${getCookie('access_token')}`,
                           'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
               }).then((res) => {
    
                   console.log(res)
               })
               
           } catch (error) 
           {
               console.log(error)
               // alert(error)
           }
            // socket.emit('add-room-users', {roomName: info.room.name, users: newUsers})
        }
    }
    const   editRoom = async (e, name, pass) => {
        e.preventDefault()
        setshowRoomEditForm(false)
        if (name || pass) {
            console.log(name, pass)
            try {
                await axios.post('http://127.0.0.1:3000/rooms/edit-room', { newName: name, newPassword: pass }, {
                   withCredentials: true,
                   headers: {
                       'Authorization': `Bearer ${getCookie('access_token')}`,
                           'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
               }).then((res) => {
    
                   console.log(res)
               })
               
           } catch (error) 
           {
               console.log(error)
               // alert(error)
           }
            // socket.emit('edit-room', { newName: name, newPassword: pass })
        }
    }

    
    const [showUsersForm, setShowUsersForm] = useState(false)
    const [showRoomEditForm, setshowRoomEditForm] = useState(false)

  return (
    <>
    <SocketComponent rooms={rooms} socket={socket} setRooms={setRooms} setInfoUpdate={setInfoUpdate} setConvs={setConvs}/>
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
        {showRoomEditForm && <EditRoom editRoom={editRoom} />}
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
                                    !isOwner(info.room.users.find(o => o.nickName === user.nickName)) &&
                                    <>
                                        { isAdmin(info.room.users.find(o => o.nickName === user.nickName)) ? isOwner(info.room.users.find(o => o.nickName === info.userData.nickname)) &&
                                            <TbUserDown className='hover:text-whiteSmoke text-blueStrong' title='demote' aria-label='demote' cursor="pointer" size={20} onClick={() => {demoteteUser(user.id)}}/>
                                            :
                                            isOwner(info.room.users.find(o => o.nickName === info.userData.nickname)) && <TbUserUp className='hover:text-whiteSmoke text-blueStrong' title='promote' strokeWidth={2.3} aria-label='promote' cursor="pointer" size={25} onClick={() => {promoteUser(user.id)}}/>
                                        }
                                        <BiUserMinus className='hover:text-whiteSmoke text-blueStrong' title='kick' strokeWidth={0} aria-label='kick' cursor="pointer" size={30} onClick={() => {kickUser(user.id)}}/>
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
    </>
  )
}

export default RoomInfo