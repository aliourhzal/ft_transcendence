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
	const levelProgress: string = "5%"; 
	return (
		<div style={{backgroundImage: 'url("images/cyberpunk.png")', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}} className="text-md flex flex-col justify-between items-center md:justify-end md:items-end gap-3 w-[90%] mt-[3%] min-h-[550px] h-1/3 rounded-3xl">
			<div className="flex justify-center md:justify-start w-[100%] md:w-[70%] mt-4 md:mt-0">
				<div className="flex w-[90%] md:w-[60%] bg-darken-100/70 backdrop-blur-md justify-around py-3 rounded-full">
					<div className="flex gap-0 flex-col min-[500px]:flex-row items-center md:gap-2">
						<h2 className="text-blueStrong">Grade:&nbsp;</h2>
						<p className="text-whiteSmoke">Starter</p>
					</div>
					<div className="flex gap-0 flex-col min-[500px]:flex-row items-center md:gap-2">
						<h2 className="text-blueStrong">Wallet:&nbsp;</h2>
						<p className="text-whiteSmoke">1337</p>
					</div>
					<div className="flex gap-0 flex-col min-[500px]:flex-row items-center md:gap-2">
						<h2 className="text-blueStrong">Level:&nbsp;</h2>
						<p className="text-whiteSmoke">7</p>
					</div>
				</div>
			</div>
			<div className="flex flex-col md:flex-row items-center w-[100%] bg-darken-100/70 backdrop-blur-md h-[40%] rounded-b-3xl">{/* the fname lname div */}
				<div className="w-full md:w-[30%] h-[90px] md:h-full ">
					<img className='translate-y-[-50%] max-w-[150px] md:max-w-[250px] min-w-[150px] md:w-[70%] w-[40%] h-[auto] aspect-square m-[auto] rounded-full' src="images/guyAvatar.jpeg" alt="avatar" />
				</div>
				<div className="flex flex-col justify-evenly items-center md:items-start w-[100%] md:w-[70%] h-full">
					<div className="flex justify-between md:gap-20 md:justify-start w-[90%]">{/* row 1 */}
						<div className="flex flex-col items-center gap-1 md:items-start">
							<h2 className="text-gray-500 text-sm">First Name</h2>
							<p className="text-whiteSmoke">Ayoub</p>
						</div>
						<div className="flex flex-col items-center gap-1 md:items-start">
							<h2 className="text-gray-500 text-sm">Last Name</h2>
							<p className="text-whiteSmoke">Salek</p>
						</div>
						<div className="flex flex-col items-center gap-1 md:items-start ">
							<h2 className="text-gray-500 text-sm">Nick Name</h2>
							<p className="text-whiteSmoke">asalek</p>
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