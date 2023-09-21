import React, { useContext } from "react"
import Context, { gimmeRandom } from "./Context"
import Link from "next/link"

interface SelfChatBoxProps {
    user: any,
    msg: string,
  }

const OthersChatBox:React.FC<SelfChatBoxProps> = (msg) => {

    const { userData } = useContext(Context)

    return (
        <div className={'z-0 flex items-start justify-start gap-3 m-2 my-4'} key={gimmeRandom()}>
            <img className="bg-white rounded-full w-30 h-30 border-2 border-slate-300 w-10 h-10" width={10} height={10} src={msg.user ? msg.user?.photo : '/images/unknownUser.png'} alt="..."/>
            {/* <Avatar color={"primary"} pointer src={msg.user ? msg.user.photo : '/images/unknownUser.png'}/> */}
            <div className={"mt-4 "+ (msg.msg.indexOf(' ') > 0 ? 'break-before-all' : 'break-all') + " max-w-[70%] text-sm font-semibold overflow-hidden py-2 bg-slate-400 rounded-r-3xl rounded-bl-3xl p-5 flex items-center justify-center flex-wrap"}>{
                msg.msg === "%GameInvite%" ?
                <span className="flex flex-col items-center justify-center">
                    {`${msg.user?.nickName} invited you to a pong game`}
                    {msg.user && <Link href={`/${userData.nickname}/game?id=${msg.user?.id}`}>
                        <button className="joinGameBtn transition-all hover:scale-110 my-2">
                            <p className="text-button">join</p>
                        </button>
                    </Link>}
                </span> :
                msg.msg
            }</div>
        </div>
    )
}

export default OthersChatBox