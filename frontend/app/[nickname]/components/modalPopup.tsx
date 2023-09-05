'use client'
import { Dialog, Transition } from '@headlessui/react'
// import { Clicker_Script } from "next/font/google";
import { useContext, useEffect, useRef } from "react";
import { Fragment, useState } from 'react';
import { IoIosAddCircle, IoIosSettings } from "react-icons/io";
import axios from "axios";
import { ACTIONS } from '../layout';
import { userDataContext } from '@/app/contexts/UniversalData';
import { useRouter } from 'next/navigation';
import { Switch } from '@headlessui/react';
import Input from '@mui/joy/Input';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import Button from '@mui/joy/Button';

function InputTemplate(props: any) {
	return (
		<label htmlFor={props.id} className={`${props.className} w-full font-medium flex flex-col gap-1`}>
			<input type={props.type} id={props.id} placeholder={props.placeholder}  className={`${props.className} bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 text-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none border-none`} />
			<span className='text-red-500'>error</span>
		</label>
	);
}

export default function MyModal(props: any) {
	let [isOpen, setIsOpen] = useState(false);
	const [token, setToken] = useState("");
	const [qrCodeActive, setQr] = useState(false);
	const [imgSrc, setSrc] = useState("./images/qrLoading.png");
	const router = useRouter();
	const avatarElement : any = useRef();
	const coverElement : any = useRef();
	const nickNameRef : any = useRef();
	const confirmPassRef : any = useRef();
	const passwordRef : any = useRef();
	const oldPassRef : any = useRef();
	const userData = useContext(userDataContext);
	function modalAppearance() {
		setIsOpen(oldState => !oldState)
	}

	function setImage(e: any)
	{
		const reader = new FileReader();
		reader.onload = async function(ev) {
			avatarElement.current.src = e.target!.result as string;
			const formData = new FormData();
			formData.append('avatar', e.target.files[0])
			await axios.put('http://127.0.0.1:3000/users/profile/avatar', formData, {
				withCredentials: true,
			}).then(res => props.dispatch({type: ACTIONS.UPDATE_AVATAR, payload: res.data}));
		}
		reader.readAsDataURL(e.target.files[0]);
	}

	function setCover(e: any)
	{
		const reader = new FileReader();
		reader.onload = async function(ev) {
			coverElement.current.src = e.target!.result as string;
			props.dispatch({type: ACTIONS.UPDATE_COVER, payload: ev.target!.result});
			const formData = new FormData();
			formData.append('cover', e.target.files[0])
			await axios.put('http://127.0.0.1:3000/users/profile/cover', formData, {
				withCredentials: true,
			}).then(res => props.dispatch({type: ACTIONS.UPDATE_COVER, payload: res.data}));
		}
		reader.readAsDataURL(e.target.files[0]);
	}

	function hundleChangeToken(ev)
	{
		setToken(ev.target.value);
	}

	function Two_factor_Auth()
	{
		setQr(prev => !prev);
	}

    async function formSubmitHandler(e: any) {
		//prevent website reload
        e.preventDefault();
		let p : number = 3;
		let oldPass : string;
        const newNickname = e.target[2].value as string;
		if (userData.password)
		{
			oldPass = e.target[3].value;
			p = 5;
		}
        const newPass = e.target[p].value;
        const confirmPass = e.target[4].value;
		if (newPass && confirmPass)
		{
			try {
				if (userData.password)
				{
					try{
						await axios.post('http://127.0.0.1:3000/users/profile/checkPassword ', {oldPass}, {
							withCredentials: true
						});
						oldPassRef.current.textContent = "";
					}catch(err)
					{
						oldPassRef.current.textContent = "Password Incorrect";
						oldPassRef.current.style.color = "E76161";
						return ;
					}
				}
				if (newPass === confirmPass)
				{
					await axios.post('http://127.0.0.1:3000/users/profile/password ', {confirmPass}, {
						withCredentials: true
					});
					passwordRef.current.textContent = "Password Updated";
					// oldPassRef.current.textContent = "";
					confirmPassRef.current.textContent = "";
					passwordRef.current.style.color = "#98D8AA";
					props.dispatch({type: ACTIONS.UPDATE_PASSWD, payload: true})
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
				if (newNickname.indexOf(' ') >= 0) {
					nickNameRef.current.textContent = "Nickname can't Contain Space";
					nickNameRef.current.style.color = "E76161";
					return ;
				}
					
				await axios.post('http://127.0.0.1:3000/users/profile/nickName', {newNickname}, {
					withCredentials: true
				});
				nickNameRef.current.textContent = "Updated";
				nickNameRef.current.style.color = "#98D8AA";
				props.dispatch({type: ACTIONS.UPDATE_NICKNAME, payload: newNickname});
				router.replace(window.location.href.replace(userData.nickname, newNickname));
			}
			catch(error)
			{
				if (error.response.status === 409)
					nickNameRef.current.textContent = "Nick Name Already In Use";
				if (error.response.status === 400)
					nickNameRef.current.textContent = "Nick Name Can't Contain Space";
				nickNameRef.current.style.color = "E76161";
			}
		}
		else
			alert("Can't save empty inputs");
	}

	async function activateQr()
	{
		try {
			await axios.post('http://127.0.0.1:3000/qr/codeCheck', {token}, {withCredentials: true});
		}
		catch(err)
		{
			console.log("Token miss match !");
		}
	}

	useEffect(() => {
		async function load() 
		{
			await axios.get('http://127.0.0.1:3000/qr/code', {
				withCredentials: true
			}).then(res => {
				console.log(res.data);
				if (res.data.Qr !== undefined)
					setSrc(res.data.Qr);
				setQr(res.data.active);
			}).catch(err => {console.log("error getting the Qr data !!!")});
		}

		load();
	}, []);
	
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
					<button onClick={modalAppearance} type="button" className="ml-[auto] mb-5 w-9 h-9 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg flex text-center justify-center items-center">x</button>
					<form onSubmit={formSubmitHandler} className="flex flex-col justify-center items-center gap-3">
						<div className="flex flex-col items-center justify-center w-full">
							<div ref={coverElement} className='w-full h-[150px] rounded-xl relative overflow-hidden'>
								<img ref={coverElement} src={userData.coverPic} alt="cover picture" className='object-cover mt-[auto] mb-[auto]'/>
								<label htmlFor="coverUpload" className="absolute bottom-0 right-0 w-10 h-10">
									<IoIosAddCircle className="absolute w-full h-full top-0 left-0 text-white cursor-pointer" />
									<input onChange={setCover} type="file" accept="image/png, image/gif, image/jpeg" className="hidden" id="coverUpload"/>
								</label>
							</div>
							<div className="relative h-[100px] aspect-square mt-[-50px] ">
								<img ref={avatarElement} id="avatar" className="h-full aspect-square mb-6 rounded-full" src={userData.profilePic} alt="avatar" />
								<label htmlFor="avatarUpload" className="absolute bottom-0 right-0 w-10 h-10">
									<IoIosAddCircle className="absolute w-full h-full top-0 left-0 text-white cursor-pointer" />
									<input onChange={setImage} type="file" accept="image/png, image/gif, image/jpeg" className="hidden" id="avatarUpload"/>
								</label>
							</div>
						</div>
						{/* <InputTemplate id='newNick' label='new Nickname' type='text' placeholder='Nickname'/> */}
						
						{/* NickName */}
						<label htmlFor='newNick' className='w-full font-medium flex flex-col gap-1'>
							<input type='text' id='newNick' placeholder='Nickname'  className='bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 text-gray-500 focus:ring-blue-500 focus:border-blue-500 outline-none border-none' />
							<span ref={nickNameRef} id="nickNameError" className='text-red-500'></span>
						</label>
						
						{/* { userData.password && <InputTemplate id='old Password' label='old Password' type='password' placeholder='Old Password'/>} */}
						
						{/* Old Password */}
						{userData.password && <label htmlFor='old Password' className='w-full font-medium flex flex-col gap-1'>
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
						<div className="flex flex-col gap-7 items-center mb-4 text-sm font-medium text-darken-300 dark:text-gray-300">
							<div className='flex items-center justify-center gap-5'>
								<Switch
									id='default-checkbox'
									checked={qrCodeActive}
									onChange={Two_factor_Auth}
									className={`${qrCodeActive ? 'bg-blueStrong' : 'bg-darken-300'}
									relative inline-flex h-[25px] w-[60px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
								>
									<span
									aria-hidden="true"
									className={`${qrCodeActive ? 'translate-x-8' : 'translate-x-0'}
										pointer-events-none inline-block h-[21px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
									/>
								</Switch>
								<label htmlFor="default-checkbox" className="cursor-pointer">Two-factor Authentication</label>
							</div>
							{
								qrCodeActive && <div className='flex flex-col items-center justify-center'>
									<img className=' mix-blend-multiply dark:mix-blend-lighten w-2/3 h-auto rounded-lg' src={imgSrc} alt="wait ..." />
									<Input
										value={token}
										onChange={hundleChangeToken}
										placeholder='Enter Token'
										startDecorator={<QrCodeScannerIcon color='primary' />}
										endDecorator={<Button onClick={activateQr}>Active 2FA</Button>}
									></Input>
								</div>
							}
							{/* <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 rounded ring-offset-gray-800 focus:ring-2bg-gray-700 border-gray-600"/> */}
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