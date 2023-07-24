import React from 'react'

interface AddedUsersFormProps {
    users: string[]
}

const AddedUsersForm: React.FC<AddedUsersFormProps> = (users) => {
  return (
    <div className='flex justify-start items-start'>
        {users.users.map( user => (
        <div className='bg-gray-300 rounded-lg w-[30%] m-2 text-center flex items-center'>{user}
            <button type="button" className="ml-[100%] bg-white rounded-s-sm p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 w-10 h-10">x
            </button>
        </div>) )}
    </div>
  )
}

export default AddedUsersForm