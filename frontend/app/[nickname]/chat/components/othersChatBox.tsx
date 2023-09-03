import React from "react"
import { gimmeRandom } from "../page"

interface SelfChatBoxProps {
    user: any,
    msg: string,
    currentUsers: any[]
  }

  const OthersChatBox:React.FC<SelfChatBoxProps> = (msg) => {
    // console.log(msg)
    return (
        <div className={'z-0 flex items-start justify-start gap-3 m-2 my-4'} key={gimmeRandom()}>
            <img className="bg-white rounded-full w-30 h-30 border-2 border-slate-300 w-10 h-10" width={10} height={10} src={msg.user ? msg.user.photo : '/images/unknownUser.png'}/>
            {/* <Avatar color={"primary"} pointer src={msg.user ? msg.user.photo : '/images/unknownUser.png'}/> */}
            <div className="mt-4 break-before-all max-w-[70%] text-sm font-semibold overflow-hidden py-2 bg-slate-400 rounded-r-3xl rounded-bl-3xl p-5 flex items-center justify-center flex-wrap">{msg.msg}</div>
        </div>
    )
}

export default OthersChatBox