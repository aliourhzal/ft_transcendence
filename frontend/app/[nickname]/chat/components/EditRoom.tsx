import React, { useState } from 'react'

interface EditRoomProps {
    editRoom: any
}

const EditRoom:React.FC<EditRoomProps> = ({editRoom}) => {

    const [newName, setNewName] = useState('')
    const [newPass, setNewPass] = useState('')

  return (
    <form noValidate onSubmit={(e) => { editRoom(e, newName, newPass) }}>
      <div className='relative m-4'>
        <input autoComplete='off' value={newName} type="text" name="_name" id="_name" className="text-gray-300 text-xs lg:text-base block py-2.5 px-0 w-full bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " onChange={(e) => setNewName(e.target.value)}/>
        <label htmlFor="_name" className="text-xs lg:text-sm peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">New Name</label>
      </div>

      <div className='relative m-4'>
        <input autoComplete='off' value={newPass} type="password" name="_pass" id="_pass" className="text-gray-300 text-xs lg:text-base block py-2.5 px-0 w-full bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " onChange={(e) => setNewPass(e.target.value)}/>
        <label htmlFor="_pass" className="text-xs lg:text-sm peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">NewPassword</label>
      </div>

      <div className='w-full flex items-center justify-center'>
        <button type="submit" className="w-auto text-white bg-blueStrong hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Confirm</button>
      </div>
    </form>
  )
}

export default EditRoom