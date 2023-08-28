"use client"
import AuthButton from "@/components/UI/AuthButton";
import Navbar from "./navbar"
import Script from "next/script";
import { useEffect, useRef } from "react";
import axios from "axios";
import Router, { useRouter } from "next/navigation";

function useKey(key, cb)
{
    const callbackRef = useRef(cb);

    useEffect(() => {
        callbackRef.current = cb;
    })

    useEffect(() => {
        function hundle(event)
        {
            if (event.code === key){
                callbackRef.current(event);
            }
        }
        document.addEventListener("keypress", hundle);
        return () => document.removeEventListener("keypress", hundle);
    })
}
export default function Login()
{
    const loginRef = useRef(null);
    const PasswdRef = useRef(null);
    const router = useRouter();

    async function hundleEnter()
    {
        const login = loginRef.current.value;
        const passwd = PasswdRef.current.value;
        // alert(login + " " + passwd);
        try
        {
            await axios.post('http://127.0.0.1:3000/auth/login ', {login, passwd}, {
                withCredentials: true
            });
            router.push(`http://127.0.0.1:3001/${login}`);
        }
        catch(err)
        {
            alert("User " + login + " not registered or wrong password");
        }
    }
    useKey("Enter", hundleEnter);
    useKey("NumpadEnter", hundleEnter);
    return (
        <main style={{backgroundImage: "url('/images/pongTable.jpeg')"}}  className='h-full w-full flex flex-col items-center justify-center bg-slate-900 bg-center bg-cover'>
            <canvas id="canvas" className="bg-transparent h-1/2 w-full absolute left-0 top-0"></canvas>
            <Navbar />
            <div className='container md:w-3/4 lg:w-2/4 2xl:w-1/4 relative flex items-center justify-center flex-col bg-slate-700/30 p-10 rounded-xl backdrop-blur-[3px] hover:backdrop-blur-[9px]'>
                <input ref={loginRef} className=' mb-6 pt-2 pb-2 w-4/5 rounded text-center bg-transparent border-white border text-white outline-none placeholder-white' type="text" placeholder='login'/>
                <input ref={PasswdRef} className=' mb-6 pt-2 pb-2 w-4/5 rounded text-center bg-transparent border-white border text-white outline-none placeholder-white' type="password" placeholder='password'/>
                <span className='text-white mb-6'>Or</span>
                <hr className='border-slate-500 w-full mb-6'/>
                <div className='flex items-cente justify-between w-full'>
                    <AuthButton src="images/42.png" alt="42 intra" link="http://127.0.0.1:3000/auth/42"/>
                    <AuthButton src="images/google.png" alt="google" link=""/>
                    <AuthButton src="images/facebook.png" alt="facebook" link=""/>
                </div>
            </div>
            <script src="../script.js" />
        </main>
    );
}