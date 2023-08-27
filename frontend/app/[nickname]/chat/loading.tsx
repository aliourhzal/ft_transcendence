import React from 'react'
import './style.css'

const loading = () => {
  return (
    <main className='relative flex items-center justify-center w-full h-full bg-darken-200'>
        <div className='absolute text-whiteSmoke z-10'>Loading...</div>
        <div className="loader">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </main>
  )
}

export default loading