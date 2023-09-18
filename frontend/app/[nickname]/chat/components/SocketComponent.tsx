import React, { useContext, useEffect } from 'react'
import { Socket } from 'socket.io-client'
import { Room } from '../page'
import Context from './Context'

interface SocketComponentProps {
  setRooms: any
  setInfoUpdate: any
  setConvs?: any
  _notification: any
  activeUserConv: any
  setActiveUserConv: any
}

const SocketComponent:React.FC<SocketComponentProps> = ( { setRooms, setInfoUpdate, _notification, setConvs, activeUserConv, setActiveUserConv } ) => {
  
  const { userData, setShowConv, internalError, socket, rooms, setChatBoxMessages } = useContext(Context)

  const promoteUser = (res) => {
    var _promotedUser = rooms.find(o => o.name === res.roomId.room_name)?.users.find(o => o.id === res.newAdmin.userId)
    if (_promotedUser) {
      setRooms((_rooms: Room[]) => {
        _promotedUser.type = 'ADMIN'
        return _rooms
      })
      if (res.newAdmin.userId === userData.id)
        _notification(`You are now admin at '${res.roomId.room_name}'`, "good")
      else
        _notification(`"${_promotedUser.nickName}" promoted at '${res.roomId.room_name}'`, "good")
      setActiveUserConv(_conv => {
          if (_conv?.name === res.roomId.room_name)
          setChatBoxMessages(old => [...old, {userId: 'bot', msg : `"${_promotedUser.nickName}" is now admin`}])
        return _conv}
      )
    }
    else internalError('Internal error when trying to promote')
    setInfoUpdate(old => !old)
  }
  
  const demoteUser = (res) => {
    var _demotedUser = rooms.find(o => o.name === res.roomId.room_name)?.users.find(o => o.id === res.domotedAdmin.userId)
    if (_demotedUser) {
      setRooms((_rooms: Room[]) => {
        _demotedUser.type = 'USER'
        return _rooms
      })
      if (res.domotedAdmin.userId === userData.id)
        _notification(`You have been demoted at '${res.roomId.room_name}'`, "bad")
      else
        _notification(`"${_demotedUser.nickName}" demoted at '${res.roomId.room_name}'`, "good")
      setActiveUserConv(_conv => {
          if (_conv?.name === res.roomId.room_name)
          setChatBoxMessages(old => [...old, {userId: 'bot', msg : `"${_demotedUser.nickName}" is demoted`}])
        return _conv}
      )
    }
    else internalError('Internal error when trying to demote')
    setInfoUpdate(old => !old)
  }
  
  const kickUser = (res) => {
    setRooms((_rooms: Room[]) => {
      var userToBeKicked = _rooms.find(o => o.name === res.roomId.room_name)?.users?.find(o => o.id === res.kickedUser.userId)
      if (userToBeKicked) {
        if (res.kickedUser.userId != userData.id)
          _notification(`"${userToBeKicked.nickName}" has been kicked from '${res.roomId.room_name}'`, "good")
        var currentRoomUsers = _rooms.find(o => o.name === res.roomId.room_name)?.users
        if (currentRoomUsers)
          currentRoomUsers.splice(currentRoomUsers.indexOf(userToBeKicked), 1)
        if (res.kickedUser.userId === userData.id) {
          _notification(`You have been kicked from '${res.roomId.room_name}'`, "bad")
          _rooms.splice(_rooms.indexOf(_rooms.find(o => o.name === res.roomId.room_name)), 1)
          setShowConv(false)
        }
        setConvs([..._rooms])
        setActiveUserConv(_conv => {
          if (_conv?.name === res.roomId.room_name)
          setChatBoxMessages(old => [...old, {userId: 'bot', msg : `"${userToBeKicked.nickName}" is kicked`}])
          return _conv}
        )
      }
      else internalError('Internal error when trying to kick')
      return _rooms
    })
    setInfoUpdate(old => !old)
  }

  const banUser = (res) => {
    setRooms((_rooms: Room[]) => {
      var userToBeKicked = _rooms.find(o => o.name === res.roomId.room_name)?.users?.find(o => o.id === res.bannedUser.userId)
      if (userToBeKicked) {
        if (res.bannedUser.userId != userData.id)
          _notification(`"${userToBeKicked.nickName}" has been banned from '${res.roomId.room_name}'`, "good")
        var currentRoomUsers = _rooms.find(o => o.name === res.roomId.room_name)?.users
        currentRoomUsers.splice(currentRoomUsers.indexOf(userToBeKicked), 1)
        if (res.bannedUser.userId === userData.id) {
          _notification(`You have been banned from '${res.roomId.room_name}'`, "bad")
          _rooms.splice(_rooms.indexOf(_rooms.find(o => o.name === res.roomId.room_name)), 1)
          setShowConv(false)
        }
        setConvs([..._rooms])
        setActiveUserConv(_conv => {
          if (_conv?.name === res.roomId.room_name)
            setChatBoxMessages(old => [...old, {userId: 'bot', msg : `"${userToBeKicked.nickName}" is banned`}])
          return _conv}
        )
      }
      else internalError('Internal error when trying to ban')
      return _rooms
    })
    setInfoUpdate(old => !old)
  }

  const leaveUser = (res) => {
    const userToRemoveId = res.leavedUser?.kickedUser?.userId
    const newOwnerId = res.newOwner
    if (userToRemoveId) {
      setRooms((_rooms:Room[]) => {
        if (userData.id === rooms.find(o => o.id === res.roomId.id)?.users?.find(o => o.id === userToRemoveId)?.id) {
          if (newOwnerId)
            _rooms.find(o => o.id === res.roomId.id).users.find(o => o.id === newOwnerId.userId).type = 'OWNER'
          _rooms.splice(_rooms.indexOf(rooms.find(o => o.id === res.roomId.id)), 1)
          setShowConv(false)
        }
        else {
          var _users = _rooms.find(o => o.id === res.roomId.id).users
          _users.splice(_users.indexOf(_users.find(o => o.id === userToRemoveId)), 1)
          if (newOwnerId)
            _users.find(o => o.id === newOwnerId.userId).type = 'OWNER'
        }
        setConvs([..._rooms])
        setActiveUserConv(_conv => {
          if (_conv?.name === res.roomId.room_name)
            setChatBoxMessages(old => [...old, {userId: 'bot', msg : `"${rooms.find(o => o.id === res.roomId.id)?.users?.find(o => o.id === userToRemoveId)?.nickName}" left`}])
          if (newOwnerId)
            setChatBoxMessages(old => [...old, {userId: 'bot', msg : `"${_rooms.find(o => o.id === res.roomId.id).users.find(o => o.id === newOwnerId.userId).nickName}" is now the owner`}])
          return _conv}
        )
        return _rooms
      })
    }
    else internalError('Internal error when trying to leave room')
    setInfoUpdate(old => !old)
  }

  const changeRoomName = (res) => {
    setRooms( (_rooms: Room[]) => {
      if (_rooms.find(o => o.name === res.oldRoomName)?.name)
        _rooms.find(o => o.name === res.oldRoomName).name = res.newRoomName
      else internalError('Internal error when trying to change room name')
      setConvs([..._rooms])
      return _rooms
    })
    setInfoUpdate(old => !old)
    if (res.oldRoomName && res.newRoomName)
      _notification(`Name of room changed from '${res.oldRoomName}' to '${res.newRoomName}'`, "good")
  }

  const changeRoomPass = (res) => {
    if (res.password === 'exist')
      _notification(`'${res.roomName}' password changed !`, "good")
    else if (res.password === 'new') {
      _notification(`'${res.roomName}' is set to protected`, "good")
      setRooms( (_rooms: Room[]) => {
        if (_rooms.find(o => o.name === res.roomName))
          _rooms.find(o => o.name === res.roomName).type = 'PROTECTED'
        setConvs([..._rooms])
        return _rooms
      })
    }
    else {
      _notification(`'${res.roomName}' is set to public`, "good")
      setRooms( (_rooms: Room[]) => {
        _rooms.find(o => o.name === res.roomName).type = 'PUBLIC'
        setConvs([..._rooms])
        return _rooms
      })
    }
    setInfoUpdate(old => !old)
  }

  const muteUser = (res) => {
    setRooms((_rooms: Room[]) => {
      if (_rooms.find(o => o.name === res.roomId.room_name)?.users?.find(o => o.id === res.mutedUser.userId)?.isMuted)
        _rooms.find(o => o.name === res.roomId.room_name).users.find(o => o.id === res.mutedUser.userId).isMuted = 'MUTED'
      else internalError('Internal error when trying to mute user')
      setConvs([..._rooms])
      return _rooms
    })
  }

  const unMuteUser = (res) => {
    setRooms((_rooms: Room[]) => {
      if (_rooms.find(o => o.name === res.roomId.room_name)?.users?.find(o => o.id === res.mutedUser.userId)?.isMuted)
        _rooms.find(o => o.name === res.roomId.room_name).users.find(o => o.id === res.unMutedUser.userId).isMuted = 'UNMUTED'
      else internalError('Internal error when trying to unmute user')
      setConvs([..._rooms])
      return _rooms
    })
  }

  useEffect (() => {
    socket.on('onPromote', promoteUser)
    socket.on('onDemote', demoteUser)
    socket.on('onKick', kickUser)
    socket.on('onBan', banUser)
    socket.on('onLeave', leaveUser)
    socket.on('onMute', muteUser)
    socket.on('onUnMute', unMuteUser)
    socket.on('change-room-name', changeRoomName)
    socket.on('change-room-password', changeRoomPass)
}, []) 

  return (
    <div className='absolute hidden'></div>
  )
}

export default SocketComponent