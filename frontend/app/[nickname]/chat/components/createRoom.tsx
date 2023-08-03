import { useContext, useEffect, useState } from "react"
import { Context } from '../page'
import axios from "axios"
import AddedUsersForm from "./addedUsersForm"
import { METHODS } from "http"
import { Socket } from "socket.io-client"

const RoomForm = () => {
     
    const {showConv, setShowConv, activeUserConv, setActiveUserConv, showForm, setShowForm, socket, setConvs, set_room_created, setRooms, rooms} = useContext(Context)
    // const [roomInfo, setRoomInfo] = useState({name:'', users:[], password:''})
    const [roomName, setName] = useState('')
    const [users, setUsers] = useState<string[]>([])
    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')
    const [isPrivate, setPrivate] = useState(false)
    const [roomType, setRoomType] = useState('PUBLIC')

    const hideForm = () => {
        setShowForm(false)
        var temp = document.getElementById('main')
        temp ? temp.style.filter = 'blur(0)' : ''
        setName(''); setUser(''); setUsers([]); setPass(''); setRoomType('PUBLIC'); setPrivate(false)
        set_room_created(old => !old)
    }

    useEffect ( () => {
        if (pass != '')
            setRoomType('PROTECTED')
        else if (isPrivate)
            setRoomType('PRIVATE')
        else
            setRoomType('PUBLIC')
        }, [roomType, pass, isPrivate])
        
    const confirmForm = async () => {
        try {
            await axios.post('http://127.0.0.1:3000/rooms', {roomName:roomName, users:users, auth: socket.auth['token'], type:roomType, password:pass},
                                                            {withCredentials: true, headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}}).then(
                                                                response => {
                                                                    console.log(response)
                                                                    rooms.unshift({
                                                                        name: "room.room.room.room_name",
                                                                        last_msg:'welcome to group chat',
                                                                        msgs: [],
                                                                        id: "room.room.room.id",
                                                                        users: [],
                                                                        type: "room.room.room.roomType"
                                                                    })
                                                                    hideForm()
                                                                })
        } catch(error) {
            alert(error)
        }
    }
    return (
        showForm &&
                <div className='fixed flex bg-darken-300 items-center justify-center w-[50%] min-w-[450px] z-10' onBlur={() => hideForm}>
                    <div className="w-[80%] border-4 rounded-lg px-10 pb-12 border-white">
                    <button type="button" className="ml-[auto] mb-5 w-9 h-9 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg flex text-center justify-center items-center" onClick={hideForm}>x</button>
                        <div className='text-center text-3xl mb-2 drop-shadow-[0px_0px_5px_rgba(255,255,255,1)]'><h1>Create Chatroom</h1></div>
                            <div className="relative z-0 w-full mb-6 group">
                                <input aria-required='true' autoComplete='off' value={roomName} type="text" name="floating_text" id="floating_text" className="text-gray-300 block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required 
                                onChange={(e) => {setName(e.target.value)}}/>
                                <label htmlFor="floating_text" className="text-xs lg:text-base peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Name</label>
                            </div>
                            <div className="relative z-0 w-full mb-6 group">
                                <input autoComplete='off' type="text" name="floating_desc" id="floating_desc" className="text-gray-300 block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                                <label htmlFor="floating_desc" className="text-xs lg:text-base peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Description</label>
                            </div>
                            <div className="flex relative z-0 w-full mb-6 group">
                                <input autoComplete='off' value={user} type="text" name="user" id="user" className="text-gray-300 text-xs lg:text-base block py-2.5 px-0 w-full bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required 
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

                            <div className="text-gray-200 my-5">
                                <input id="checkbox" name="checkbox" type="checkbox" onChange={ () =>  {setPrivate(old => !old); setPass('')} }/>
                                <label htmlFor="checkbox" className="mx-3">private</label>
                            </div>

                            <div className="flex relative z-0 w-full mb-6 group">
                                <input disabled={isPrivate? true : false} value={pass} type="password" name="password" id="password" className="text-gray-300 block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required
                                onChange={
                                    (e) => {
                                        setRoomType('PROTECTED')
                                        setPass(e.target.value)
                                    }
                                }/>
                                <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password (optional)</label>
                            </div>
                            <button type="button" className="w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={confirmForm} >Submit</button>
                        </div>
                </div>
    )
}

export default RoomForm