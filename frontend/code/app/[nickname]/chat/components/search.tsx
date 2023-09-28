import React from 'react'

interface SearchProps {
    _Filter: any | undefined,
    type: string
}

const Search:React.FC<SearchProps> = ( {_Filter, type} ) => {

    const filter = (e) => {
        _Filter(e)
    }

    return (
        <div className='h-[80px] flex items-center justify-center w-[100%] relative'>
            {type === 'conv' && <img className='absolute left-[14%] top-[45%]' alt='search' src='/images/loupe.svg' width={20} height={20}/>}
            <input
                onFocus={e => e.target.placeholder = ''}
                onBlur={e => {
                    e.target.placeholder = 'Search';
                    // e.target.value = '';
                    // _Filter ? filter('') : '';
                }}
                type='search'
                placeholder="Search"
                className={type === 'conv' ? "text-white pl-16 pt-4 w-[70%] h-[80px] border-b border-blue-gray-200 bg-transparent text-sm text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-blue-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" : ' transition-all duration-300 text-whiteSmoke w-full p-2 border border-gray-500 rounded-lg bg-darken-200 sm:text-xs outline-0 focus:ring-whiteSmoke focus:border-whiteSmoke'}
                onChange={(e) => {_Filter ? filter(e.target.value) : ''}}
            />
        </div>
    )
}

export default Search