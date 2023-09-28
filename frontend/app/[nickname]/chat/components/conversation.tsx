import React, { useContext, useEffect, useRef, useState } from 'react'
import Context from './Context'
import ChatBox from './ChatBox'
import RoomInfo from './roomInfo'
import {Avatar} from '@nextui-org/react'
import { LuMessagesSquare } from 'react-icons/lu'
import { GrEmoji } from 'react-icons/gr'
import Emojis from './Emojis'
import {useRouter} from 'next/navigation'

interface ConversationProps {
    activeUserConv: any
    deviceType: string
    setShowConv: any
    showConv: boolean
    setActiveUserConv: any,
    setAlertText: any,
    setShowAlert: any
}

const Conversation:React.FC<ConversationProps> = ( { activeUserConv, deviceType, setShowConv, showConv, setActiveUserConv, setShowAlert, setAlertText } ) => {
    
    const [showInfo, setShowInfo] = useState(false)
    
    const [msg_sender, set_msg_sender] = useState('')

    const [showEmojis, setShowEmojis] = useState(false)
    
    const {setAlertNewMessage, scrollToBottom, chatBoxMessages, rooms, socket, setRefresh,
        userData, setChatBoxMessages, setShowUserInfos, setUserInfoNick, setUserInfoId, msgInputRef, setRooms, setConvs} = useContext(Context)

    const sendMessage = (e) => {
        e.preventDefault()
        const msg = e.target[0].value.trim()
        if (msg != '') {
            var _user = rooms.find(o => o.id === activeUserConv.id)?.users.find(o => o.nickName === userData.nickname)
            if (_user) {
                if (_user.isMuted === 'UNMUTED') {
                    socket.emit('send-message', {message:msg, roomId:rooms.find(o => o.id === activeUserConv.id)?.id})
                    e.target[0].value = ''
                    set_msg_sender(userData.nickname)
                }
                else {
                    setChatBoxMessages(old => [...old, {userId: 'bot', msg : "You are muted"}])
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

    const _router = useRouter()

    const addmsg = (msg) => {
        localStorage.setItem('notifyChat', userData.id)
        setRooms(_rooms => {
          let temp = _rooms.find(o => o.id === msg.roomId)
          if (temp) {
              temp?.msgs.push({userId:msg.user, msg:msg.msg})
              temp.lastmsg = {userId:msg.userId, msg:msg.msg}
          }

          setConvs(_rooms)
          return _rooms
        })
        if (rooms.find(o => o.id === activeUserConv.id)?.id == msg.roomId) {
          setChatBoxMessages((old:any) => [...old, {userId:msg.userId, msg:msg.msg, id:msg.idOfmsg}])
        }
        else{
            if (rooms.find(o => o.id === msg.roomId)) rooms.find(o => o.id === msg.roomId).pending = true
            setRefresh(old => !old)
        }
        if (msg.msg === '%GameInvite%' && activeUserConv.type === 'DM'){
            let id = rooms.find(o => o.id === activeUserConv.id)?.users[0].id
            if (id === userData.id) {
                id = rooms.find(o => o.id === activeUserConv.id)?.users[1].id
                _router.push(`/${userData.nickname}/game?id=${id}`)
            }
        }
    }
    
    useEffect( () => {
    // if (msg_sent) {
        socket.on('add-message', addmsg)
        return () => socket.off('add-message', addmsg)
    // }
    },[chatBoxMessages])

    return (
        <div className={'transition-all flex flex-col items-center justify-center rounded-3xl ' + (deviceType === 'normal' ? 'h-[90vh] w-[calc(120%/2)] ' : ' h-[100%] w-[100%] absolute ' +  (showConv ? 'bg-darken-200' : 'hidden'))}>
            {activeUserConv.name && <RoomInfo room={rooms.find(o => o.id === activeUserConv.id)} setShow={setShowInfo} show={showInfo} userData={userData} activeUserConv={activeUserConv} setActiveUserConv={setActiveUserConv} />}
            { showConv ? <>
                <div className="h-[80px] z-0 flex items-center justify-between text-white pl-10 py-4 w-[100%] border-blue-gray-200 text-blue-gray-700 outline border-b outline-0 placeholder-shown:border-blue-gray-200 focus:outline-0">
                    <div className=' min-w-[150px] bg-zinc-800 rounded-l-3xl pr-2 rounded-r-xl flex items-center gap-3 justify-start w-auto h-auto cursor-pointer hover:underline' onClick={() => {
                        if (rooms.find(o => o.id === activeUserConv.id)?.type != 'DM')
                            setShowInfo(true)
                        else {
                            setUserInfoNick(activeUserConv.name)
                            setUserInfoId(rooms.find(o => o.id === activeUserConv.id)?.users.find(o => o.nickName === activeUserConv.name)?.id)
                            setShowUserInfos(true)
                        }
                        }}>
                        <Avatar zoomed text={activeUserConv.name} bordered color={'gradient'} alt={activeUserConv.name} src={rooms.find(o => o.id === activeUserConv.id)?.photo} pointer/>
                        <div className='w-full flex items-center justify-center'>{activeUserConv.name}</div>
                    </div>
                    {deviceType != 'normal' && <button className='w-9 h-9 border border-blue-800 bg-blue-700 text-whiteSmoke hover:scale-110 hover:bg-whiteSmoke hover:text-blueStrong focus:outline-none focus:ring-blue-300 font-bold rounded-full text-lg flex text-center justify-center items-center mr-5' onClick={() => {setShowConv(false); setActiveUserConv({
                        name: '.',
                        photo: '',
                        lastmsg: {userId: '', msg: ''}, 
                        id: 0,
                    }); setChatBoxMessages([])}}>x</button>}
                </div>

                <div id='chatbox' className='relative flex flex-col w-full mt-8 overflow-y-auto basis-[80%] scrollbar-thin scrollbar-track-darken-300 scrollbar-thumb-whiteSmoke scrollbar-corner-black'>
                    <ChatBox activeUserConv={activeUserConv}/>
                </div>

                <div className='relative h-[8%] w-[90%] flex items-center justify-center'>
                    <Emojis showEmojies={showEmojis} setShowEmojies={setShowEmojis} className={'transition-all duration-300 ' + (showEmojis ? 'visible w-64 h-64 bg-darken-300 rounded-xl' : ' hidden')} inputRef={msgInputRef} />
                    <div className='w-full h-18 rounded-[100px] bg-zinc-800 flex items-center justify-between'>
                        <div className='transition-all flex justify-center items-center text-whiteSmoke ml-3 rounded-full cursor-pointer hover:scale-110 hover:text-slate-400' onClick={() => {setShowEmojis(old => !old); msgInputRef.current.focus()}}>
                            <GrEmoji size={30}/>
                        </div>
                        <form onSubmit={sendMessage} id='form' className='w-[98%]'>
                            <input maxLength={1000} ref={msgInputRef} onFocus={e => e.target.placeholder = ''} onBlur={e => {e.target.placeholder = 'Type a message...'}} autoComplete="off" placeholder='Type a message...' type="text" id="message" className="transition-all delay-100 duration-100 outline outline-0 bg-transparent  p-5 text-gray-100 text-xs sm:text-base focus:ring-blue-500 focus:border-blue-500 w-[100%]"/>
                        </form>
                        <div className='transition-all hover:scale-110 w-12 h-11 flex items-center justify-center'>
                            <button type='submit' form='form' className=' border-blue-500 border-[6px] w-11 h-9 bg-blue-500 rounded-full mr-3 flex items-center justify-end cursor-pointer'>
                                <img className='w-auto h-auto' src="/images/send.svg" alt="send" width={150} height={150}/>
                            </button>
                        </div>
                    </div>
                </div>
            </> :
            <div className='w-full h-full flex flex-col items-center justify-center text-whiteSmoke opacity-50'>
                <LuMessagesSquare size={60}/>
                <span className='font-bold text-2xl'>...</span>
            </div> }
        </div>
    )
}

export default Conversation

// auto MATA