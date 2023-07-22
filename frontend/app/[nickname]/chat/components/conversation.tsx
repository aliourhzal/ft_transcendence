"use client"

import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { Context } from '../page'
import ChatBox from './ChatBox'

const Conversation = (props:any) => {

    const [deviceType, setDeviceType] = useState('normal')

    const {showConv, setShowConv, activeUserConv, setActiveUserConv, chatBoxMessages, setChatBoxMessages, rooms} = useContext(Context)

    useEffect( () => {
      typeof window != 'undefined' ? (window.innerWidth <= 768 ? setDeviceType('small') : setDeviceType('normal')) : setDeviceType('normal')
      typeof window != 'undefined' ? window.onresize = () => {
        if (window.innerWidth <= 768)
          setDeviceType('small')
        else
          setDeviceType('normal')
      } : setDeviceType('normal')
    } , [])

    const handleKeyDown = (e:any) => {
        if (e.key === 'Enter')
            sendMessage()
    }
    const [msg, setMsg] = useState<string>()
    const sendMessage = () => {
        var temp = chatBoxMessages
        temp.push({user:'self', msg})
        setChatBoxMessages(temp)
        setMsg('')
    }

    if (showConv) {
    return (
        deviceType == 'normal' ?
            <div className='flex flex-col h-[90vh] w-[calc(120%/2)] items-center justify-center '>
				<div className=" text-white pl-10 pb-5 pt-4 w-[100%] border-blue-gray-200 text-blue-gray-700 outline border-b outline-0 placeholder-shown:border-blue-gray-200 focus:outline-0">
					<div className=''>{activeUserConv.name}</div>
				</div>

                <div className='flex-col w-full h-[80%] mt-8 overflow-hidden overflow-y-scroll'>
                    <ChatBox msgs={chatBoxMessages}/>
                    {/* <Image className=' object-contain' alt='bg' src='/assets/images/conv_bg.gif' width={500} height={500}/> */}
                </div>

                <div className='h-[8%] w-[90%] flex items-center justify-center'>
					<div className='w-full h-[70%] rounded-[100px] bg-zinc-800 flex items-center justify-between'>
						<input autoComplete="off" placeholder='Type a message...' type="text" id="message" className="outline outline-0 bg-transparent  p-5 text-gray-100 text-xs sm:text-base focus:ring-blue-500 focus:border-blue-500 w-[90%]" value={msg} onChange={(e) => {setMsg(e.target.value)}} onKeyDown={ handleKeyDown }/>
						<div className='w-[8%] flex items-center justify-center'>
							<div className=' border-blue-500 border-[6px] bg-blue-500 rounded-full h-9 w-9 flex items-center justify-center cursor-pointer' onClick={sendMessage}>
								<Image className='w-auto h-auto' src="/images/send.svg" alt="send" width={150} height={150}/>
							</div>
						</div>
					</div>
                </div>
            </div>
        : 
        <div id='conv_div' className='flex-col absolute h-[100%] w-[100%] bg-gray-900 rounded-3xl'>
            <button className='absolute right-10 top-[2%] bg-blue-500 text-white rounded-full w-7' type='button' onClick={() => {setShowConv(false)}}>X</button>
            <div className='w-[100%]'>
                <div className="text-white pl-10 pb-3 w-[100%] border-b border-blue-gray-200 bg-transparent pt-4 text-blue-gray-700 outline outline-0 placeholder-shown:border-blue-gray-200 focus:border-blue-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                ><div className='font-bold text-xl'>{activeUserConv.name}</div></div>
                </div>

                <div className='my-[3%] w-[100%] h-[80vh] border-white border-4 bg-gray-900'>
                    <ChatBox msgs={chatBoxMessages}/>
                {/* <Image className=' object-contain' alt='bg' src='/assets/images/conv_bg.gif' width={500} height={500}/> */}
                </div>

                <div className='absolute pt-5 bg-gray-900 text-center w-[100%] flex items-center justify-center'>
					<input autoComplete="off" placeholder='Type a message...' type="text" id="message" className="absolute outline outline-0 block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500" value={msg} onChange={(e) => {setMsg(e.target.value)}} onKeyDown={ handleKeyDown }/>
					<div className='absolute right-[1%] border-blue-500 border-[6px] bg-blue-500 rounded-full h-7 w-7 flex items-center justify-center cursor-pointer' onClick={sendMessage}>
						<Image className='w-auto h-auto' src="/images/send.svg" alt="send" width={100} height={100}/>
					</div>
                </div>
            </div>
        )
    }
    else
        return null
}

export default Conversation