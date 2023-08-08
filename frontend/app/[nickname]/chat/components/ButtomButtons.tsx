import React, { useContext } from 'react'
import { Context } from '../page';

const ButtomButtons = () => {

    const {setShowForm, setShowJoinForm, setShowSearchUsersForm} = useContext(Context)

  return (
    <div className='flex justify-between items-center w-[50%] h-[8%]'>
        <div className='cursor-pointer border-blue-500 border-[6px] bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center' onClick={ () => {
                setShowForm(true);
            }}>
            <img className='w-auto h-auto' alt='CreateChannel' title='CreateChannel' src='/images/channel.svg'  width={30} height={30}/>
        </div>
        <div className='cursor-pointer border-blue-500 border-[6px] bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center' onClick={ () => {
                setShowJoinForm(true)
            }}>
            <img title='JoinChannel' className='w-auto h-auto' alt='JoinChannel' src='/images/channel.svg' width={30} height={30}/>
        </div>
        <div className='cursor-pointer border-blue-500 border-[6px] bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center'>
            <img className='w-auto h-auto' alt='new channel' src='/images/groupe.svg' width={25} height={25} onClick={ () => {
                setShowSearchUsersForm(true)
            }}/>
        </div>
    </div>
  )
}

export default ButtomButtons