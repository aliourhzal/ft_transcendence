import React, { useState } from 'react'
import { BiVolumeMute } from 'react-icons/Bi'

interface MuteProps {
    muteUser: any,
    user: any,
}

const Mute:React.FC<MuteProps> = ( { muteUser, user } ) => {

    const [showDuration, setShowDuration] = useState(false)
    const [muteDuration, setMuteDuration] = useState('')

  return (
    <>
    <BiVolumeMute className='hover:text-whiteSmoke text-blueStrong' title='mute' aria-label='mute' cursor="pointer" size={25} onClick={ () => { setShowDuration(old => !old) }}/>
    {showDuration && 
        <div>
            <select name="banDuration" id="banDuration" onChange={(e) => { setMuteDuration(e.target.value) }}>
                <option>select duration</option>
                <option value={"2"}>2 mins</option>
                <option value={"1"}>1 hour</option>
                <option value={"8"}>8 hour</option>
                <option value={"permanent"}>permanent</option>
            </select>
            <button type="button" className="w-auto text-white bg-red-900 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={() => {
                muteUser(user.id, muteDuration)
                setMuteDuration('')
                setShowDuration(old => !old)
            }}>confirm</button>
        </div>
    }
    </>
  )
}

export default Mute