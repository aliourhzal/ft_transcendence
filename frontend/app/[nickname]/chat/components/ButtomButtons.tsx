import React, { useContext, useState } from 'react'
import { Context } from '../page';
import { LiaUsersSolid } from 'react-icons/Lia'
import { AiOutlineUsergroupAdd } from 'react-icons/Ai'
import { TbMessage2Search } from 'react-icons/tb';

const ButtomButtons = () => {

    const {setShowForm, setShowJoinForm, setShowSearchUsersForm, socket} = useContext(Context)

    const [create, setcreate] = useState(false)
    const [join, setJoin] = useState(false)
    const [dm, setDm] = useState(false)

  return (
    <div className='flex justify-between items-center w-[50%] h-[8%]'>
        <div className='hover:scale-110 relative cursor-pointer border-blue-500 border-[6px] bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center' onClick={ () => {
                setShowForm(true);
            }}
            onMouseOver={() => {setcreate(true)}}
            onMouseLeave={() => {setcreate(false)}}
        >
            <AiOutlineUsergroupAdd title='create room' color='white' className='w-[80%] h-[80%]'/>
            {create && <div className='drop-shadow-[0px_0px_5px_rgba(150,150,150,0.8)] font-bold text-xs absolute top-[140%] bg-slate-400 opacity-80 w-14 rounded-lg'>create room</div>}
        </div>
        <div className='hover:scale-110 relative cursor-pointer border-blue-500 border-[6px] bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center' onClick={ () => {
            setShowJoinForm(true)
        }}
            onMouseOver={() => {setJoin(true)}}
            onMouseLeave={() => {setJoin(false)}}
        >
            <LiaUsersSolid title='join room' color='white' className='w-[80%] h-[80%]'/>
            {join && <div className='drop-shadow-[0px_0px_5px_rgba(150,150,150,0.8)] text-xs font-bold absolute top-[140%] bg-slate-400 opacity-80 w-14 rounded-lg'>join room</div>}
        </div>
        <div className='hover:scale-110 relative cursor-pointer border-blue-500 border-[6px] bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center' onClick={ () => {
            setShowSearchUsersForm(true)
            socket.emit('get-users', null)
        }}
            onMouseOver={() => {setDm(true)}}
            onMouseLeave={() => {setDm(false)}}
        >
            <TbMessage2Search title='DM users' color='white' className='w-[80%] h-[80%]'/>
            {dm && <div className='drop-shadow-[0px_0px_5px_rgba(150,150,150,0.8)] text-xs font-bold absolute top-[140%] bg-slate-400 opacity-80 w-14 rounded-lg'>dm users</div>}
        </div>
    </div>
  )
}

export default ButtomButtons