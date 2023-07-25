"use client"

import { useContext, useEffect, useState } from "react"
import { Context } from '../page'
import axios from "axios"
import AddedUsersForm from "./addedUsersForm"
import { METHODS } from "http"
import { Socket } from "socket.io-client"

const RoomForm = () => {
     
    const {showConv, setShowConv, activeUserConv, setActiveUserConv, showForm, setShowForm, socket, setConvs} = useContext(Context)
    // const [roomInfo, setRoomInfo] = useState({name:'', users:[], password:''})
    const [roomName, setName] = useState('')
    const [users, setUsers] = useState<string[]>([])
    const [user, setUser] = useState('')

    const [Anim, setAnim] = useState('')

    const hideForm = () => {
        const timeOUUUT = setTimeout(() => {
            setShowForm(false)
            setAnim('')
            clearTimeout(timeOUUUT)
            var temp = document.getElementById('main')
            temp ? temp.style.filter = 'blur(0)' : ''
            setName(''); setUser(''); setUsers([])
        }, 300)
        setAnim('animate-ping-it')
    }

    const confirmForm = async () => {
        const response = await fetch('http://127.0.0.1:3000/rooms', {method:'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({roomName:roomName, users:users, auth: socket.auth['token']})})
        if (response.ok)
            hideForm()
        else console.log("wrong stuff")
    }
    return (
        showForm &&
            <div className="absolute z-10 flex justify-center flex-row flex-nowrap min-w-[80vw] w-[calc(100vw-150px)]">
                <div className={Anim ? Anim+' flex flex-col items-center justify-center w-[50vw] lg:w-[30vw] h-[100vh]'
                    : ''+' flex flex-col items-center justify-center w-[50vw] lg:w-[30vw] h-[100vh]'}>
                    <div className="mb-20 w-[60vw] lg:w-[40vw] border-4 rounded-lg px-10 pb-12 border-white" onBlur={ () => {console.log("lmao")}}>
                        <button type="button" className="ml-[100%] bg-white rounded-s-sm p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 w-10 h-10" onClick={ hideForm }>x
                        </button>
                        <div className='text-center text-3xl mb-2 drop-shadow-[0px_0px_5px_rgba(255,255,255,1)]'><h1>Create Chatroom</h1></div>
                            <div className="relative z-0 w-full mb-6 group">
                                <input aria-required='true' value={roomName} type="text" name="floating_text" id="floating_text" className="text-gray-300 block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required 
                                onChange={(e) => {setName(e.target.value)}}/>
                                <label htmlFor="floating_text" className="text-xs lg:text-base peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Name</label>
                            </div>
                            <div className="relative z-0 w-full mb-6 group">
                                <input type="text" name="floating_desc" id="floating_desc" className="text-gray-300 block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                <label htmlFor="floating_desc" className="text-xs lg:text-base peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Description</label>
                            </div>
                            <div className="flex relative z-0 w-full mb-6 group">
                                <input value={user} type="text" name="user" id="user" className="text-gray-300 text-xs lg:text-base block py-2.5 px-0 w-full bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required 
                                onChange={
                                    (e) => setUser(e.target.value)
                                }/>
                                <label htmlFor="user" className="text-xs lg:text-base peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Search user by nickname</label>
                                <button className='ml-[10%] w-[40%] px-1 relative bg-sky-900 text-gray-300 rounded-full' onClick={
                                    () => {
                                        var tempusers = users
                                    tempusers.push(user)
                                    setUsers(tempusers)
                                    setUser('')
                                }
                                }>Add user</button>
                            </div>
                            <AddedUsersForm users={users}/>
                            <div className="flex relative z-0 w-full mb-6 group">
                            <input type="password" name="password" id="password" className="text-gray-300 block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password (optional)</label>
                            </div>
                            <form onSubmit={confirmForm}>
                                <button type="submit" className="w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" >Submit</button>
                            </form>
                    </div>
                </div>
            </div>
    )
}

export default RoomForm