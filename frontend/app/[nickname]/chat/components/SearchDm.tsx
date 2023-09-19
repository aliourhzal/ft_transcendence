import React, { useContext, useEffect, useState } from 'react'
import Popup from './Popup'
import Context, { gimmeRandom } from './Context'
import Search from './search'
import { Avatar } from '@nextui-org/react'
import axios from 'axios'
import { getCookie } from '../../layout'

interface SearchDmProps {
  setActiveUserConv: any
  showSearchUsersForm: any
  setShowSearchUsersForm: any
  blockedUsers: any[]
  setRefresh: any
}

const SearchDm:React.FC<SearchDmProps> = ( { setActiveUserConv, showSearchUsersForm, setShowSearchUsersForm, blockedUsers, setRefresh } ) => {

  const {socket, rooms, setChatBoxMessages, setShowConv, userData} = useContext(Context)

  const [showList, setShowList] = useState(false)
  
  const [users, setUsers] = useState([])

  const [currentUsers, setCurrentUsers] = useState([]);

  const getUsers = async () => {
    try {
      return await axios.get('http://127.0.0.1:3000/users/users', {withCredentials: true})
    } catch(error) {
      // alert(error)
      // setShowSearchUsersForm(false)
      console.log(error)
    }
    return ;
  }

  useEffect( () => {
    getUsers().then(res => {setUsers(res.data); setCurrentUsers(res.data)})
  }, [])


  const filerList = (needle = '') => {
    if (needle === '')
      setUsers([...currentUsers])
    else
      setUsers([...currentUsers.filter((user) => (user.nickname.startsWith(needle)))])
  }

  const hide = () => {
      setCurrentUsers([])
      setUsers([])
      setShowSearchUsersForm(false)
      setShowList(false)
      filerList()
  }

  const getDm = async (data) => {
    try {
      await axios.post('http://127.0.0.1:3000/rooms/select-room', {roomId:rooms.find(o => o.id === data.id)?.id}, {
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
    setShowConv(true)
  }

  return (
    <Popup isOpen={showSearchUsersForm} modalAppearance={hide}>
        <h1 className='absolute top-7 text-center text-2xl mb-2 drop-shadow-[0_1.2px_1.2px_rgba(255,255,255,0.8)] font-bold'>Search for users</h1>
        <div onClick={() => setShowList(true)} className='-mt-5'><Search _Filter={filerList} type={'dm'}/></div>
        {showList &&
        <div className='transition-all flex flex-col justify-start items-center h-[14rem] bg-darken-100 gap-2 rounded-xl overflow-y-auto pt-1 scrollbar-thin scrollbar-track-darken-300 scrollbar-thumb-whiteSmoke scrollbar-corner-black'>
          {users.map(user => user.nickname != userData.nickname && (
            !users.find(o => o.id === userData.id)?.blockedBy.find(o => o.id === user.id) &&
            <span className='transition-all duration-300 cursor-pointer rounded-xl w-[100%] p-[5%] h-14 bg-darken-100 hover:bg-darken-300 flex items-center justify-between z-10' key={gimmeRandom()} onClick={ () => {
              if (!rooms.find(o => o.name === user.nickname)) {
                socket.emit('start-dm', {reciverUserId: user.id})
                // setActiveUserConv(rooms.find(o => o.name === user.nickname))
              }
              else {
                setActiveUserConv(rooms.find(o => o.name === user.nickname))
                getDm(rooms.find(o => o.name === user.nickname))
              }
              hide()
            }}>
              <div className='flex gap-3 items-center'>
                <div className='flex items-center justify-start gap-3'>
                  {user.status === 'online' ? <span className='rounded-full bg-green-400 opacity-90 border-2 border-green-500 w-2 h-2 -ml-1'></span>
                  : <span className='w-2 h-2 -ml-1'></span>}
                  <Avatar pointer src={user.profilePic} />
                </div>
                <span className='text-whiteSmoke'>{user.nickname}</span>
              </div>
              { !blockedUsers.find(o => o.id === user.id) ? <button className='transition-all w-24 text-white bg-red-400 hover:bg-red-300 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center' onClick={(e) => {
                socket.emit('user-block', {blockedUserId: user.id})
                e.stopPropagation() // dont propagate onclick event to parent
                setRefresh(old => !old)
              }}>block</button> :
              <button className='transition-all w-24 flex items-center justify-center text-white bg-blue-400 hover:bg-blue-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center' onClick={(e) => {
                socket.emit('unblock', {unBlockedUserId: user.id})
                e.stopPropagation() // dont propagate onclick event to parent
                setRefresh(old => !old)
              }}>unblock</button>}
            </span>
          ))}
        </div>}
    </Popup>
  )
}

export default SearchDm