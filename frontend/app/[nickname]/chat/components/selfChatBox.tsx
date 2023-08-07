import React from "react"
import { gimmeRandom } from "../page"
import {Avatar} from "@nextui-org/react"

interface SelfChatBoxProps {
    user: any,
    msg: string
}

const SelfChatBox:React.FC<SelfChatBoxProps> = (msg) => {
    console.log(msg)
    return (
        <div className={'z-0 flex items-center justify-end gap-3'} key={gimmeRandom()}>
            <div className="py-2 bg-blueStrong my-1 rounded-full p-5 flex items-center justify-start flex-wrap">{msg.msg}</div>
            <Avatar pointer src={msg.user.photo}/>
        </div>
    )
}

export default SelfChatBox
  
