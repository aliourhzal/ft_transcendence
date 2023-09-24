import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react';

export default function Popup(props) {
    return (
        <Transition appear show={props.isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={props.modalAppearance}>
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
				<Dialog.Panel className={`${props.additionalClass} w-full max-w-md transform overflow-hidden rounded-2xl bg-whiteSmoke p-6 text-left align-middle shadow-xl transition-all`}>
                    {props.children}
				</Dialog.Panel>
				{/* outside pop Up */}
				</Transition.Child>
			</div>
			</div>
		</Dialog>
		</Transition>
    );
}