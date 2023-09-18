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

  const reff = useRef(null)

  const filerEmojis = (needle = '') => {
    if (needle === '')
      setEmojis([...emojis])
    else
      setEmojis([...emojis.filter((emo) => (emo.name.startsWith(needle)))])
    emojisRef.current.scroll(0, 0)
  }

  return (
    <Transition appear show={showEmojies} as={undefined}>
      <div ref={reff} className='select-none bg-darken-300 rounded-xl px-2 w-[16.1rem] h-[14.8rem] flex flex-col justify-center items-center border-0 border-slate-900 opacity-95 z-20'>
        <Dialog as='div' className='w-64 h-64 bg-darken-300 rounded-xl z-20 bottom-[80%] left-0 absolute' onClose={setShowEmojies}>
          <Transition.Child as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-10 scale-50"
          >
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
          </Transition.Child>
        </Dialog>
      </div>
    </Transition>
  )
}

export default Emojis