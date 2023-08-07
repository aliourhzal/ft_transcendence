import React from "react"
import { gimmeRandom } from "../page"
import { Avatar } from "@nextui-org/react"

interface SelfChatBoxProps {
    user: any,
    msg: string
  }

const OthersChatBox:React.FC<SelfChatBoxProps> = (msg) => {
    return (
        <div className={'z-0 flex items-start justify-start gap-3'} key={gimmeRandom()}>
            <Avatar pointer src={msg.user.photo}/>
            <div className="overflow-hidden py-2 bg-slate-400 my-1 rounded-3xl p-5 flex items-center justify-center flex-wrap">{msg.msg}</div>
        </div>
    )
}

export default OthersChatBox