import React, { useContext, useState } from 'react'
import Popup from './Popup'
import { Context, gimmeRandom } from '../page'
import Search from './search'
import { Avatar } from '@nextui-org/react'
import axios from 'axios'
import { getCookie } from '../../layout'

interface SearchDmProps {
  currentUsers: any[]
  setActiveUserConv: any
  showSearchUsersForm: any
  setShowSearchUsersForm: any
}

const SearchDm:React.FC<SearchDmProps> = ( { currentUsers, setActiveUserConv, showSearchUsersForm, setShowSearchUsersForm } ) => {

  const {socket, rooms, setChatBoxMessages, setShowConv, userData} = useContext(Context)

  const [showList, setShowList] = useState(false)
  const [users, setUsers] = useState([...currentUsers])
  
  const filerList = (needle = '') => {
    if (needle === '')
      setUsers([...currentUsers])
    else
      setUsers([...currentUsers.filter((user) => (user.nickname.startsWith(needle)))])
  }

  const hide = () => {
      setShowSearchUsersForm(false)
      setShowList(false)
      filerList()
  }

  const getDm = async (user, data) => {
    try {
      await axios.post('http://127.0.0.1:3000/rooms/select-room', {roomId:rooms.find(o => o.id === data.id).id}, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${getCookie('access_token')}`,
          'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
        })
      .then((res) => {
        setChatBoxMessages(res.data.msg)
      })
    } catch(error) {
      // alert(error)
      console.log(error)
    }
    setActiveUserConv(rooms.find(o => o.name === user.nickname))
    setShowConv(true)
  }

  return (
    <Popup isOpen={showSearchUsersForm} modalAppearance={hide}>
        <h1 className='absolute top-7 text-center text-2xl mb-2 drop-shadow-[0px_0px_5px_rgba(150,150,150,0.7)]'>Search for users</h1>
        <div onClick={() => setShowList(true)} className='-mt-5'><Search _Filter={filerList} type={'dm'}/></div>
        {showList &&
        <div className='flex flex-col justify-start items-center min-h-[12rem] bg-darken-100 gap-2 rounded-xl overflow-y-auto pt-1'>
          {users.map(user => user.nickname != userData.nickname && (
            <span className='cursor-pointer rounded-xl w-[100%] p-[5%] h-14 bg-darken-100 hover:bg-darken-300 flex items-center justify-between z-10' key={gimmeRandom()} onClick={ () => {
              if (!rooms.find(o => o.name === user.nickname)) {
                socket.emit('start-dm', {reciverUserId: user.id})
                // setActiveUserConv(rooms.find(o => o.name === user.nickname))
              }
              else {
                getDm(user, rooms.find(o => o.id === currentUsers.find(o => o.nickname === user.nickName).id))
              }
              hide()
            }}>
              <div className='flex gap-3 items-center'>
                <div className='flex items-center justify-start gap-3'>
                  {currentUsers.find(o => o.nickname === user.nickname)?.status === 'online' ? <span className='rounded-full bg-green-400 opacity-90 border-2 border-green-500 w-2 h-2 -ml-1'></span>
                  : <span className='w-2 h-2 -ml-1'></span>}
                  <Avatar pointer src={user.profilePic} />
                </div>
                <span className='text-whiteSmoke'>{user.nickname}</span>
              </div>
              <button className='w-auto text-white bg-red-400 hover:bg-red-300 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center' onClick={(e) => {
                socket.emit('user-block', {blockedUserId: user.id})
                e.stopPropagation() // dont propagate onclick event to parent
              }}>block</button>
            </span>
          ))}
        </div>}
    </Popup>
  )
}

export default SearchDm