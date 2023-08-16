import React, { useState } from 'react'

interface NotificationProps {
  text: string
  type: string
}

const Notification:React.FC<NotificationProps> = ( { text, type } ) => {

  const [bgColor, setBgColor] = useState(type === 'good' ? 'bg-green-600' : 'bg-red-600')

  return (
    <div className='z-50 transition ease-in duration-300 absolute top-5 right-5 w-full flex items-center justify-end'>
        <div className={'rounded-xl p-5 flex items-center h-10 ' + bgColor + ' text-white'}>{text}</div>
    </div>
  )
}

export default Notification