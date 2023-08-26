 import React, { useContext, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Context } from '../page'
import ChatBox from './ChatBox'
import RoomInfo from './roomInfo'
import AlertMsgDown from './AlertMsgDown'
import { getCookie } from '../../layout'
import SocketComponent from './SocketComponent'
import { headers } from 'next/dist/client/components/headers'
import { FcInfo } from 'react-icons/Fc'
import {Avatar} from '@nextui-org/react'

const Conversation = () => {

    const [deviceType, setDeviceType] = useState('normal')

    const [showInfo, setShowInfo] = useState(false)

    const [msg_sender, set_msg_sender] = useState('')

    const {setAlertNewMessage, scrollToBottom, showConv, activeUserConv, chatBoxMessages, rooms, socket, userData, msg_sent, set_msg_sent, setChatBoxMessages} = useContext(Context)

    // useEffect( () => {
    //   typeof window != 'undefined' ? (window.innerWidth <= 768 ? setDeviceType('small') : setDeviceType('normal')) : setDeviceType('normal')
    //   typeof window != 'undefined' ? window.onresize = () => {
    //     if (window.innerWidth <= 768)
    //       setDeviceType('small')
    //     else
    //       setDeviceType('normal')
    //   } : setDeviceType('normal')
    // } , [])

    // const handleKeyDown = (e:any) => {
    //     if (e.key === 'Enter')
    //         sendMessage()
    // }
    const sendMessage = async (e) => {
        e.preventDefault()
        const msg = e.target[0].value.trim()
        if (msg != '') {
            var _user = rooms.find(o => o.name === activeUserConv.name).users.find(o => o.nickName === userData.nickname)
            if (_user.isMuted === 'UNMUTED') {
                console.log(rooms.find(o => o.name === activeUserConv.name).id)
                socket.emit('send-message', {message:msg, roomId:rooms.find(o => o.name === activeUserConv.name).id})
                msg_sent == undefined ? set_msg_sent(1) : set_msg_sent(old => old == 1 ? 2 : 1)
                e.target[0].value = ''
                set_msg_sender(userData.nickname)
            }
            else {
                setChatBoxMessages(old => [...old, {user: 'bot', msg : "You are muted"}])
                e.target[0].value = ''
            }
        }
    }
    
    useEffect ( () => {
        if (userData.nickname === msg_sender) {
            scrollToBottom()
            setAlertNewMessage(false)
        }
    }, [chatBoxMessages])

    // if (showConv) {
    return (
        deviceType === 'normal' ?
        <div className='flex flex-col h-[90vh] w-[calc(120%/2)] items-center justify-center '>
                {activeUserConv.name && <RoomInfo room={rooms.find(o => o.name === activeUserConv.name)} setShow={setShowInfo} show={showInfo} userData={userData} />}
				{ showConv && <>
                    <div className="z-0 flex justify-between text-white pl-10 pb-3 pt-4 w-[100%] border-blue-gray-200 text-blue-gray-700 outline border-b outline-0 placeholder-shown:border-blue-gray-200 focus:outline-0">
                        <div className=' min-w-[150px] bg-darken-100 rounded-l-3xl pr-2 rounded-r-xl flex items-center gap-3 justify-start w-auto h-auto cursor-pointer hover:underline' onClick={() => {
                            if (rooms.find(o => o.name === activeUserConv.name).type != 'DM')
                                setShowInfo(true)
                            // else
                                //visit profile
                        }}>
                            <Avatar zoomed text={activeUserConv.name} bordered color={'gradient'} alt={activeUserConv.name} src={rooms.find(o => o.name === activeUserConv.name).photo} pointer/>
                            <div className='w-full flex items-center justify-center'>{activeUserConv.name}</div>
                            </div>
                        {rooms.find(o => o.name === activeUserConv.name).type != 'DM' &&
                        <FcInfo className='cursor-pointer mr-5 w-7 h-7' width={30} height={30} onClick={ () => {
                            setShowInfo(true)
                        }}/>}
                    </div>

                    <div id='chatbox' className='relative flex flex-col w-full mt-8 overflow-y-scroll basis-[80%]'>
                        <ChatBox/>
                    </div>

                    <div className='h-[8%] w-[90%] flex items-center justify-center'>
                        <div className='w-full h-[70%] rounded-[100px] bg-zinc-800 flex items-center justify-between'>
                            <form onSubmit={sendMessage} id='form' className='w-[98%]'>
                                <input onFocus={e => e.target.placeholder = ''} onBlur={e => e.target.placeholder = 'Type a message...'} autoComplete="off" placeholder='Type a message...' type="text" id="message" className="transition-all delay-100 duration-100 outline outline-0 bg-transparent  p-5 text-gray-100 text-xs sm:text-base focus:ring-blue-500 focus:border-blue-500 w-[100%]"/>
                            </form>
                            <div className='w-13 h-8 flex items-center justify-center'>
                                <button type='submit' form='form' className=' border-blue-500 border-[6px] bg-blue-500 rounded-full w-[100%] h-[100%] mr-3 flex items-center justify-end cursor-pointer'>
                                    <img className='w-auto h-auto' src="/images/send.svg" alt="send" width={150} height={150}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </> }
            </div>
        : ''


                        // PHOOOOOOOOOOOOOONE


    //     <div id='conv_div' className='flex-col absolute h-[100%] w-[100%] bg-gray-900 rounded-3xl'>
    //         <button className='absolute right-10 top-[2%] bg-blue-500 text-white rounded-full w-7' type='button' onClick={() => {setShowConv(false)}}>X</button>
    //         <div className='w-[100%]'>
    //             <div className="text-white pl-10 pb-3 w-[100%] border-b border-blue-gray-200 bg-transparent pt-4 text-blue-gray-700 outline outline-0 placeholder-shown:border-blue-gray-200 focus:border-blue-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
    //             ><div className='font-bold text-xl'>{activeUserConv.name}</div></div>
    //             </div>

    //             <div className='my-[3%] w-[100%] h-[80vh] border-white border-4 bg-gray-900'>
    //                 <ChatBox/>
    //             {/* <Image className=' object-contain' alt='bg' src='/assets/images/conv_bg.gif' width={500} height={500}/> */}
    //             </div>

    //             {/* <div className='absolute pt-5 bg-gray-900 text-center w-[100%] flex items-center justify-center'>
	// 				<input autoComplete="off" placeholder='Type a message...' type="text" id="message" className="absolute outline outline-0 block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500" value={msg} onChange={(e) => {setMsg(e.target.value)}} onKeyDown={ handleKeyDown }/>
	// 				<div className='absolute right-[30%] lg:right-[1%] border-blue-500 border-[6px] bg-blue-500 rounded-full h-7 w-7 flex items-center justify-center cursor-pointer' onClick={sendMessage}>
	// 					<img className='w-auto h-auto' src="/images/send.svg" alt="send" width={100} height={100}/>
	// 				</div>
    //             </div> */}
    //         </div>
        // )
    // }
    // else
    //     return null
    )
}

export default Conversation

// auto MATA