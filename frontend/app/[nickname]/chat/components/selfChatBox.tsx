import React from "react"
import { gimmeRandom } from "../page"

interface SelfChatBoxProps {
    user: string,
    msg: string
}

const SelfChatBox:React.FC<SelfChatBoxProps> = (msg) => {
    return (
        <div className={'bg-blue-500 h-10 my-1 rounded-full p-5 flex items-center justify-end'}
        key={gimmeRandom()}>{msg.msg}:{msg.user} : </div>
    )
}

export default SelfChatBox
  
