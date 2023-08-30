import React, { useContext, useState } from 'react'
import Popup from './Popup'
import { Context, gimmeRandom } from '../page'
import Search from './search'

interface SearchDmProps {
  currentUsers: any
}

const SearchDm:React.FC<SearchDmProps> = ( { currentUsers } ) => {

  const {showSearchUsersForm, setShowSearchUsersForm, socket, rooms} = useContext(Context)

  const [showList, setShowList] = useState(false)
  const [users, setUsers] = useState([...currentUsers])

  const hide = () => {
      setShowSearchUsersForm(false)
      setShowList(false)
  }

  const filerList = (needle = '') => {
    if (needle === '')
      setUsers(currentUsers)
    else
      setUsers(currentUsers.filter((user) => (user.nickname.startsWith(needle))))
  }

  return (
    <Popup isOpen={showSearchUsersForm} modalAppearance={hide}>
        <h1 className='absolute top-[15%] text-center text-2xl mb-2 drop-shadow-[0px_0px_5px_rgba(150,150,150,0.7)]'>Search for users</h1>
        <div onClick={() => {setShowList(true)}}><Search _Filter={filerList} /></div>
        {showList &&
        <div className='flex flex-col justify-start items-center h-30'>
          {users.map(user => (
            <span className='w-[70%] h-10 bg-whiteSmoke hover:bg-blueStrong' key={gimmeRandom()} onClick={ () => {
              console.log(user)
              if (!rooms.find(o => o.name === user.nickname)) {
                socket.emit('start-dm', {reciverUserId: user.id})
              }
              else {
                console.log("lmao")
              }
          }
            }>{user.nickname}</span>
          ))}
        </div>}
    </Popup>
  )
}

export default SearchDm