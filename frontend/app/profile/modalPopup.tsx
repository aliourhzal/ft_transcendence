'use client'
import { Dialog, Transition } from '@headlessui/react'
// import { Clicker_Script } from "next/font/google";
import { useContext, useRef } from "react";
import { Fragment, useState } from 'react';
import { IoIosAddCircle } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";
import axios from "axios";
import { Intra_Id_Context } from './profileContent';

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
			<input type={props.type} id={props.id} placeholder={props.placeholder}  className={`${props.className} bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 text-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none border-none`} />
			<span className='text-red-500'>error</span>
		</label>
	);
}

export default function MyModal(props: any) {
	let [isOpen, setIsOpen] = useState(false);
	const imageElement : any = useRef();
	const nickNameRef : any = useRef();
	const confirmPassRef : any = useRef();
	const passwordRef : any = useRef();
	const oldPassRef : any = useRef();
	const intraId = useContext(Intra_Id_Context);

	function modalAppearance() {
		setIsOpen(oldState => !oldState)
	}

	function setImage(e: any)
	{
        const reader = new FileReader();
		reader.onload = async function(ev) {
			imageElement.current.src = e.target!.result as string;
			props.changePic(ev.target!.result);
			const formData = new FormData();
			formData.append('avatar', e.target.files[0])
			await axios.put('http://127.0.0.1:3000/users/profile/avatar', formData, {
				withCredentials: true,
			})
		}
		reader.readAsDataURL(e.target.files[0]);
	}

    async function formSubmitHandler(e: any) {
		//prevent website reload
        e.preventDefault();
		let p : number = 2;
		let oldPass : string;
        const newNickname = e.target[1].value;
		if (props.pass)
		{
			oldPass = e.target[2].value;
			p = 4;
		}
        const newPass = e.target[p].value;
        const confirmPass = e.target[3].value;

		if (newPass && confirmPass)
		{
			try {
				if (props.pass)
				{
					try{
						await axios.post('http://127.0.0.1:3000/users/profile/checkPassword ', {oldPass}, {
							withCredentials: true
						});
					}catch(err)
					{
						oldPassRef.current.textContent = "Password Incorrect";
						oldPassRef.current.style.color = "E76161";
					}
				}
				if (newPass === confirmPass)
				{
					await axios.post('http://127.0.0.1:3000/users/profile/password ', {confirmPass}, {
					withCredentials: true
					});
					passwordRef.current.textContent = "Password Updated";
					passwordRef.current.style.color = "#98D8AA";
					props.changePasswd(true);
				}
				else
				{
					confirmPassRef.current.textContent = "Password miss match";
					confirmPassRef.current.style.color = "E76161";
				}
			}
			catch (error) {
				passwordRef.current.textContent = "Wrong Password Syntax";
				passwordRef.current.style.color = "#E76161";
			}
		}
		else if (newNickname)
		{
			try
			{
				await axios.post('http://127.0.0.1:3000/users/profile/nickName', {newNickname}, {
					withCredentials: true
				});
				nickNameRef.current.textContent = "Updated";
				nickNameRef.current.style.color = "#98D8AA";
				props.changeNickname(newNickname);
			}
			catch(error)
			{
				nickNameRef.current.textContent = "Nick Name Already In Use";
				nickNameRef.current.style.color = "E76161";
			}
		}
		else
			alert("Can't save empty inputs");
	}
	
  return (
	<div>
		<div className="flex flex-col md:flex-row items-center gap-5 cursor-pointer text-white" onClick={modalAppearance}>
			<IoIosSettings style={{fontSize: '26px'}} />
			<span className='text-md text-whiteSmoke hidden sm:inline capitalize'>Settings</span>
		</div>
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
				<div className="fixed inset-0 bg-black bg-opacity-25"></div>
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
							<img src={props.pic} alt="" />
							<img ref={imageElement} id="avatar" className="h-[100px] aspect-square mb-6 rounded-full" src={props.avatar} alt="avatar" />
							<label htmlFor="avatarUpload" className="absolute bottom-[13%] right-0 w-10 h-10">
								<IoIosAddCircle className="absolute w-full h-full top-0 left-0 text-gray-600 cursor-pointer" />
								<input onChange={setImage} type="file" accept="image/png, image/gif, image/jpeg" className="hidden" id="avatarUpload"/>
							</label>
						</div>
						
						{/* <InputTemplate id='newNick' label='new Nickname' type='text' placeholder='Nickname'/> */}
						
						{/* NickName */}
						<label htmlFor='newNick' className='w-full font-medium flex flex-col gap-1'>
							<input type='text' id='newNick' placeholder='Nickname'  className='bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 text-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none border-none' />
							<span ref={nickNameRef} id="nickNameError" className='text-red-500'></span>
						</label>
						
						
						{/* { props.pass && <InputTemplate id='old Password' label='old Password' type='password' placeholder='Old Password'/>} */}
						
						{/* Old Password */}
						{props.pass && <label htmlFor='old Password' className='w-full font-medium flex flex-col gap-1'>
							<input type='password' id='old Password' placeholder='Old Password'  className='bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 text-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none border-none' />
							<span ref={oldPassRef} id="oldPasswordError" className='text-red-500'></span>
						</label>}
						
						
						{/* <InputTemplate id='newPass' label='new Password' type='password' placeholder='New Password'/> */}
						
						
						{/* New Password */}
						<label htmlFor='newPass' className='w-full font-medium flex flex-col gap-1'>
							<input type='password' id='newPass' placeholder='New Password'  className='bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 text-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none border-none' />
							<span ref={passwordRef} id="newPasswordError" className='text-red-500'></span>
						</label>
					

						{/* <InputTemplate id='confirmPass' label='Confirm Password' type='password' placeholder='Confirm Password'/> */}
						
						
						{/* Confirm Password */}
						<label htmlFor='confirmPass' className='w-full font-medium flex flex-col gap-1'>
							<input type='password' id='confirmPass' placeholder='Confirm Password'  className='bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 text-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none border-none' />
							<span ref={confirmPassRef} id="confirmPasswordError" className='text-red-500'></span>
						</label>
						
						{/* Two-Factor checkBox */}
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