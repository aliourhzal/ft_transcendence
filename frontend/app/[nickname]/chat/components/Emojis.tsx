import React, { Fragment, useRef, useState } from 'react'
import { gimmeRandom } from './Context'
import Search from './search'
import EmojiPicker from 'emoji-picker-react';
import * as emoji from 'node-emoji'
import { Dialog, Transition } from '@headlessui/react';

interface EmojisProps {
    inputRef: any
    setShowEmojies: any
    showEmojies: boolean
    className: string
}

const emojis = emoji.search('')

const Emojis:React.FC<EmojisProps> = ( { inputRef, setShowEmojies, showEmojies, className } ) => {
  
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
    <div id='emojis' className={className + ' py-1 select-none absolute bottom-24 left-0 bg-darken-300 rounded-xl px-2 w-[16.1rem] h-[14.8rem] flex flex-col justify-center items-center border-0 border-slate-900 opacity-95 z-20'}>
      <Search _Filter={filerEmojis} type={'emojis'}/>
      <div ref={emojisRef} className='w-full h-full flex flex-wrap flex-col overflow-x-scroll scrollbar-thin scrollbar-track-darken-200 scrollbar-thumb-whiteSmoke scrollbar-corner-black'>
        {_emojis.map( emoji =>
            <div key={gimmeRandom()} className='text-xl transition-all w-10 h-10 rounded-xl hover:bg-slate-400 flex items-center justify-center cursor-pointer' onClick={() => {
              inputRef.current.value += emoji.emoji
              inputRef.current.focus()
            }}> {emoji.emoji} </div>
        )}
      </div>
      {/* <EmojiPicker searchDisabled={true} /> */}
    </div>
  )
}

export default Emojis