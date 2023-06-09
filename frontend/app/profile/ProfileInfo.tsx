"use client";
import Container from "@/components/UI/ProfileBoxs";
import { Dialog, Transition } from '@headlessui/react'
import { Clicker_Script } from "next/font/google";
import { Fragment, useState } from 'react';
import { IoIosAddCircle } from "react-icons/io";

function MyModal() {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  function clickUpload()
  {
    document.getElementById("avatarUpload")?.click();
  }
  function setImage()
  {
          // Retrieve the input and image elements
      const input = (document.getElementById("avatarUpload")!) as HTMLInputElement ;
      const avatar = (document.getElementById("avatar")!) as HTMLImageElement;

      // Add event listener for changes in the input field
      input.addEventListener("change", function() {
        // Check if any file is selected
        if (input.files && input.files[0]) {
          // Create a FileReader object to read the file
          const reader = new FileReader();

          // Define the onload event handler
          reader.onload = function(e) {
            // Set the source of the image to the selected file
            avatar.src = e.target!.result as string;
          };

          // Read the selected file as a data URL
          reader.readAsDataURL(input.files[0]);
        }
      });
  }

  return (
    <div>
        <button onClick={openModal} className="btn bg-blue-700 hover:bg-blueStrong text-white font-bold py-3 px-9 border border-blue-900 rounded-md">
                    Settings
		</button>
		{/* password image displayName(login) X to close save to save */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
					<button onClick={closeModal} type="button" className=" absolute right-[7%] w-9 h-9 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-lg flex text-center justify-center items-center">x</button>
					<div className="flex flex-col justify-center items-center gap-3">
					<img id="avatar" className="h-1/4 w-1/4 mb-6" src="images/man.png" alt="avatar" />
            <div>
              <input onClick={setImage} type="file" accept="image/png, image/gif, image/jpeg" className="hidden" id="avatarUpload" />
              <IoIosAddCircle onClick={clickUpload} className="absolute w-10 h-10 top-[19%] right-[37%] text-gray-600 " />
            </div>
          <input type="text" className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 text-gray-500 focus:ring-blue-500 focus:border-blue-500" placeholder="Display Name" required></input>
					<input type="password" className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 text-gray-500 focus:ring-blue-500 focus:border-blue-500" placeholder="Password" required></input>
					<input type="password" className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 text-gray-500 focus:ring-blue-500 focus:border-blue-500" placeholder="Confirm Password" required></input>
						<div className="flex items-center mb-4">
							<input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 rounded ring-offset-gray-800 focus:ring-2bg-gray-700 border-gray-600"/>
							<label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Two-factor Authentication</label>
						</div>
						<button type="button" className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Save</button>
					</div>
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



function Informations(props:any)
{
    return (
        <div className="h-full w-full md:w-5/6">
            <p className="pb-2 text-blueStrong">{props.title}</p>
            <div className="text-whiteSmoke flex container bg-darken-300 justify-start rounded-lg md:gap-24 p-3 overflow-x-auto infoContainer">
                <h1>{props.attribute}</h1>
            </div>
        </div>
    );
}

export default function ProfileInfo() {
    return (
        <Container className='items-center justify-center xl:w-3/6 w-5/6 mb-[auto]'>
            <img className='w-5/12 h-auto' src="images/man.png" alt="avatar" />
            <div className="flex flex-col items-center justify-center h-full w-full gap-8 ">
                <div className="flex w-full md:w-5/6 container bg-darken-300 justify-evenly md:justify-evenly rounded-lg pr-3 pl-3 p-2">
                    <div className="flex flex-col items-center">
                        <h2 className="text-blueStrong">Grade</h2>
                        <p className="text-whiteSmoke font-sans">Learner</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <h2 className="text-blueStrong">Coins</h2>
                        <p className="text-whiteSmoke font-sans">37</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <h2 className="text-blueStrong">Wallet</h2>
                        <p className="text-whiteSmoke font-sans">1337</p>
                    </div>
                </div>
                <Informations title="Name" attribute="Ayoub Salek"/>
                <Informations title="Email" attribute="ayoub.salek8599@gmail.com"/>
                <Informations title="Nickname" attribute="asalek"/>
               
                {MyModal()}
            </div>
        </Container>
    );
}

//daisyUi
//react-daisyUi
//headlessUi