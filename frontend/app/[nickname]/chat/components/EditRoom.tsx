import React, { useState } from 'react'

interface EditRoomProps {
  _setNewName: any
  _setNewPass: any
  changeRoomType: any
  roomType: string
}

const EditRoom:React.FC<EditRoomProps> = ({_setNewName, _setNewPass, roomType, changeRoomType}) => {

    const [newName, setNewName] = useState('')
    const [newPass, setNewPass] = useState('')
    const [showPassInput, setShowPassInput] = useState(false)

  return (
    <div className=''>
      <form className='flex justify-between items-center' noValidate onSubmit={(e) => { _setNewName(e, newName) }}>
        <div className='relative m-4'>
          <input autoComplete='off' value={newName} type="text" name="_name" id="_name" className="text-gray-300 text-xs lg:text-base block py-2.5 px-0 w-full bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " onChange={(e) => setNewName(e.target.value)}/>
          <label htmlFor="_name" className="text-xs lg:text-sm peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">New Name</label>
        </div>
        <button type="submit" className="w-[10.4rem] text-white bg-blueStrong hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center">change name</button>
      </form>

      {roomType === 'PROTECTED' ? <>
        <form className='flex justify-between items-center' noValidate onSubmit={(e) => { _setNewPass(e, newPass) }}>
          <div className='relative m-4'>
            <input autoComplete='off' value={newPass} type="password" name="_pass" id="_pass" className="text-gray-300 text-xs lg:text-base block py-2.5 px-0 w-full bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " onChange={(e) => setNewPass(e.target.value)}/>
            <label htmlFor="_pass" className="text-xs lg:text-sm peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">NewPassword</label>
          </div>
          <button type="submit" className="w-[10.4rem] text-white bg-blueStrong hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center">change password</button>
        </form>
        <div className='text-sm flex items-center justify-center'>
          <button type='button' className="w-[10.4rem] text-white bg-blueStrong hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg px-5 py-2.5 text-center text-xs" onClick={() => {changeRoomType('public')}}>make room public</button>
        </div>
      </> :
        <div className='flex justify-center items-center'>
          {!showPassInput ? <div className='text-sm flex items-center justify-center'>
            <button type='button' className="w-[10.9rem] text-white bg-blueStrong hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg px-5 py-2.5 text-center text-xs" onClick={() => {setShowPassInput(true)}}>make room protected</button>
          </div> :
          
          <div className='relative flex items-center gap-5 font-thin'>
            <input autoComplete='off' value={newPass} type="password" name="_pass" id="_pass" className="text-gray-300 text-xs lg:text-base block py-2.5 px-0 w-full bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " onChange={(e) => setNewPass(e.target.value)}/>
            <label htmlFor="_pass" className="text-xs lg:text-sm peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">new password</label>
            <button type='button' className="w-[12rem] text-white bg-blueStrong hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg px-5 py-2.5 text-center text-xs" onClick={() => {changeRoomType(newPass)}}>set Password</button>
          </div>
          }

        </div>
      }
    </div>
  )
}

export default EditRoom