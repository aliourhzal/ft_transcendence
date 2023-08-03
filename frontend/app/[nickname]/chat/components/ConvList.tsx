import { useContext, useEffect } from "react"
import { Context, conversation, gimmeRandom } from "../page"
import ConvBox from "./ConvBox"
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
    const {socket, convs, setConvs, room_created, set_room_created, rooms, setRooms} = useContext(Context)

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
      console.log(rooms)
      setConvs(rooms)
    }
  
    useEffect( () => {
      console.log("entered")
        socket?.once('list-rooms',fillUserList)
    }, [room_created])

    return (
      <div className='group left-[10%] flex-col bg-transparent w-full h-[80%] bg-slate-500 mt-8 overflow-hidden overflow-y-scroll'>
          {convs.map ((item:conversation) =>  (<ConvBox key={gimmeRandom()} data={item} />))}
      </div>
    )
  }

  export default ConvList