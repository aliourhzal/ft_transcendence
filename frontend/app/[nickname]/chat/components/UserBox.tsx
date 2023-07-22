import React, { useContext } from 'react'
// import Image from 'next/image'
import { user } from '../page'
// import { Avatar } from '@nextui-org/react'
import {Avatar} from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { Context } from '../page'

interface UserBoxProps {
    data : user
}

const UserBox: React.FC<UserBoxProps> = (data) => {

  const {showConv, setShowConv, activeUserConv, setActiveUserConv, rooms} = useContext(Context)

  const handleClick = () => {
    setShowConv(true)
    setActiveUserConv(data.data)
  }

  const activeDiv = (div:HTMLDivElement) => {
    var divs = document.getElementsByClassName('convGroup') as HTMLCollectionOf<HTMLElement>
    if (divs) {
      for (var i = 0; i < divs.length; i++) {
        if (divs[i] == div)
          divs[i].style.backgroundColor = "rgb(59 130 246)"
        else
          divs[i].style.backgroundColor = "rgb(39 39 42)"
      }
    }
  }
  return (
    <div className="convGroup z-1 bg-zinc-800 w-[70%] left-[15%] h-[100px] relative my-3 rounded-md active:bg-blue-500" onClick={(e) => {handleClick(); activeDiv(e.currentTarget)}}>
        <div className="left-[30%] top-[25%] absolute text-gray-200 font-medium">{data.data.name}</div>
        <Avatar pointer zoomed text={data.data.name} bordered color={"gradient"} alt={data.data.name} className="w-auto h-auto left-[6%] top-[30%] absolute"
            src={data.data.photo} />
        <div className="left-[30%] top-[50%] absolute text-gray-200 text-opacity-70 font-normal">{
            data.data.last_msg ? data.data.last_msg.length > 20 ? data.data.last_msg.substring(0, 20)+'...' : data.data.last_msg : ''}</div>
        <div className="left-[85%] top-[70%] lg:top-[50%] absolute text-gray-200 text-opacity-70 font-normal">10:30</div>
    </div>
  )
}

export default UserBox