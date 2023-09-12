import React, { useRef, useState } from 'react'
import { gimmeRandom } from '../page'
import Search from './search'
import EmojiPicker from 'emoji-picker-react';
import * as emoji from 'node-emoji'

interface EmojisProps {
    className: string
    inputRef: any
    setShowEmojies: any
}

const emojis = emoji.search('')

const Emojis:React.FC<EmojisProps> = ( { className, inputRef, setShowEmojies } ) => {
  
  const [_emojis, setEmojis] = useState([...emojis])
  const emojisRef = useRef(null)

  const filerEmojis = (needle = '') => {
    if (needle === '')
      setEmojis([...emojis])
    else
      setEmojis([...emojis.filter((emo) => (emo.name.startsWith(needle)))])
    emojisRef.current.scroll(0, 0)
  }

  return (
      <div className={className + ' px-2 w-[16.1rem] h-[14.8rem] flex flex-col justify-center items-center absolute bottom-[90%] left-0 border-0 border-slate-900 opacity-90 z-20'}>
        <Search _Filter={filerEmojis} type={'emojis'}/>
        <div ref={emojisRef} className='w-full h-full flex flex-wrap flex-col overflow-x-scroll scrollbar'>
          {_emojis.map( emoji =>
              <div key={gimmeRandom()} className='text-xl transition-all w-10 h-10 rounded-xl hover:bg-slate-400 flex items-center justify-center cursor-pointer' onClick={() => {
                inputRef.current.value += emoji.emoji
                inputRef.current.focus()
                setShowEmojies(true)
              }}> {emoji.emoji} </div>
          )}
        </div>
        {/* <EmojiPicker searchDisabled={true} /> */}
      </div>
  )
}

export default Emojis