'use client'

import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from "react";
import {BsCheck2} from "react-icons/bs"
import {RxCross1} from "react-icons/rx"
import { InvitationSocketContext } from "@/app/context_sockets/InvitationWebSocket";


export default function FriendsRequests() {
	const [requestCounter, setRequestCounter] = useState(0);
	const [displayRequests, setDisplayRequests] = useState(false);
	const [requestArray, setRequestArray] = useState([]);
	const socket = useContext(InvitationSocketContext);

	useEffect(() => {
		console.log('friend is mounted')
		const requests = axios.get('http://127.0.0.1:3000/users/friend/requests', {
			withCredentials: true
		}).then(res => {
			setRequestArray(res.data);
			setRequestCounter(res.data.length);
		}).catch(err => console.log(err));
		socket.on('receive-request', (data) => {
			setRequestCounter(data.length);
			setRequestArray(data);
		})
	}, [])

	function modalAppearance() {
		setDisplayRequests(oldState => !oldState)
	}

	function createAcceptFunc(requestId: string) {
		return (async (e) => {
			try {
				socket.emit('accept-request', {
					requestId
				})
			} catch (err) {
				console.log(err);
			}
		})
	}

	function createRefuseFunc(requestId: string) {
		return (async (e) => {
			try {
				socket.emit('refuse-request', {
					requestId
				})
			} catch (err) {
				console.log(err);
			}
		})
	}

	return(
		<>
			<button className="p-3 text-white font-medium bg-darken-300 rounded-xl ml-[auto] relative" onClick={modalAppearance}>
				<span>Friend Requests</span>
				{
					requestCounter !== 0 && <span className="absolute bottom-[-10px] right-[-10px] bg-red-500 rounded-full h-[30px] aspect-square flex items-center justify-center">{requestCounter}</span>
				}
			</button>
			<Transition appear show={displayRequests} as={Fragment}>
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
						<Dialog.Panel className="flex flex-col items-center gap-3 w-full max-w-md transform overflow-hidden rounded-2xl bg-whiteSmoke p-6 text-left align-middle shadow-xl transition-all">
							{
								requestArray.length > 0 ? requestArray.map((request) => {
									return (
										<div key={request.id} className="flex rounded-md items-center gap-4 bg-darken-100 p-3 w-full">
											<img src={request.sender.profilePic} alt="avatar" className="h-[50px] aspect-square rounded-full"/>
											<span className="text-white font-medium">{request.sender.nickname}</span>
											<div className="ml-[auto] flex gap-3">
												<button className="h-[90%] aspect-square  rounded-full p-2 border-2 border-slate-500" onClick={createAcceptFunc(request.id)}>
													<BsCheck2 color="rgb(100 116 139)" fontSize="1.2rem"/>
												</button>
												<button className="h-[90%] aspect-square  rounded-full p-2 border-2 border-slate-500" onClick={createRefuseFunc(request.id)}>
													<RxCross1 color="rgb(100 116 139)" fontSize="1.2rem"/>
												</button>
											</div>
										</div>
									)
								}) : <span className="font-medium text-base">You have no Friend Requests</span>
							}
						</Dialog.Panel>
						</Transition.Child>
					</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}