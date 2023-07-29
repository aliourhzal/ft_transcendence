import React, { useContext, useState } from 'react'
import { Context } from '../page'
import axios from 'axios'
import { useSSR } from '@nextui-org/react'

const JoinRoomForm = () => {

    const {showJoinForm, setShowJoinForm, convs, socket} = useContext(Context)

    const [name, setName] = useState('')
    const [pass, setPass] = useState('')



    const submitForm = () => {
        setShowJoinForm(false)
    }

  return (
    showJoinForm &&
        <div className='z-10 fixed flex justify-center items-center w-[100%] h-[100vh] min-w-[500px]'>
            <div className='w-[30%] h-[30vh] p-6 bg-slate-600 rounded-2xl flex flex-col items-center justify-center'>
            <button type="button" className="ml-[auto] mb-5 w-9 h-9 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg flex text-center justify-center items-center" onClick={() => setShowJoinForm(false)}>x</button>
                <h1>Join Chatroom</h1>
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
                <button type="button" className="w-auto text-white bg-blue-700 hover:bg-blue-800 focus:bg-blue-600 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={ () => {
                    axios.post('http://127.0.0.1:3000/join-room', {name:name, pass:pass, auth:socket.auth['token']}, {withCredentials: true})
                    submitForm()
                }}>Submit</button>
            </div>
        </div>
  )
}

export default JoinRoomForm