import React from "react"
import { gimmeRandom } from "../page"
import { Avatar } from "@nextui-org/react"

interface SelfChatBoxProps {
    user: any,
    msg: string
}

const SelfChatBox:React.FC<SelfChatBoxProps> = (msg) => {
    console.log(msg)
    return (
        <div className={'z-0 flex items-start justify-end gap-3 m-2'} key={gimmeRandom()}>
            <div className="overflow-hidden py-2 bg-blueStrong rounded-3xl p-5 flex items-center justify-center flex-wrap">{msg.msg}</div>
            <Avatar pointer src={msg.user.photo}/>
        </div>
    )
}

export default SelfChatBox
  
