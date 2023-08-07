import React, { useContext, useState } from 'react'
import { Context } from '../page'
import axios from 'axios'
import Popup from './Popup'

const JoinRoomForm = () => {

    const {showJoinForm, setShowJoinForm, convs, socket, rooms, set_room_created} = useContext(Context)

    const [name, setName] = useState('')
    const [pass, setPass] = useState('')

    // const selectDivToHide = (e) => {
    //     if (e.target.id === 'big_div')
    //         hideForm()
    // }

    const getUsersInfo = (users) => {
        let _users: {
                id: string, 
                nickName: string,
                firstName: string,
                lastName: string,
                photo?: string,
                type: "OWNER"| "ADMIN" | "USER",
                isBanned: boolean
            }[] = []
        // console.log(users)
        users.map( (user) => {
            _users.push(
                {
                id: user.user.userId,
                nickName: user.user.nickname,
                firstName: user.user.firstName,
                lastName: user.user.lastName,
                photo: user.user.profilePic,
                type: user.userType,
                isBanned: user.isBanned,
                }
            )
            } 
        )
            return (_users)
    }

    const hideForm = () => {
        setShowJoinForm(false)
        setName(''); setPass('')
    }

    const submitForm = () => {
        
        socket.emit('join-room', {roomName:name, password:pass, user:socket.auth['token'], socketId:socket.id })
        // try {
        //     axios.post('http://127.0.0.1:3000/rooms/join-room', {roomName:name, password:pass, auth: socket.auth['token']}, {withCredentials: true}).then(
        //         res => {
        //             rooms.unshift({
        //                 name: res.data.room.room_name,
        //                 last_msg:'welcome to group chat',
        //                 msgs: [],
        //                 id: res.data.room.id,
        //                 users: getUsersInfo(res.data.usersInfos),
        //                 type: res.data.room.roomType
        //             })
        //         }
        //     )
        //     set_room_created(old => !old)
        // }
        // catch(error) {
        //     console.log(error.data)
        // }
        setShowJoinForm(false)
    }

  return (
    <Popup  isOpen={showJoinForm} modalAppearance={hideForm}>
        <h1 className='text-center font-bold text-2xl mb-2 drop-shadow-[0px_0px_5px_rgba(255,255,255,1)]'>Join Chatroom</h1>
        <div className="relative z-0 w-full mb-6 group">
            <input value={name} autoComplete='off' aria-required='true' type="text" name="floating_text" id="floating_text" className=" text-gray-950 font-bold block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-black appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer" placeholder=" " onChange={
                (e) => setName(e.target.value)
            }/>
            <label htmlFor="floating_text" className="text-xs lg:text-base peer-focus:font-medium absolute text-black duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Name</label>
        </div>
        <div className="relative z-0 w-full mb-6 group">
            <input value={pass} aria-required='true' type="password" name="pass" id="pass" className=" text-gray-950 font-bold block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-black appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer" placeholder=" " onChange={
                (e) => setPass(e.target.value)
            }/>
            <label htmlFor="pass" className="text-xs lg:text-base peer-focus:font-medium absolute text-black duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">password</label>
        </div>
        <button type="button" className=" w-auto text-white bg-blue-700 hover:bg-blue-800 focus:bg-blue-600 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={ submitForm }>Submit</button>
    </Popup>
  )
}

export default JoinRoomForm