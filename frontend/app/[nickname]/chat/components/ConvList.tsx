import { useContext, useEffect } from "react"
import { Context, conversation } from "../page"
import UserBox from "./ConvBox"
// import { useContext } from "react"
// import { Context } from "../page"

interface ConvListProps {
  items: conversation[]
};

const ConvList: React.FC<ConvListProps> = ({items}) => {
    const {socket, convs, setConvs} = useContext(Context)
    const fillUserList = (listOfRoomsOfUser) => {
      setConvs([])
      listOfRoomsOfUser.listOfRoomsOfUser.map( (room: any) => setConvs(old => [{name:room, photo:'', last_msg:'welcome to group chat', id:listOfRoomsOfUser.indexes}, ...old]))
    }
  
      useEffect( () => {
      if (socket) {
        socket.on('list-rooms',(listOfRoomsOfUser: any) => {
          fillUserList(listOfRoomsOfUser)
        })
      }
    }, [convs])
    return (
      <div className='group left-[10%] flex-col bg-transparent w-full h-[80%] bg-slate-500 mt-8 overflow-hidden overflow-y-scroll'>
          {items.map ((item:conversation) =>  (<UserBox key={item.name} data={item} />))}
      </div>
    )
  }

  export default ConvList