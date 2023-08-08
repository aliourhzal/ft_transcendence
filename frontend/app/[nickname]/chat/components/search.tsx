import React from 'react'
import { conversation, gimmeRandom } from '../page'
import { useState } from 'react'
import Image from 'next/image'
import { Avatar } from '@nextui-org/react'

const Search = (props:any) => {
    const [name, setName] = useState('');
    const [foundUsers, setFoundUsers] = useState(props.users);
    const [show, setShow] = useState(false);

    const filter = (e:any) => {
        setShow(true)
        const keyword = e.target.value;
        if (keyword !== '') {
            const results = props.users.filter((user:conversation) => (user.name.startsWith(keyword)))
            setFoundUsers(results);
        } else { if (e.target.value != '' ) setFoundUsers(props.users); else {setFoundUsers([]); setShow(false)}
        }
        setName(keyword)
    }
    return (
        <>
            <div className=' flex items-center justify-center w-[100%]'>
                <img alt='search' src='/images/loupe.svg' width={20} height={20}/>
                <input
                    type='search'
                    placeholder="Search"
                    value={name}
                    className="text-white pl-10 pb-5 pt-4 w-[70%] border-b border-blue-gray-200 bg-transparent  text-sm text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-blue-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                    onChange={filter} onBlur={() => {setShow(false)}}
                />
            { show ?
                <div className='bg-transparent absolute w-[70%] z-10 mx-[15%] border-white h-70 overflow-scroll '>
                    {foundUsers && foundUsers.length > 0 ? (
                        foundUsers.map((user:conversation) => (
                            <div className='flex justify-start h-14 bg-white text-black border-4 border-gray-800' key={gimmeRandom()}>
                                <Avatar zoomed text={user.name} bordered color={"gradient"} className='my-2 mx-5 w-auto h-auto' src={user.photo} alt={user.name} />
                                <span className='my-4' >{user.name}</span>
                            </div>
                        ))
                        ) : (
                        <h1 className='text-white'>No results found!</h1>
                    )}
                </div>
            : ''}
            </div>
        </>
    )
}

export default Search