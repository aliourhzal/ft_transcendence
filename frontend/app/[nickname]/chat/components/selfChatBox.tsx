import React from "react"
import { gimmeRandom } from "../page"
import { Avatar } from "@nextui-org/react"

interface SelfChatBoxProps {
    user: any,
    msg: string
}

const SelfChatBox:React.FC<SelfChatBoxProps> = (msg) => {
    return (
        <div className={'z-0 flex items-start justify-end gap-3 m-2'} key={gimmeRandom()}>
            <div className="overflow-hidden py-2 bg-blueStrong rounded-3xl p-5 flex items-center justify-center flex-wrap">{msg.msg}</div>
            <img className="rounded-full w-30 h-30 border-2 border-slate-300" width={40} height={40} src={msg.user ? msg.user.photo : '/images/unknownUser.png'}/>
            {/* <Avatar color={"primary"} src={msg.user ? msg.user.photo : '/images/unknownUser.png'}/> */}
        </div>
    )
}

export default SelfChatBox
  
