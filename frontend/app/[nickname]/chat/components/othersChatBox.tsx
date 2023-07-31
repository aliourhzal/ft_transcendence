import React from "react"
import { gimmeRandom } from "../page"

interface SelfChatBoxProps {
    user: string,
    msg: string
  }

const OthersChatBox:React.FC<SelfChatBoxProps> = (msg) => {
    return (
        <div className={' bg-slate-400 h-10 my-1 rounded-full p-5 flex items-center justify-start'}
        key={gimmeRandom()}>{msg.user} : {msg.msg}</div>
    )
}

export default OthersChatBox