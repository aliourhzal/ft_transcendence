import React, { useContext, useEffect, useState } from 'react'
import Context from './Context'

const AlertMsgDown = () => {

    const {alertNewMessage, setAlertNewMessage, chatBoxMessages, scrollToBottom} = useContext(Context)

    let temp = document.getElementById('chatbox')

    useEffect ( () => {
    if (temp) {
        if (temp.scrollTop < temp.scrollHeight - 900) {
            setAlertNewMessage(true)
        }
        else {
            setAlertNewMessage(false)
            scrollToBottom()
        }
    }
    }, [chatBoxMessages, temp])

  return (
    alertNewMessage &&
    <div className='top-[83%] left-[95%] absolute z-10 h-10 flex justify-end items-center'>
        <div className='sticky cursor-pointer text-darken-100 z-10 text-xl bg-whiteSmoke w-7 h-7 flex items-center rounded-full justify-center font-bold animate-bounce' onClick={() => {
            scrollToBottom()
            setAlertNewMessage(false)
        }}>⬇</div>
    </div>
  )
}

export default AlertMsgDown