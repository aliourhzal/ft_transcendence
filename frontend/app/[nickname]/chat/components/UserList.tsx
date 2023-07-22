import Image from "next/image"
import { user } from "../page"
import UserBox from "./UserBox"
import { data } from "autoprefixer"
import { useContext } from "react"
import { Context } from "../page"

interface UserListProps {
  items: user[]
};

const UserList: React.FC<UserListProps> = ({items}) => {
    const {showConv, setShowConv, activeUserConv, setActiveUserConv, rooms} = useContext(Context)
    return (
      <div className='group left-[10%] flex-col bg-transparent w-full h-[80%] bg-slate-500 mt-8 overflow-hidden overflow-y-scroll'>
          {items.map ((item:user) =>  (<UserBox key={item.id} data={item} />))}
      </div>
    )
  }

  export default UserList