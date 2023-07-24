"use client"

import { useContext, useState } from "react"
import { Context } from '../page'
import { userDataContext } from "../../layout"
import axios from "axios"

const RoomForm = (props:any) => {
    const {showConv, setShowConv, activeUserConv, setActiveUserConv} = useContext(Context)
    const userData = useContext(userDataContext);
    // const [roomInfo, setRoomInfo] = useState({name:'', users:[], password:''})
    const [roomName, setName] = useState('')
    const [users, setUsers] = useState<string[]>([])
    const [user, setUser] = useState('')
    const hideForm = () => {
        props.setShowForm(false)
        var temp = document.getElementById('main')
        temp ? temp.style.filter = 'blur(0)' : ''
    }
    return (
        props.showForm &&
        <div className='z-50 absolute flex justify-center items-center w-[100%] bg-transparent h-[100vh]'>
            <div className='w-[50%] lg:w-[30%] mb-[20%] transition-transform duration-300'>
                <button className=' ml-[90%] bg-blue-500 text-white rounded-full w-7' type='button' onClick={ hideForm }>X</button>
                <div className='text-center text-3xl mb-2'><h1>Create Chatroom</h1></div>
                <div className="relative z-0 w-full mb-6 group">
                    <input value={roomName} type="text" name="floating_text" id="floating_text" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required 
                    onChange={(e) => {setName(e.target.value)}}/>
                    <label htmlFor="floating_text" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Name</label>
                </div>
                <div className="relative z-0 w-full mb-6 group">
                    <input type="text" name="floating_desc" id="floating_desc" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="floating_desc" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Description</label>
                </div>
                <div className="flex relative z-0 w-full mb-6 group">
                    <input value={user} type="text" name="user" id="user" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required 
                    onChange={
                        (e) => setUser(e.target.value)
                    }/>
                    <label htmlFor="user" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Search user by username</label>
                    <button className='ml-[10%] w-[40%] px-1 relative bg-sky-900 text-gray-300 rounded-full' onClick={
                        () => {
                            var tempusers = users
                            tempusers.push(user)
                            setUsers(tempusers)
                            setUser('')
                        }
                    }>Add user</button>
                </div>
                <div className="flex relative z-0 w-full mb-6 group">
                <input type="password" name="password" id="password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password (optional)</label>
                </div>
                <button type="button" className=" w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={
                
                () => {
                    userData.chatSocket.emit("create-room",{roomName, users, auth: userData.chatSocket.auth}) 
                    
                    // userData.chatSocket.on('error',(error:string) => {console.log(error)})

                    setName(''); setUser(''); setUsers([])
                    hideForm()
                // window.alert()
                }
                }>Submit</button>
            </div>
        </div>
    )
}

export default RoomForm