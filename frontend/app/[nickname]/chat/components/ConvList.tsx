import { useContext, useEffect } from "react"
import { Context, conversation, gimmeRandom } from "../page"
import ConvBox from "./ConvBox"
// import { useContext } from "react"
// import { Context } from "../page"


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
          users: room.usersInRoom,
          type: room.room.room.roomType
        })
      })
      console.log(rooms)
      setConvs(rooms)
    }
  
    useEffect( () => {
      console.log("entered")
        socket?.on('list-rooms',(listOfRoomsOfUser: any) => {
            // console.log(listOfRoomsOfUser)
            fillUserList(listOfRoomsOfUser)
          })
    }, [room_created])

    return (
      <div className='group left-[10%] flex-col bg-transparent w-full h-[80%] bg-slate-500 mt-8 overflow-hidden overflow-y-scroll'>
          {convs.map ((item:conversation) =>  (<ConvBox key={gimmeRandom()} data={item} />))}
      </div>
    )
  }

  export default ConvList