import { useContext, useEffect } from "react"
import { Context, conversation, gimmeRandom } from "../page"
import ConvBox from "./ConvBox"
// import { useContext } from "react"
// import { Context } from "../page"


const ConvList = () => {
    const {socket, convs, setConvs, room_created, set_room_created} = useContext(Context)
    const fillUserList = (listOfRoomsOfUser) => {
      setConvs([])
      listOfRoomsOfUser.listOfRoomsOfUser.map( (room: any) => setConvs(old => [{name:room.name, photo:'', last_msg:'welcome to group chat', id:room.id}, ...old]))
    }
  
    useEffect( () => {
      console.log("entered")
        socket?.on('list-rooms',(listOfRoomsOfUser: any) => {
          console.log("YES")
            console.log(listOfRoomsOfUser)
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