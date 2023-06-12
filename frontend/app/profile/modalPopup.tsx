'use client'
import { Dialog, Transition } from '@headlessui/react'
// import { Clicker_Script } from "next/font/google";
import { useRef } from "react";
import { Fragment, useState } from 'react';
import { IoIosAddCircle } from "react-icons/io";

interface InputTemplateProps {
	id: string,
	className?: string,
	type: string,
	label: string,
	placeholder: string
}

function InputTemplate(props: InputTemplateProps) {
	return (
		<label htmlFor={props.id} className={`${props.className} w-full font-medium flex flex-col gap-1`}>
			<input type={props.type} id={props.id} placeholder={props.placeholder} required className={`${props.className} bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 text-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none border-none`} />
			<span className='text-red-500'>error</span>
		</label>
	);
}

export default function MyModal() {
	let [isOpen, setIsOpen] = useState(false);
	const imageElement : any = useRef();
	const imageInput : any = useRef();

	function modalAppearance() {
		setIsOpen(oldState => !oldState)
	}

	function setImage(e: any)
	{
        const reader = new FileReader();
		reader.onload = function(e) {
			imageElement.current.src = e.target!.result as string;
		}
		reader.readAsDataURL(imageInput.current.files[0]);
	}

    function formSubmitHandler(e: any) {
		//prevent website reload
        e.preventDefault();
        const newNickname = e.target[1].value;
        const newPass = e.target[2].value;
        const confirmPass = e.target[3].value;
    }

  return (
	<div>
		<img onClick={modalAppearance} className='cursor-pointer' src="images/settings.png" alt="settings" />
		{/* <button onClick={modalAppearance} className="btn bg-blue-700 hover:bg-blueStrong text-white font-bold py-3 px-9 border border-blue-900 rounded-md">
					Settings
		</button> */}
		{/* password image displayName(login) X to close save to save */}
	<Transition appear show={isOpen} as={Fragment}>
		<Dialog as="div" className="relative z-10" onClose={modalAppearance}>
		<Transition.Child as={Fragment}
			enter="ease-out duration-300"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="ease-in duration-200"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<div className="fixed inset-0 bg-black bg-opacity-25" />
			</Transition.Child>

			<div className="fixed inset-0 overflow-y-auto">
			<div className="flex min-h-full items-center justify-center p-4 text-center">
				<Transition.Child
				as={Fragment}
				enter="ease-out duration-300"
				enterFrom="opacity-0 scale-95"
				enterTo="opacity-100 scale-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100 scale-100"
				leaveTo="opacity-0 scale-95"
				>
				{/* inside pop Up */}
				<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-whiteSmoke p-6 text-left align-middle shadow-xl transition-all">
					<button onClick={modalAppearance} type="button" className=" absolute right-[7%] w-9 h-9 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg flex text-center justify-center items-center">x</button>
					<form onSubmit={formSubmitHandler} className="flex flex-col justify-center items-center gap-3">
						<div className="relative">
							<img ref={imageElement} id="avatar" className="h-[100px] w-[auto] mb-6 rounded-full" src="images/man.png" alt="avatar" />
							<label htmlFor="avatarUpload" className="absolute bottom-[13%] right-0 w-10 h-10">
								<IoIosAddCircle className="absolute w-full h-full top-0 left-0 text-gray-600 cursor-pointer" />
								<input ref={imageInput} onChange={setImage} type="file" accept="image/png, image/gif, image/jpeg" className="hidden" id="avatarUpload"/>
							</label>
						</div>
						<InputTemplate id='newNick' label='new Nickname' type='text' placeholder='Nickname'/>
						<InputTemplate id='newPass' label='new Password' type='password' placeholder='Password'/>
						<InputTemplate id='confirmPass' label='Confirm Password' type='password' placeholder='Confirm Password'/>
						<div className="flex items-center mb-4">
							<input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 rounded ring-offset-gray-800 focus:ring-2bg-gray-700 border-gray-600"/>
							<label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Two-factor Authentication</label>
						</div>
						<button type="submit" className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Save</button>
					</form>
				</Dialog.Panel>
				{/* outside pop Up */}
				</Transition.Child>
			</div>
			</div>
		</Dialog>
		</Transition>
	</div>
);
}

// export {modalAppearance}