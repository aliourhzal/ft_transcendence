import { useContext, useEffect, useState } from "react"
import { conversation } from "../page"
import Context, { gimmeRandom, getUsersInfo } from "./Context"
import ConvBox from "./ConvBox"
import Search from "./search"
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { LiaUsersSolid } from "react-icons/lia"
import { TbMessage2Search } from "react-icons/tb"

interface ConvListProps {
  activeUserConv: any
  setActiveUserConv: any
}

const ConvList:React.FC<ConvListProps> = ({activeUserConv, setActiveUserConv}) => {
  const {socket, set_room_created, rooms, userData, convs, setConvs, _notification, setChatBoxMessages, setShowForm, setShowJoinForm, setShowSearchUsersForm } = useContext(Context)
  
  const fillUserList = (res) => {
    setConvs([])
    res.messages.map( (room: any) => {
      if (room.room.room.roomType === 'DM') {
        var _name = room.usersInRoom[0].user.nickname
        var _photo = room.usersInRoom[0].user.profilePic
        if (_name === userData.nickname) {
            _name = room.usersInRoom[1].user.nickname
            _photo = room.usersInRoom[1].user.profilePic
        }
        rooms.unshift({
          name: _name,
          lastmsg: {msg: room.msg[room.msg.length - 1].msg.text, userId:room.msg[room.msg.length - 1].msg.userId},
          msgs: room.msg,
          id: room.room.room.id,
          users: getUsersInfo(room.usersInRoom),
          type: 'DM',
          photo: _photo
        })
      }
      else {
        rooms.unshift({
          name: room.room.room.room_name,
          lastmsg: {msg: room.msg[room.msg.length - 1].msg.text, userId:room.msg[room.msg.length - 1].msg.userId},
          msgs: room.msg,
          id: room.room.room.id,
          users: getUsersInfo(room.usersInRoom),
          type: room.room.room.roomType,
          photo: "/images/defaultRoomIcon.png",
        })
      }
    })
    setConvs(rooms)
  }

  useEffect( () => {
    socket.on('list-rooms',fillUserList)
    return () => {
      socket.off('list-rooms',fillUserList)
    }
  }, [])
  
  const AddUserToRoom = (res) => {
    var _newUser;
    const newusers = []
    res.newUserAdded.users.map(_new => {
      newusers.push(res.userInfos.find(o => o.userId === _new.userId))
    })
    if (newusers.length) {
      newusers.map((newuser) => {
        if (newuser.userType != 'OWNER') {
          if (newuser.user.nickname === userData.nickname || !rooms.find(o => o.name === res.roomId.room_name)) {
            _newUser = newuser.user.nickname
            if (!rooms.find(o => o.id === res.roomId.id)) {
              rooms.unshift({
                msgs: res.messageAndUserName,
                id: res.roomId.id,
                name: res.roomId.room_name,
                type: res.roomId.roomType,
                lastmsg: {user: res.roomId.room_name, msg: 'welcome to group chat'},
                users: getUsersInfo(res.userInfos),
                photo: "/images/defaultRoomIcon.png"
              })
            }
          } else {
            if (rooms.find(o => o.name === res.roomId.room_name)) {
              rooms.find(o => o.name === res.roomId.room_name).users.push(
                {
                  id: newuser.user.id,
                  nickName: newuser.user.nickname,
                  firstName: newuser.user.firstName,
                  lastName: newuser.user.lastName,
                  photo: newuser.user.profilePic,
                  type: newuser.userType,
                  isMuted: newuser.isMuted,
                }
              )
            }
            }
          }
        })
        setConvs([...rooms])
        set_room_created(old => !old)
        // setUpdateList(old => !old)
        if (userData.nickname === _newUser) {
          _notification(`You joined '${res.roomId.room_name}'`, "good")
        }
        else {
          newusers.map(_new => {
            _notification(`"${_new.user.nickname}" joined '${res.roomId.room_name}'`, "good")
            setActiveUserConv(_conv => {
              if (_conv?.name === res.roomId.room_name)
              setChatBoxMessages(old => [...old, {userId: 'bot', msg : `"${_new.user.nickname}" joined`}])
            return _conv})
          })
        }
      }
    }
            
    useEffect(() => {
      socket.on('users-join', AddUserToRoom)
      return () => socket.off('users-join', AddUserToRoom)
    }, [])

    const convsFilter = (needle = '') => {
      if (needle.trim() === '')
        setConvs([...rooms])
      else
        setConvs(rooms.filter((user:conversation) => (user.name.startsWith(needle))))
    }

    let _tabIndex = 1

    return (
    <>
      <Search _Filter={convsFilter} type={'conv'}/>
      <div className='transition-all group left-[10%] flex-col bg-transparent w-full h-[80%] mt-8 overflow-y-auto scrollbar-thin scrollbar-track-darken-300 scrollbar-thumb-whiteSmoke scrollbar-corner-black'>
          {
            rooms.length ? convs.length ? convs.map ((item:conversation) =>  (<ConvBox _tabIndex={_tabIndex++} convsFilter={convsFilter} key={gimmeRandom()} data={item} activeUserConv={activeUserConv} setActiveUserConv={setActiveUserConv} />)) 
            : 
            <div className="text-white w-full h-full flex items-center justify-center">No conversations found !</div>
            :
            <div className="text-whiteSmoke font-bold h-[100%] w-[100%] flex flex-col items-center justify-center flex-wrap gap-3">
              <div className="gap-2 bg-darken-300 w-[80%] h-[40%] flex flex-col rounded-xl items-center justify-center text-whiteSmoke">
                <h1 id="h1conv" className="text-xl font-extrabold font"> to start a conversation </h1>
                <AiOutlineUsergroupAdd onClick={() => {setShowForm(true)}} size={30} className="cursor-pointer hover:text-blueStrong hover:scale-110"/>
                create a room
                <LiaUsersSolid onClick={() => {setShowJoinForm(true)}} size={30} className="cursor-pointer hover:text-blueStrong hover:scale-110"/>
                join one
                <TbMessage2Search onClick={() => {setShowSearchUsersForm(true)}} size={30} className="cursor-pointer hover:text-blueStrong hover:scale-110"/>
                or find a user
              </div>
            </div>
          }
      </div>
    </>
  )
}

export default ConvList