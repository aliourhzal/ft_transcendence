import React, { useState } from 'react'
import AddedUsersForm from './addedUsersForm';

interface NewRoomUsersProps {
    addUsers: any
}

const NewRoomUsers:React.FC<NewRoomUsersProps> = ( {addUsers} ) => {

    const [newUser, setNewUser] = useState<string>('')
    const [newUsers, setNewUsers] = useState<string[]>([])

    const handleSpaceDown = (e:any) => {
        if (e.key === ' ')
            addUser()
    }
    
    const addUser = () => {
        if (newUser.trim() != '')
            if (newUsers.length && newUser)
                if (newUsers.indexOf(newUser.trim()) == -1)
                    setNewUsers(old => [...old, newUser.trim()])
                else
                    setNewUser('')
            else
                setNewUsers(old => [...old, newUser.trim()])
        setNewUser('')
    }

  return (
    <>
        <div className="flex relative z-0 w-full my-4 group">
            <form noValidate onSubmit={(e) => { addUsers(e, newUsers) }} className='w-full flex justify-between'>
                <input autoComplete='off' value={newUser} type="text" name="user" id="user" className="text-gray-300 text-xs lg:text-base block py-2.5 px-0 w-full bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required 
                onChange={
                    (e) => {setNewUser(e.target.value)}
                } onKeyDown={(e) => {
                    handleSpaceDown(e)
                }}
                onBlur={ () => {
                    setNewUser('')
                }}/>
                <label htmlFor="user" className="text-xs lg:text-sm peer-focus:font-medium absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Search user by nickname</label>
                <button type='submit' className='ml-[10%] w-[40%] px-1 relative bg-sky-900 text-gray-300 rounded-full'>Add users</button>
            </form>
        </div>
        <AddedUsersForm users={newUsers} setUsers={setNewUsers}/>
    </>
  )
}

export default NewRoomUsers