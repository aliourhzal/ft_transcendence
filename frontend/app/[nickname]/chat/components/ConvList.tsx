import { useContext, useEffect, useState } from "react"
import { Context, conversation, getUsersInfo, gimmeRandom } from "../page"
import ConvBox from "./ConvBox"
import { userInfo } from "os"
import Search from "./search"
// import { useContext } from "react"
// import { Context } from "../page"

const ConvList = () => {
    const {socket, room_created, set_room_created, rooms, setRooms, userData} = useContext(Context)

    const [convs, setConvs] = useState<conversation[]>([])

    const [updateList, setUpdateList] = useState(false)

    const fillUserList = (listOfRoomsOfUser) => {
      setConvs([])
      listOfRoomsOfUser.messages.map( (room: any) => {
        rooms.unshift({
          name: room.room.room.room_name,
          lastmsg:'welcome to group chat',
          msgs: room.msg,
          id: room.room.room.id,
          users: getUsersInfo(room.usersInRoom),
          type: room.room.room.roomType
        })
      })
      // console.log(rooms)
      setConvs(rooms)
      // return socket?.off('list-rooms',fillUserList)
    }

    useEffect( () => {
      socket.on('list-rooms',fillUserList)
    }, [])

    const AddUserToRoom = (res) => {
      console.log('join room ',res)
      const newuser = res.userInfos.find(o => o.userId === res.newUserAdded.userId)
      console.log(newuser)
      if (newuser.user.nickname === userData.nickname) {
        rooms.unshift({
        msgs: [],
        id: res.roomId.id,
        name: res.roomId.room_name,
        type: res.roomId.roomType,
        lastmsg:'welcome to group chat',
        users: getUsersInfo(res.userInfos),
        })
      } else {
        rooms.find(o => o.name === res.roomId.room_name).users.push(
        {
          id: newuser.user.id,
          nickName: newuser.user.nickname,
          firstName: newuser.user.firstName,
          lastName: newuser.user.lastName,
          photo: newuser.user.profilePic,
          type: newuser.userType,
          isBanned: newuser.isBanned,
        }
        )
      }
      set_room_created(old => !old)
      setUpdateList(old => !old)
      console.log(rooms)
    }
    
    // const removeConv = (res) => {
    //   var kickedUser = rooms.find(o => o.name === res.roomId.room_name).users.find(o => o.id === res.kickedUser.userId)
    //   if (kickedUser.nickname === userData.nickname) {
    //     // var currentRoomUsers = rooms.find(o => o.name === res.roomId.room_name).users
    //     setConvs((_convs:conversation[]) => {
    //       var convToRemove = _convs.find(o => o.name === res.roomId.room_name)
    //       _convs.splice(convs.indexOf(convToRemove), 1)
    //       console.log(_convs)
    //       return _convs
    //     })
    //   }

    // }

    useEffect(() => {
      socket.on('users-join', AddUserToRoom)
      // socket.on('onKick', removeConv)
    }, [])

    return (
      <>
        <Search users={convs} />
        <div className='group left-[10%] flex-col bg-transparent w-full h-[80%] bg-slate-500 mt-8 overflow-hidden overflow-y-scroll'>
            {convs.map ((item:conversation) =>  (<ConvBox key={gimmeRandom()} data={item} />))}
        </div>
      </>
    )
  }

  export default ConvList