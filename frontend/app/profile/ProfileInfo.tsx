"use client";
import Container from "@/components/UI/ProfileBoxs";
import MyModal from "./modalPopup";

// function Informations(props:any)
// {
//     return (
//         <div className="h-full w-full md:w-5/6">
//             <p className="pb-2 text-blueStrong">{props.title}</p>
//             <div className="text-whiteSmoke flex container bg-darken-300 justify-start rounded-lg md:gap-24 p-3 overflow-x-auto infoContainer">
//                 <h1>{props.attribute}</h1>
//             </div>
//         </div>
//     );
// }

// export default function ProfileInfo() {
//     return (
//         <Container className='items-center justify-center xl:w-3/6 w-5/6 mb-[auto]'>
//             <img className='w-5/12 h-auto' src="images/man.png" alt="avatar" />
//             <div className="flex flex-col items-center justify-center h-full w-full gap-8 ">
//                 <div className="flex w-full md:w-5/6 container bg-darken-300 justify-evenly md:justify-evenly rounded-lg pr-3 pl-3 p-2">
//                     <div className="flex flex-col items-center">
//                         <h2 className="text-blueStrong">Grade</h2>
//                         <p className="text-whiteSmoke font-sans">Learner</p>
//                     </div>
//                     <div className="flex flex-col items-center">
//                         <h2 className="text-blueStrong">Coins</h2>
//                         <p className="text-whiteSmoke font-sans">37</p>
//                     </div>
//                     <div className="flex flex-col items-center">
//                         <h2 className="text-blueStrong">Wallet</h2>
//                         <p className="text-whiteSmoke font-sans">1337</p>
//                     </div>
//                 </div>
//                 <Informations title="Name" attribute="Ayoub Salek"/>
//                 <Informations title="Email" attribute="ayoub.salek8599@gmail.com"/>
//                 <Informations title="Nickname" attribute="asalek"/>
//                 <MyModal />
//             </div>
//         </Container>
//     );
// }

export default function ProfileInfo()
{
	const levelProgress: string = "85%"; 
return (
	<div className="text-md flex items-end w-[80%] mt-[3%] h-1/4 lg:ml-[150px] ml-[20%] bg-yellow-200 rounded-3xl">
		<div className="gap-2 md:gap-16 flex items-center justify-center absolute h-8 w-[40%] bg-darken-100 ml-[19%] mb-[8.5rem] rounded-full">
			<div className="flex">
				<h2 className="text-blueStrong">Grade:&nbsp;</h2><p className="text-whiteSmoke">Starter</p>
			</div>
			<div className="flex">
				<h2 className="text-blueStrong">Wallet:&nbsp;</h2><p className="text-whiteSmoke">1337</p>
			</div>
			<div className="flex">
				<h2 className="text-blueStrong">Level:&nbsp;</h2><p className="text-whiteSmoke">7</p>
			</div>
		</div>
		<div className="w-[100%] bg-darken-100 bottom-0 h-[40%] rounded-b-3xl">{/* the fname lname div */}
			<div className="flex flex-col ml-[30%] gap-2 mt-5">
				<div className="flex gap-1 md:gap-20 items-cent">{/* row 1 */}
					<div className="flex flex-col gap-1 justify-cent">
						<h2 className="text-gray-500">First Name</h2>
						<p className="text-whiteSmoke">Ayoub</p>
					</div>
					<div className="flex flex-col gap-1 justify-cent">
						<h2 className="text-gray-500">Last Name</h2>
						<p className="text-whiteSmoke">Salek</p>
					</div>
					<div className="flex flex-col gap-1 justify-cent">
						<h2 className="text-gray-500">Nick Name</h2>
						<p className="text-whiteSmoke">asalek</p>
					</div>
				</div>
			</div>
			<div className=" mt-2 ml-[30%] w-[66%] rounded-full bg-gray-100 h-7">
				<div className="flex items-center justify-end bg-blue-600 text-xs h-7 font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{width: levelProgress}}>{levelProgress}</div>
			</div>
		</div>
		<img className=' absolute ml-6 mb-11 w-[15%] xl:w-[7%] ' src="images/man.png" alt="avatar" />
	</div>
)
}

//daisyUi
//react-daisyUi
//headlessUi