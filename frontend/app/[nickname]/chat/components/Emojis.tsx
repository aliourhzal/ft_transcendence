import React from 'react'
import { gimmeRandom } from '../page'
import Search from './search'
import EmojiPicker from 'emoji-picker-react';
import * as emoji from 'node-emoji'

interface EmojisProps {
    className: string
    inputRef: any
    setShowEmojies: any
}

const emojis = ['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','😣','😖','😫','😩','🥺','😢','😭','😮‍💨','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','🥱','😴','🤤','😪','😵','🤐','🥴','🤢','🤮','🤧','😷','🤒','🤕','🤑','🤠','😈','👿','👹','👺','🤡','💩','👻','💀','☠️','👽','👾','🤖','🎃','😺','😸','😹','😻','😼','😽','🙀','😿','😾']

const Emojis:React.FC<EmojisProps> = ( { className, inputRef, setShowEmojies } ) => {
  console.log(emoji.find('smile'))
  return (
      <div className={className + ' px-2 w-[16.1rem] h-[14.8rem] flex flex-col justify-center items-center absolute bottom-[90%] left-0 border-0 border-slate-900 opacity-90 z-20'}>
        <Search _Filter={undefined} type={'emojis'}/>
        <div className='w-full h-full flex flex-wrap flex-col overflow-x-scroll scrollbar'>
          {emojis.map( emoji =>
              <div key={gimmeRandom()} className='text-xl transition-all w-10 h-10 rounded-xl hover:bg-slate-400 flex items-center justify-center cursor-pointer' onClick={() => {
                inputRef.current.value += emoji
                inputRef.current.focus()
                setShowEmojies(true)
              }}> {emoji} </div>
          )}
        </div>
        {/* <EmojiPicker searchDisabled={true} /> */}
      </div>
  )
}

export default Emojis