import React, { useEffect } from 'react'
import { Socket } from 'socket.io-client'
import { Room } from '../page'

interface SocketComponentProps {
  rooms: Room[],
  socket: Socket
  setRooms: any
  setInfoUpdate: any
}

const promoteUser = (res, setRooms, setInfoUpdate) => {
  setRooms((_rooms: Room[]) => {
    _rooms.find(o => o.name === res.roomId.room_name).users.find(o => o.id === res.newAdmin.userId).type = 'ADMIN'
    return _rooms
  })
  setInfoUpdate(old => !old)
}

const demoteUser = (res, setRooms, setInfoUpdate) => {
  console.log(res)
  setRooms((_rooms: Room[]) => {
    _rooms.find(o => o.name === res.roomId.room_name).users.find(o => o.id === res.domotedAdmin.userId).type = 'USER'
    return _rooms
  })
  setInfoUpdate(old => !old)
}

const kickUser = (res, setRooms, setInfoUpdate) => {
  console.log(res)
  setRooms((_rooms: Room[]) => {
    var userToBeKicked = _rooms.find(o => o.name === res.roomId.room_name).users.find(o => o.id === res.kickedUser.userId)
    console.log(userToBeKicked)
    var currentRoomUsers = _rooms.find(o => o.name === res.roomId.room_name).users
    currentRoomUsers.splice(currentRoomUsers.indexOf(userToBeKicked), 1)
    return _rooms
  })
  setInfoUpdate(old => !old)
}

const SocketComponent:React.FC<SocketComponentProps> = (props) => {

  const socket = props.socket
  const rooms = props.rooms
  const setRooms = props.setRooms
  const setInfoUpdate = props.setInfoUpdate
  

  useEffect (() => {
    socket.on('onPromote', (res) => {promoteUser(res, setRooms, setInfoUpdate)})
    socket.on('onDemote', (res) => {demoteUser(res, setRooms, setInfoUpdate)})
    socket.on('onKick', (res) => {kickUser(res, setRooms, setInfoUpdate)})
  }, []) 

  return (
    <div className='absolute w-0 h-0'></div>
  )
}

export default SocketComponent