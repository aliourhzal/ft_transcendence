import React from "react"
import { gimmeRandom } from "../page"
import { Avatar } from "@nextui-org/react"

interface SelfChatBoxProps {
    user: any,
    msg: string
  }

const OthersChatBox:React.FC<SelfChatBoxProps> = (msg) => {
    console.log(msg)
    return (
        <div className={'z-0 flex items-center justify-start gap-3'} key={gimmeRandom()}>
            <Avatar pointer src={msg.user.photo}/>
            <div className="py-2 flex-wrap bg-slate-400 h-10 my-1 rounded-full p-5 flex items-center justify-end">{msg.msg}</div>
        </div>
    )
}

export default OthersChatBox