import React, { useContext, useState } from "react"
import Context, { gimmeRandom } from "./Context"
import { BsFillTrashFill } from "react-icons/bs"

interface SelfChatBoxProps {
    user: any,
    msg: any,
}

const SelfChatBox:React.FC<SelfChatBoxProps> = ({user, msg}) => {

    const {socket} = useContext(Context)

    const [showOption, setShowOption] = useState(false)

    return (
        <div className={'z-0 flex items-start justify-end gap-3 m-2 my-4'} key={gimmeRandom()}>
            <div className={"mt-4 "+ (msg.msg.indexOf(' ') > 0 ? 'break-before-all' : 'break-all') + " max-w-[70%] min-w-[40px] text-sm font-semibold py-2 bg-blueStrong rounded-l-3xl rounded-br-3xl p-5 flex items-center justify-center flex-wrap cursor-pointer relative"} onClick={
                () => setShowOption(old => !old)}>
                    {showOption && <BsFillTrashFill size={4} className="cursor-pointer absolute -top-4 -left-4 w-8 h-8 bg-gray-500 rounded-full border-8 border-gray-500 hover:scale-110 transition-all" onClick={
                        () => {console.log(msg); socket.emit('delete-msg', {msgId: msg.id})}
                    }/>}
                {
                    msg.msg === "%GameInvite%" ?
                    'You opened a request for a pong game !'
                    :
                    msg.msg
                }
            </div>
            <img className="rounded-full w-30 h-30 border-2 border-slate-300 w-10 h-10" width={10} height={10} src={user ? user?.photo : '/images/unknownUser.png'} alt=""/>
            {/* <Avatar color={"primary"} src={msg.user ? msg.user.photo : '/images/unknownUser.png'}/> */}
        </div>
    )
}

export default SelfChatBox
