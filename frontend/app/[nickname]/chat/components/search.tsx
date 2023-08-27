import React from 'react'

interface SearchProps {
    _Filter: any | undefined,
}

const Search:React.FC<SearchProps> = ( {_Filter} ) => {

    const filter = (e) => {
        _Filter(e.target.value)
    }

    return (
        <div className='h-[80px] flex items-center justify-center w-[100%] relative'>
            <img className='absolute left-16 top-9' alt='search' src='/images/loupe.svg' width={20} height={20}/>
            <input
                onFocus={e => e.target.placeholder = ''}
                onBlur={e => {
                    e.target.placeholder = 'Search';
                    e.target.value = '';
                    _Filter ? filter(e) : '';
                }}
                type='search'
                placeholder="Search"
                className="text-white pl-16 pt-4 w-[70%] h-[80px] border-b border-blue-gray-200 bg-transparent text-sm text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-blue-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                onChange={(e) => {_Filter ? filter(e) : ''}}
            />
        </div>
    )
}

export default Search