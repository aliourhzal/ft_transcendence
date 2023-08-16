import React, { useEffect } from 'react'
import { Socket } from 'socket.io-client'
import { Room } from '../page'

interface SocketComponentProps {
  rooms: Room[],
  socket: Socket
  setRooms: any
  setInfoUpdate: any
  setConvs?: any
  _notification: any
}

const SocketComponent:React.FC<SocketComponentProps> = ( { socket, rooms, setRooms, setInfoUpdate, _notification, setConvs } ) => {
  
  const promoteUser = (res) => {
    _notification()
    setRooms((_rooms: Room[]) => {
      _rooms.find(o => o.name === res.roomId.room_name).users.find(o => o.id === res.newAdmin.userId).type = 'ADMIN'
      return _rooms
    })
    setInfoUpdate(old => !old)
  }
  
  const demoteUser = (res) => {
    console.log(res)
    setRooms((_rooms: Room[]) => {
      _rooms.find(o => o.name === res.roomId.room_name).users.find(o => o.id === res.domotedAdmin.userId).type = 'USER'
      return _rooms
    })
    setInfoUpdate(old => !old)
  }
  
  const kickUser = (res) => {
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

  const changeRoomName = (res) => {
    console.log(res.newRoomName, res.oldRoomName)
    setRooms( (_rooms: Room[]) => {
      _rooms.find(o => o.name === res.oldRoomName).name = res.newRoomName
      setConvs((_convs) => {
        console.log(_convs)
        _convs.find(o => o.name === res.newRoomName).name = res.newRoomName
        return _convs
      })
      return _rooms
    })
    setInfoUpdate(old => !old)
  }

  useEffect (() => {
    socket.on('onPromote', (res) => {console.log('promote'), promoteUser(res)})
    socket.on('onDemote', (res) => {console.log('demote'), demoteUser(res)})
    socket.on('onKick', (res) => {console.log('kick'), kickUser(res)})
    socket.on('change-room-name', (res) => {console.log('change name'), changeRoomName(res)})
}, []) 

  return (
    <div className='absolute w-0 h-0'></div>
  )
}

export default SocketComponent