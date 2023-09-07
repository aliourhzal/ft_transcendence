import React from 'react'
import { gimmeRandom } from '../page'

interface EmojisProps {
    className: string
}

const emojis = ['😀']

const Emojis:React.FC<EmojisProps> = ( { className } ) => {
  return (
    <div className='absolute'>
        <div className={className}>
            {emojis.map( emoji =>
                <div key={gimmeRandom()} className='w-10 h-10 hover:bg-slate-400 flex items-center justify-center cursor-pointer'> {emoji} </div>
            )}
        </div>
    </div>
  )
}

export default Emojis