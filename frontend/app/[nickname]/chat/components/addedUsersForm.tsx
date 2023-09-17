import React, { useState } from 'react'
import { gimmeRandom } from './Context'
import { off } from 'process'

interface AddedUsersFormProps {
    users: string[]
    setUsers: any
}

const AddedUsersForm: React.FC<AddedUsersFormProps> = (users) => {
  const [renderLmk, forceRenderLmk] = useState<boolean>(false)
  return (
    <div className='flex items-center gap-3 flex-wrap'>
        {users.users.map( user => (
        <div className='bg-gray-300 rounded-lg flex justify-center items-center gap-2 p-2' key={gimmeRandom()}>
            <div className='font-bold'>{user}</div>
            <button type="button" className="w-6 h-6 text-gray-700 border border-gray-700 hover:bg-gray-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-lg flex text-center justify-center items-center" onClick={ () => {
              var temp = users.users
              temp.splice(temp.indexOf(user), 1)
              users.setUsers(temp)
              forceRenderLmk(old => !old)
            }}>x</button>
        </div>) )}
    </div>
  )
}

export default AddedUsersForm