import React, { useEffect } from 'react'
import { Socket } from 'socket.io-client'
import { Room } from '../page'

interface SocketComponentProps {
  rooms: Room[],
  socket: Socket
  setRooms: any
  setInfoUpdate: any
}

const SocketComponent:React.FC<SocketComponentProps> = (props) => {

  const socket = props.socket
  const rooms = props.rooms
  const setRooms = props.setRooms
  const setInfoUpdate = props.setInfoUpdate
  
  const promoteUser = res => {
    setRooms((_rooms: Room[]) => {
      _rooms.find(o => o.name === res.roomId.room_name).users.find(o => o.id === res.newAdmin.userId).type = 'ADMIN'
      return _rooms
    })
    setInfoUpdate(old => !old)
  }

  const demoteUser = res => {
    console.log(res)
    setRooms((_rooms: Room[]) => {
      _rooms.find(o => o.name === res.roomId.room_name).users.find(o => o.id === res.domotedAdmin.userId).type = 'USER'
      return _rooms
    })
    setInfoUpdate(old => !old)
  }

  const kickUser = res => {
    console.log(res)
    setRooms((_rooms: Room[]) => {
      var userToBeKicked = _rooms.find(o => o.name === res.roomId.room_name).users.find(o => o.id === res.domotedAdmin.userId)
      console.log(userToBeKicked)
      // _rooms.users.splice(_rooms.indexOf(user), 1)
      //         users.setUsers(temp)
      return _rooms
    })
    setInfoUpdate(old => !old)
  }

  useEffect (() => {
    socket.on('onPromote', promoteUser)
    socket.on('onDemote', demoteUser)
    socket.on('onKick', kickUser)
  }, []) 

  return (
    <div className='absolute w-0 h-0'></div>
  )
}

export default SocketComponent