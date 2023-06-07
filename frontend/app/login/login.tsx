import AuthButton from "@/components/UI/AuthButton";
import Navbar from "./navbar"
import Script from "next/script";

export default function Login()
{
    return (
        <main style={{backgroundImage: "url('images/pongTable.jpeg')"}}  className='h-full w-full flex flex-col items-center justify-center bg-slate-900 bg-center bg-cover'>
            {/* <canvas id="ball" className="bg-transparent h-full w-full"></canvas> */}
            <Navbar />
            <div className='container flex items-center justify-center flex-col gap-6 bg-slate-700/30 p-10 lg:w-1/4 rounded-xl backdrop-blur-[3px] hover:backdrop-blur-[9px]  md:w-2/4'>
                <input className='pt-2 pb-2 w-4/5 rounded text-center bg-transparent border-white border text-white outline-none placeholder-white' type="text" placeholder='login'/>
                <input className='pt-2 pb-2 w-4/5 rounded text-center bg-transparent border-white border text-white outline-none placeholder-white' type="text" placeholder='password'/>
                <span className='text-white'>Or</span>
                <hr className='border-slate-500 w-full'/>
                <div className='flex items-cente justify-between w-full'>
                    <AuthButton src="images/42.png" alt="42 intra" link="http://10.11.100.162:3000/auth/42"/>
                    <AuthButton src="images/google.png" alt="42 intra" link=""/>
                    <AuthButton src="images/facebook.png" alt="42 intra" link=""/>
                </div>
            </div>
            <Script src="../../script.js" defer>
                
            </Script>
        </main>
    );
}