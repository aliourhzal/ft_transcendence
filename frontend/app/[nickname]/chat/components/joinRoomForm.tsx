import React, { useContext } from 'react'
import { Context } from '../page'

const JoinRoomForm = () => {

    const {showJoinForm, setShowJoinForm} = useContext(Context)

  return (
    <div className='fixed flex justify-center items-center w-[100%] h-[100vh] min-w-[500px]'>
        <div className='w-[30%] h-[30vh] p-6 bg-slate-600 rounded-2xl flex flex-col items-center justify-center'>
            <h1>Join Chatroom</h1>
            <div className="relative z-0 w-full mb-6 group">
                <input aria-required='true' type="text" name="floating_text" id="floating_text" className=" text-gray-950 font-bold block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-black appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer" placeholder=" "/>
                <label htmlFor="floating_text" className="text-xs lg:text-base peer-focus:font-medium absolute text-black duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Name</label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
                <input aria-required='true' type="password" name="pass" id="pass" className=" text-gray-950 font-bold block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-black appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer" placeholder=" "/>
                <label htmlFor="pass" className="text-xs lg:text-base peer-focus:font-medium absolute text-black duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">password</label>
            </div>
            <button type="button" className="w-auto text-white bg-blue-700 hover:bg-blue-800 focus:bg-blue-600 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" >Submit</button>
        </div>
    </div>
  )
}

export default JoinRoomForm