import React from 'react'

interface MyAlertProps {
    showAlert: boolean
    setShowAlert: any,
    text: string,
}

const MyAlert:React.FC<MyAlertProps> = ( { setShowAlert, text, showAlert } ) => {


    setTimeout(() => {
        setShowAlert(false)
        return clearTimeout
    }, 2500)

  return (
    <div className='z-20 mt-5 absolute w-full flex items-center justify-center'>
        <div className={'transition-all duration-200 ' + (showAlert ? 'opacity-100' : 'opacity-0') + " gap-3 flex items-center h-11 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded origin-top-right"} role="alert">
            <strong className="font-bold">Holy smokes!</strong>
            <span className="block sm">{text}</span>
            <span className="bg-red-200 w-5 h-5 rounded-full flex items-center justify-center font-extrabold cursor-pointer" onClick={() => {
                setShowAlert(false)
            }}>
                x
            </span>
        </div>
    </div>
  )
}

export default MyAlert