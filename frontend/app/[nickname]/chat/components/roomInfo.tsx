import React from 'react'
import { gimmeRandom } from '../page'

interface RoomInfoProps {
    users: any[]
    name: string
    setShow: any
}

const RoomInfo: React.FC<RoomInfoProps> = (info) => {
  return (
    <div className='p-8 absolute mt-20 z-20 w-[70%] bg-slate-500 rounded-2xl'>
        <div className='flex justify-between'>
            <div className=' text-xl font-bold'>{info.name}</div>
            <button type="button" className="ml-[auto] w-9 h-9 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg flex text-center justify-center items-center" onClick={() => info.setShow(false)}>x</button>
        </div>
        <div className='flex flex-col justify-center items-center'>
            <h1 className='font-bold m-3'>Users</h1>
            {info.users.map(user => (
                <div key={user.id}>{user.nickName}</div>
            ) )}
        </div>
    </div>
  )
}

export default RoomInfo