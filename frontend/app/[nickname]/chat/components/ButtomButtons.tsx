import React, { useContext } from 'react'
import { Context } from '../page';
import { LiaUsersSolid } from 'react-icons/Lia'
import { AiOutlineUsergroupAdd } from 'react-icons/Ai'
import { TbMessage2Search } from 'react-icons/Tb';

const ButtomButtons = () => {

    const {setShowForm, setShowJoinForm, setShowSearchUsersForm} = useContext(Context)

  return (
    <div className='flex justify-between items-center w-[50%] h-[8%]'>
        <div className='cursor-pointer border-blue-500 border-[6px] bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center' onClick={ () => {
                setShowForm(true);
            }}>
            <AiOutlineUsergroupAdd title='create room' color='white' className='w-[80%] h-[80%]'/>
        </div>
        <div className='cursor-pointer border-blue-500 border-[6px] bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center' onClick={ () => {
                setShowJoinForm(true)
            }}>
            <LiaUsersSolid title='join room' color='white' className='w-[80%] h-[80%]'/>
        </div>
        <div className='cursor-pointer border-blue-500 border-[6px] bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center' onClick={ () => {
                setShowSearchUsersForm(true)
            }}>
            <TbMessage2Search title='DM users' color='white' className='w-[80%] h-[80%]'/>
        </div>
    </div>
  )
}

export default ButtomButtons