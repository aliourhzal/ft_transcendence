import React, { useContext, useEffect } from 'react'
import { Socket } from 'socket.io-client'
import { Context, Room } from '../page'

interface SocketComponentProps {
  rooms: Room[],
  socket: Socket
  setRooms: any
  setInfoUpdate: any
  setConvs?: any
  _notification: any
}

const SocketComponent:React.FC<SocketComponentProps> = ( { socket, rooms, setRooms, setInfoUpdate, _notification, setConvs } ) => {
  
  const { userData, setShowConv } = useContext(Context)

  const promoteUser = (res) => {
    _notification()
    setRooms((_rooms: Room[]) => {
      _rooms.find(o => o.name === res.roomId.room_name).users.find(o => o.id === res.newAdmin.userId).type = 'ADMIN'
      return _rooms
    })
    if (res.newAdmin.userId === userData.id)
      _notification(`You have been promoted at ${res.roomId.room_name}`, "good")
    else
      _notification("User promoted successfully", "good")
    setInfoUpdate(old => !old)
  }
  
  const demoteUser = (res) => {
    console.log(res)
    setRooms((_rooms: Room[]) => {
      _rooms.find(o => o.name === res.roomId.room_name).users.find(o => o.id === res.domotedAdmin.userId).type = 'USER'
      return _rooms
    })
    if (res.domotedAdmin.userId === userData.id)
      _notification(`You have been demoted at ${res.roomId.room_name}`, "bad")
    else
      _notification("User demoted successfully", "good")
    setInfoUpdate(old => !old)
  }
  
  const kickUser = (res) => {
    console.log(res)
    setRooms((_rooms: Room[]) => {
      var current_room = _rooms.find(o => o.name === res.roomId.room_name)
      var userToBeKicked = current_room.users.find(o => o.id === res.kickedUser.userId)
      var currentRoomUsers = _rooms.find(o => o.name === res.roomId.room_name).users
      currentRoomUsers.splice(currentRoomUsers.indexOf(userToBeKicked), 1)
      if (res.kickedUser.userId === userData.id) {
        _rooms.splice(_rooms.indexOf(current_room), 1)
        _notification(`You have been kicked from ${res.roomId.room_name}`, "bad")
        setShowConv(false)
      }
      else
        _notification("User kicked successfully", "good")
      setConvs((_convs) => {
        _convs = [...rooms]
        return _convs
      })
      return _rooms
    })
    setInfoUpdate(old => !old)
  }
  const changeRoomName = (res) => {
    console.log(res.newRoomName, res.oldRoomName)
    setRooms( (_rooms: Room[]) => {
      _rooms.find(o => o.name === res.oldRoomName).name = res.newRoomName
      setConvs((_convs) => {
        _convs = [...rooms]
        return _convs
      })
      return _rooms
    })
    setInfoUpdate(old => !old)
    // if (_user === userData.nickname)
      _notification("Name of room changed successfully", "good")
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