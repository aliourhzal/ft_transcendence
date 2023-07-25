import { useContext, useEffect } from "react"
import { Context, conversation } from "../page"
import ConvBox from "./ConvBox"
// import { useContext } from "react"
// import { Context } from "../page"


const ConvList = () => {
    const {socket, convs, setConvs} = useContext(Context)
    const fillUserList = (listOfRoomsOfUser) => {
      setConvs([])
      listOfRoomsOfUser.listOfRoomsOfUser.map( (room: any) => setConvs(old => [{name:room, photo:'', last_msg:'welcome to group chat', id:listOfRoomsOfUser.indexes}, ...old]))
    }
  
      useEffect( () => {
        socket?.on('list-rooms',(listOfRoomsOfUser: any) => {
          fillUserList(listOfRoomsOfUser)
        })
    })
    return (
      <div className='group left-[10%] flex-col bg-transparent w-full h-[80%] bg-slate-500 mt-8 overflow-hidden overflow-y-scroll'>
          {convs.map ((item:conversation) =>  (<ConvBox key={item.name} data={item} />))}
      </div>
    )
  }

  export default ConvList