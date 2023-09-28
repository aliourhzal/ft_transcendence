import React, { useContext, useState } from 'react'
import  Context  from './Context'
import { BiVolumeFull, BiVolumeMute } from 'react-icons/bi'

interface MuteProps {
    muteUser: any,
    unMuteUser: any,
    user: any,
    _state: string,
}

const Mute:React.FC<MuteProps> = ( { muteUser, unMuteUser, user, _state } ) => {

    const [showDuration, setShowDuration] = useState(false)
    const [muteDuration, setMuteDuration] = useState('')

  return (
     _state === 'UNMUTED' ? <>
    <BiVolumeMute aria-label='mute' cursor="pointer" size={25} onClick={ () => { setShowDuration(old => !old) }}/>
    {showDuration && 
        <div className='z-20 p-2 bg-gray-800 rounded-xl flex flex-col justify-center items-center h-20 text-sm w-[104px] absolute'>
            <select name="banDuration" id="banDuration" className='flex items-center justify-center h-12 w-full p-2 mb-1 text-xs text-whiteSmoke border bg-darken-300 border-gray-300 rounded-lg  focus:ring-blue-500 focus:border-blue-500 ' onChange={(e) => { setMuteDuration(e.target.value) }}>
                <option>duration</option>
                <option value={"2"}>2 mins</option>
                <option value={"1"}>1 hour</option>
                <option value={"8"}>8 hour</option>
                <option value={"permanent"}>permanent</option>
            </select>
            <button type="button" className="w-16 h-7 text-xs flex items-center justify-center text-white bg-red-900 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg  py-2.5 text-center" onClick={() => {
                muteUser(user.id, muteDuration)
                setMuteDuration('')
                setShowDuration(old => !old)
            }}>confirm</button>
        </div>
    }
    </> :
    <BiVolumeFull title='unmute' aria-label='unmute' cursor="pointer" size={25} onClick={() =>{ unMuteUser(user.id) }}/>
  )
}

export default Mute