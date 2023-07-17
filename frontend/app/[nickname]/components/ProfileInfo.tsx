'use client'

import { useState } from "react";
import ChangePicIcon from "./ChangePicIcon";

import { Informations } from "./profileContent";
import axios from "axios";

interface ProfileInfoProps {
	wallet: number,
	fname: string,
	lname:string,
	email: string,
	pic: string,
	nickname: string,
	changePic: Function,
	changeNickname: Function,
}

export default function ProfileInfo(props: ProfileInfoProps)
{
	const levelProgress: string = "85%";
	const [coverPic, setCoverPic] = useState("images/cyberpunk.png");

	function changeProfilePic(e: any)
	{
        const reader = new FileReader();
		reader.onload = async function(event) {
			props.changePic(event.target!.result);
			const formData = new FormData();
			formData.append('avatar', e.target.files[0])
			// call the api to change avatar
			await axios.put('http://127.0.0.1:3000/users/profile/avatar', formData, {
					withCredentials: true,
				}
			)
		}
		reader.readAsDataURL(e.target.files[0]);
	}

	function changeCoverPic(e: any) {
		const reader = new FileReader();
		reader.onload = async function(e) {
			setCoverPic(e.target!.result as string);
		}
		reader.readAsDataURL(e.target.files[0]);
	}

	return (
		<div style={{backgroundImage: `url(${coverPic})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}} className="text-md flex flex-col justify-between items-center md:justify-end md:items-end gap-3 w-[90%] mt-[3%] min-h-[550px] h-1/3 rounded-3xl relative">
			<ChangePicIcon inputId="coverPic" changePicFunc={changeCoverPic} className="absolute right-3 md:top-3 bottom-[41%] "/>
			<div className="flex justify-center md:justify-start w-[100%] md:w-[70%] mt-4 md:mt-0">
				<div className="flex w-[90%] md:w-[70%] bg-darken-100/70 backdrop-blur-md justify-around py-3 rounded-full">
					<div className="flex gap-0 flex-col sm:flex-row items-center md:gap-2">
						<h2 className="text-blueStrong">Grade:&nbsp;</h2>
						<p className="text-whiteSmoke">Starter</p>
					</div>
					<div className="flex gap-0 flex-col sm:flex-row items-center md:gap-2">
						<h2 className="text-blueStrong">Wallet:&nbsp;</h2>
						<p className="text-whiteSmoke">{props.wallet}</p>
					</div>
					<div className="flex gap-0 flex-col sm:flex-row items-center md:gap-2">
						<h2 className="text-blueStrong">Level:&nbsp;</h2>
						<p className="text-whiteSmoke">7</p>
					</div>
				</div>
			</div>
			<div className="flex flex-col md:flex-row items-center w-[100%] bg-darken-100/70 backdrop-blur-md h-[40%] rounded-b-3xl">{/* the fname lname div */}
				<div className="w-full md:w-[30%] h-[90px] md:h-full">
					<div style={{backgroundImage: `url(${props.pic as string})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover'}} className=' flex items-end justify-center p-3 translate-y-[-50%] max-w-[150px] md:max-w-[250px] min-w-[150px] md:w-[70%] w-[40%] h-[auto] aspect-square m-[auto] rounded-full'>
						<ChangePicIcon inputId="profilePic" changePicFunc={changeProfilePic} className="" />
					</div>
				</div>
				<div className="flex flex-col justify-evenly items-center md:items-start w-[100%] md:w-[70%] h-full">
					<div className="flex justify-evenly md:gap-20 md:justify-start w-[90%] ">{/* row 1 */}
						<div className="flex flex-col gap-1 items-start">
							<h2 className="text-gray-500 text-sm">First Name</h2>
							<p className="text-whiteSmoke">{props.fname}</p>
						</div>
						<div className="flex flex-col gap-1 items-start">
							<h2 className="text-gray-500 text-sm">Last Name</h2>
							<p className="text-whiteSmoke">{props.lname}</p>
						</div>
						<div className="flex flex-col gap-1 items-start ">
							<h2 className="text-gray-500 text-sm">Nick Name</h2>
							<p className="text-whiteSmoke">{props.nickname}</p>
						</div>
						<div className="flex flex-col items-center gap-1 md:items-start ">
							<h2 className="text-gray-500 text-sm">Email</h2>
							<p className="text-whiteSmoke">{props.email}</p>
						</div>
					</div>
					<div className=" w-[90%] rounded-full bg-darken-300 h-9">
						<div className="flex items-center justify-end bg-blue-600 text-xs h-full font-medium text-blue-100 text-center p-2 leading-none rounded-full" style={{width: levelProgress}}>{levelProgress}</div>
					</div>
				</div>
			</div>
		</div>
	)
}

//daisyUi
//react-daisyUi
//headlessUi