import React, { useContext, useEffect, useRef, useState } from 'react'
import { Context } from '../page'
import ChatBox from './ChatBox'
import RoomInfo from './roomInfo'
import {Avatar} from '@nextui-org/react'

interface ConversationProps {
    allUsers: any[]
    activeUserConv: any
    deviceType: string
    setShowConv: any
    showConv: boolean
    setActiveUserConv: any,
    setAlertText: any,
    setShowAlert: any
}

const Conversation:React.FC<ConversationProps> = ( { allUsers, activeUserConv, deviceType, setShowConv, showConv, setActiveUserConv, setShowAlert, setAlertText } ) => {
    
    const [showInfo, setShowInfo] = useState(false)
    
    const [msg_sender, set_msg_sender] = useState('')
    
    const {setAlertNewMessage, scrollToBottom, chatBoxMessages, rooms, socket, setRefresh,
        userData, setChatBoxMessages, setShowUserInfos, setUserInfoNick, msgInputRef, setRooms, setConvs} = useContext(Context)

    const sendMessage = (e) => {
        e.preventDefault()
        const msg = e.target[0].value.trim()
        if (msg != '') {
            var _user = rooms.find(o => o.id === activeUserConv.id)?.users.find(o => o.nickName === userData.nickname)
            if (_user) {
                if (_user.isMuted === 'UNMUTED') {
                    socket.emit('send-message', {message:msg, roomId:rooms.find(o => o.id === activeUserConv.id).id})
                    e.target[0].value = ''
                    set_msg_sender(userData.nickname)
                }
                else {
                    setChatBoxMessages(old => [...old, {user: 'bot', msg : "You are muted"}])
                    e.target[0].value = ''
                }
            }
        }
    }
    
    useEffect ( () => {
        if (userData.nickname === msg_sender) {
            scrollToBottom()
            setAlertNewMessage(false)
        }
    }, [chatBoxMessages])

    const addmsg = (msg) => {
        setRooms(_rooms => {
          let temp = _rooms.find(o => o.id === msg.roomId)
          if (temp) {
              temp?.msgs.push({user:msg.user, msg:msg.msg})
              temp.lastmsg = {user:msg.user, msg:msg.msg}
          }
            
          setConvs(_rooms)
          return _rooms
        })
        if (rooms.find(o => o.id === activeUserConv.id)?.id == msg.roomId) {
          setChatBoxMessages((old:any) => [...old, {user:msg.user, msg:msg.msg, id:msg.idOfmsg}])
        }
        else{
            rooms.find(o => o.id === msg.roomId).pending = true
            console.log("*******", rooms.find(o => o.id === msg.roomId))
            setRefresh(old => !old)
        }
    }
    
    useEffect( () => {
    // if (msg_sent) {
        socket.on('add-message', addmsg)
        return () => socket.off('add-message', addmsg)
    // }
    },[chatBoxMessages])

    return (
        <div className={'flex flex-col items-center justify-center rounded-3xl ' + (deviceType === 'normal' ? 'h-[90vh] w-[calc(120%/2)] ' : ' h-[100%] w-[100%] absolute ' +  (showConv ? 'bg-darken-200' : 'hidden'))}>
            {activeUserConv.name && <RoomInfo setAlertText={setAlertText} setShowAlert={setShowAlert} allUsers={allUsers} room={rooms.find(o => o.id === activeUserConv.id)} setShow={setShowInfo} show={showInfo} userData={userData} />}
            { showConv && <>
                <div className="h-[80px] z-0 flex items-center justify-between text-white pl-10 py-4 w-[100%] border-blue-gray-200 text-blue-gray-700 outline border-b outline-0 placeholder-shown:border-blue-gray-200 focus:outline-0">
                    <div className=' min-w-[150px] bg-zinc-800 rounded-l-3xl pr-2 rounded-r-xl flex items-center gap-3 justify-start w-auto h-auto cursor-pointer hover:underline' onClick={() => {
                        if (rooms.find(o => o.id === activeUserConv.id).type != 'DM')
                            setShowInfo(true)
                        else {
                            console.log(activeUserConv.name)
                            setUserInfoNick(activeUserConv.name)
                            setShowUserInfos(true)
                        }
                        }}>
                        <Avatar zoomed text={activeUserConv.name} bordered color={'gradient'} alt={activeUserConv.name} src={rooms.find(o => o.id === activeUserConv.id)?.photo} pointer/>
                        <div className='w-full flex items-center justify-center'>{activeUserConv.name}</div>
                    </div>
                    {deviceType != 'normal' && <button className='w-9 h-9 border border-blue-800 bg-blue-700 text-whiteSmoke hover:scale-110 hover:bg-whiteSmoke hover:text-blueStrong focus:outline-none focus:ring-blue-300 font-bold rounded-full text-lg flex text-center justify-center items-center mr-5' onClick={() => {setShowConv(false); setActiveUserConv({
                        name: '.',
                        photo: '',
                        lastmsg: '', 
                        id: 0,
                    }); setChatBoxMessages([])}}>x</button>}
                </div>

                <div id='chatbox' className='relative flex flex-col w-full mt-8 overflow-y-scroll basis-[80%]'>
                    <ChatBox activeUserConv={activeUserConv}/>
                </div>

                <div className='h-[8%] w-[90%] flex items-center justify-center'>
                    <div className='w-full h-[70%] rounded-[100px] bg-zinc-800 flex items-center justify-between'>
                        <form onSubmit={sendMessage} id='form' className='w-[98%]'>
                            <input ref={msgInputRef} onFocus={e => e.target.placeholder = ''} onBlur={e => e.target.placeholder = 'Type a message...'} autoComplete="off" placeholder='Type a message...' type="text" id="message" className="transition-all delay-100 duration-100 outline outline-0 bg-transparent  p-5 text-gray-100 text-xs sm:text-base focus:ring-blue-500 focus:border-blue-500 w-[100%]"/>
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
    )
}

export default Conversation

// auto MATA