import React, { useState } from 'react'
import { BiUserX } from 'react-icons/Bi'

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
        <div>
            <select name="banDuration" id="banDuration" onChange={(e) => { setBanDuration(e.target.value) }}>
                <option>select duration</option>
                <option value={"2"}>2 mins</option>
                <option value={"1"}>1 hour</option>
                <option value={"8"}>8 hour</option>
                <option value={"permanent"}>permanent</option>
            </select>
            <button type="button" className="w-auto text-white bg-red-900 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={() => {
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