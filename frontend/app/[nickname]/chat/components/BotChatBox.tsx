import React from 'react'
import { gimmeRandom } from '../page'

interface BotChatBoxProps {
    msg: string
}

const BotChatBox = ({ msg }) => {
  return (
    <div className={'z-0 flex items-center justify-center gap-3 m-4'}>
      {/* <img className="bg-white rounded-full w-30 h-30 border-2 border-slate-300" width={40} height={40} src={msg.user ? msg.user.photo : '/images/unknownUser.png'}/> */}
      <div className="overflow-hidden py-2 bg-gray-600 rounded-3xl p-5 flex items-center justify-center flex-wrap">{msg}</div>
    </div>
  )
}

export default BotChatBox