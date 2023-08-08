import { useContext, useEffect } from "react"
import { Context, conversation, gimmeRandom } from "../page"
import ConvBox from "./ConvBox"
import { userInfo } from "os"
// import { useContext } from "react"
// import { Context } from "../page"

const getUsersInfo = (users) => {
  let _users: {
		id: string,
		nickName: string,
		firstName: string,
		lastName: string,
		photo?: string,
		type: "OWNER"| "ADMIN" | "USER",
		isBanned: boolean
	}[] = []
  // console.log(users)
  users.map( (user) => {
      _users.push(
        {
          id: user.user.id,
          nickName: user.user.nickname,
          firstName: user.user.firstName,
          lastName: user.user.lastName,
          photo: user.user.profilePic,
          type: user.userType,
          isBanned: user.isBanned,
        }
      )
    } 
  )
    return (_users)
}

const ConvList = () => {
    const {socket, convs, setConvs, room_created, set_room_created, rooms, setRooms, userData} = useContext(Context)

    const fillUserList = (listOfRoomsOfUser) => {
      setConvs([])
      listOfRoomsOfUser.messages.map( (room: any) => {
        rooms.unshift({
          name: room.room.room.room_name,
          last_msg:'welcome to group chat',
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

    socket?.on('list-rooms',fillUserList)

    const AddUserToRoom = (res) => {
      // if (res.userInfos.currentUser.nickname === userData.nickname) {
      //   rooms.unshift({
      //     name: res.roomId.room_name,
      //     last_msg:'welcome to group chat',
      //     msgs: [],
      //     id: res.roomId.id,
      //     users: getUsersInfo(room.usersInRoom),
      //     type: res.roomId.roomType
      //   })
      // }
      // console.log("**", res, "**")
      console.log("**", res.roomId, "**")
      console.log("**", res.userInfos.currentUser, "**")
      console.log("**", res.userInfos.userType, "**")
      // console.log("**", res.userInfos[res.userInfo.length()], "**")
    }

    socket.on('users-join', AddUserToRoom)

    return (
      <div className='group left-[10%] flex-col bg-transparent w-full h-[80%] bg-slate-500 mt-8 overflow-hidden overflow-y-scroll'>
          {convs.map ((item:conversation) =>  (<ConvBox key={gimmeRandom()} data={item} />))}
      </div>
    )
  }

  export default ConvList