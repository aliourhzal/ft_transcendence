import React, { useState } from 'react'
import { BiUserX } from 'react-icons/Bi'

interface BanProps {
    banUser: any
    user: any,
}

const Ban:React.FC<BanProps> = ( { banUser, user } ) => {

    const [showDuration, setShowDuration] = useState(false)
    const [banDurationType, setBanDurationType] = useState('')
    const [banDuration, setBanDuration] = useState<number>(0)

  return (
    <>
    <BiUserX className='hover:text-whiteSmoke text-blueStrong' title='ban' aria-label='ban' cursor="pointer" size={30} onClick={() => {setShowDuration(old => !old)}}/>
    {showDuration && 
        <div>
            <span>select ban duration</span>
            <input type='number' onChange={ (e) => { setBanDuration(+e.target.value) }}/>
            <select name="banDuration" id="banDuration" onChange={(e) => { setBanDurationType(e.target.value) }}>
                <option>select unit</option>
                <option value={"hours"}>hours</option>
                <option value={"days"}>days</option>
                <option value={"permanent"}>permanent</option>
            </select>
            <button type="button" className="w-auto text-white bg-red-900 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={() => {
                banUser(user.id, banDuration, banDurationType)
                setBanDuration(0)
                setBanDurationType('')
                setShowDuration(old => !old)
            }}>confirm</button>
        </div>
    }
    </>
  )
}

export default Ban