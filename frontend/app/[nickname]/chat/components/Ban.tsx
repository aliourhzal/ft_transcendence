import React, { useState } from 'react'
import { BiUserX } from 'react-icons/bi'

interface BanProps {
    banUser: any
    user: any,
}

const Ban:React.FC<BanProps> = ( { banUser, user } ) => {

    const [showDuration, setShowDuration] = useState(false)
    const [banDuration, setBanDuration] = useState('')

  return (
    <>
    <BiUserX aria-label='ban' cursor="pointer" size={30} onClick={() => {setShowDuration(old => !old)}}/>
    {showDuration && 
        <div className='z-20 p-2 bg-gray-800 rounded-xl flex flex-col justify-center items-center h-20 text-sm w-[104px] absolute'>
            <select name="banDuration" id="banDuration" className='flex items-center justify-center h-12 w-full p-2 mb-1 text-xs text-whiteSmoke border bg-darken-300 border-gray-300 rounded-lg  focus:ring-blue-500 focus:border-blue-500' onChange={(e) => { setBanDuration(e.target.value) }}>
                <option>select duration</option>
                <option value={"2"}>2 mins</option>
                <option value={"1"}>1 hour</option>
                <option value={"8"}>8 hour</option>
                <option value={"permanent"}>permanent</option>
            </select>
            <button type="button" className="w-16 h-7 text-xs flex items-center justify-center text-white bg-red-900 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg  py-2.5 text-center" onClick={() => {
                banUser(user.id, banDuration)
                setBanDuration('')
                setShowDuration(old => !old)
            }}>confirm</button>
        </div>
    }
    </>
  )
}

export default Ban