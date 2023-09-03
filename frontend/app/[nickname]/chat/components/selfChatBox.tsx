import React from "react"
import { gimmeRandom } from "../page"

interface SelfChatBoxProps {
    user: any,
    msg: string,
    currentUsers: any[]
}

const SelfChatBox:React.FC<SelfChatBoxProps> = (msg) => {
    return (
        <div className={'z-0 flex items-start justify-end gap-3 m-2 my-4'} key={gimmeRandom()}>
            <div className="mt-4 break-before-all max-w-[70%] text-sm font-semibold overflow-hidden py-2 bg-blueStrong rounded-l-3xl rounded-br-3xl p-5 flex items-center justify-center flex-wrap">{msg.msg}</div>
            <img className="rounded-full w-30 h-30 border-2 border-slate-300 w-10 h-10" width={10} height={10} src={msg.user ? msg.user.photo : '/images/unknownUser.png'}/>
            {/* <Avatar color={"primary"} src={msg.user ? msg.user.photo : '/images/unknownUser.png'}/> */}
        </div>
    )
}

export default SelfChatBox
  
