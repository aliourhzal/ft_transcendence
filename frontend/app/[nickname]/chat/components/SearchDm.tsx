import React, { useContext } from 'react'
import Popup from './Popup'
import { Context } from '../page'
import Search from './search'

const SearchDm = () => {

    const {showSearchUsersForm, setShowSearchUsersForm} = useContext(Context)

    const hide = () => {
        setShowSearchUsersForm(false)
    }

  return (
    <Popup isOpen={showSearchUsersForm} modalAppearance={hide}>
        {/* <h1 className='absolute top-[15%] text-center text-2xl mb-2 drop-shadow-[0px_0px_5px_rgba(150,150,150,0.7)]'>Search for users</h1> */}
        <div className='absolute top-3 flex items-center justify-start w-[80%]'>
                <img alt='search' src='/images/loupe.svg' width={20} height={20}/>
                <input
                    type='search'
                    placeholder="Search"
                    className="text-white pl-10 pb-5 pt-4 w-[70%] border-b border-blue-gray-200 bg-transparent  text-sm text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-blue-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                    // onChange={filter} onBlur={() => {setShow(false)}}
                />
        </div>
    </Popup>
  )
}

export default SearchDm