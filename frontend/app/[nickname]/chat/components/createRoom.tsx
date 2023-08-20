import { useContext, useEffect, useState } from "react"
import { Context, getUsersInfo } from '../page'
import axios from "axios"
import AddedUsersForm from "./addedUsersForm"
import { METHODS } from "http"
import { Socket } from "socket.io-client"
import Popup from "./Popup"
import { getCookie } from "../../layout"
import { StyledInput } from "@nextui-org/react"

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
        setName(''); setUser(''); setUsers([]); setPass(''); setRoomType('PUBLIC'); setPrivate(false)
    }

    useEffect ( () => {
        if (pass != '')
            setRoomType('PROTECTED')
        else if (isPrivate)
            setRoomType('PRIVATE')
        else
            setRoomType('PUBLIC')
    }, [roomType, pass, isPrivate])
    
    useEffect(() => {
        socket.on('new-room', (res) => {
            console.log(res)
            rooms.unshift({
                name: res.room.room.room_name,
                lastmsg:'welcome to group chat',
                msgs: [],
                id: res.room.room.id,
                users: getUsersInfo(res.userInfos),
                type: res.room.room.roomType
            })
            set_room_created(old => !old)
        })
    }, [])
    
    const confirmForm = async (e) => {
        e.preventDefault()
        if (roomName != '' && users.length) {
            hideForm()
            socket.emit('create-room', {roomName:roomName, users:users, type:roomType, password:pass})
        }
    }

    const handleSpaceDown = (e:any) => {
        if (e.key === ' ')
            addUser()
    }
    
    const addUser = () => {
        if (user.trim() != '') {
            setUsers(old => [...old, user.trim()])
        }
        setUser('')
    }

    return (
        <Popup isOpen={showForm} modalAppearance={hideForm}>
            <div className='absolute top-[6%] text-center text-2xl mb-2 drop-shadow-[0px_0px_5px_rgba(150,150,150,0.7)]'><h1>Create Chatroom</h1></div>
            <form noValidate id="roomform" onSubmit={confirmForm}>
                <div className="relative z-0 w-full mb-6 group">
                    <input aria-required='true' autoComplete='off' value={roomName} type="text" name="floating_text" id="floating_text" className="text-gray-300 block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required 
                    onChange={(e) => {setName(e.target.value)}}/>
                    <label htmlFor="floating_text" className="text-xs lg:text-sm peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Name</label>
                </div>
                <div className="relative z-0 w-full mb-6 group">
                    <input autoComplete='off' type="text" name="floating_desc" id="floating_desc" className="text-gray-300 block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="floating_desc" className="text-xs lg:text-sm peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Description</label>
                </div>
                <div className="flex relative z-0 w-full mb-6 group">
                    <input formNoValidate autoComplete='off' value={user} type="text" name="user" id="user" className="text-gray-300 text-xs lg:text-base block py-2.5 px-0 w-full bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required 
                    onChange={
                        (e) => setUser(e.target.value)
                    } onKeyDown={(e) => {
                        handleSpaceDown(e)
                    }}/>
                    <label htmlFor="user" className="text-xs lg:text-sm peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Search user by nickname</label>
                    <button className='ml-[10%] w-[40%] px-1 relative bg-sky-900 text-gray-300 rounded-full' onClick={addUser}>Add user</button>
                </div>

                <AddedUsersForm users={users} setUsers={setUsers}/>

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
                    <label htmlFor="password" className="peer-focus:font-medium absolute text-xs lg:text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password (optional)</label>
                </div>

                <button type="submit" form="roomform" className="w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={confirmForm} disabled={roomName != '' && users.length ? false : true} >Submit</button>
                    </form>
        </Popup>
    )
}

export default RoomForm