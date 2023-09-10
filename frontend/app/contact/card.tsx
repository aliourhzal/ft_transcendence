import { FaDiscord, FaGithub, FaLinkedin, FaYoutube } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { PiNumberFourBold, PiNumberTwoBold, PiNumberFourFill, PiNumberTwoFill } from 'react-icons/pi'

import React, { useState } from  'react';
import './style.css';
import Link from 'next/link';

export default function Card(props: {n : number, fullName: string, github: string
            , linkedin: string, discord: string, email: string, youtube: string, intra42:string})
{
    const us = [    '/images/us/ayoub_salek.jpg',
                    '/images/us/ali_ourhzal.jpeg',
                    '/images/us/taha_enamir.jpeg',
                    '/images/us/mustapha_essalih.jpeg'
    ];

    const [contact, setContact] = useState(false);
    function show(e: any)
    {
        // console.log(e.target.getAttribute('name'));//setAttribute
        if (e.target.getAttribute('name') === 'email')
        {
            setContact(true);
        }
    }
    function hide(e: any)
    {
        // console.log(e.target.getAttribute('name'));//setAttribute
        if (e.target.getAttribute('name') === 'email')
        {
            setContact(false);
        }
    }

    return (
        <div className="book bg-darken-100 w-full h-full">
            <div className='flex flex-col gap-4 w-[50%]'>
                <h1 className='font-Shantell text-blueStrong'>I'm at :</h1>
                <div className='grid grid-cols-2 gap-6 justify-items-center place-items-center'>
                    {
                        props.github !== "" &&
                        <Link href={props.github}>
                            <div className='flex gap-3 items-center justify-center cursor-pointer'>
                                    <FaGithub color='#2978F2' size={32}/>
                                    {/* <h2 className='font-Shantell text-lg'>Asalek</h2> */}
                            </div>
                        </Link>
                    }
                    {
                        props.linkedin !== "" &&
                        <Link href={props.linkedin}>
                            <div className='flex gap-3 items-center justify-center cursor-pointer'>
                                    <FaLinkedin color='#2978F2' size={32}/>
                            </div>
                        </Link>
                    }
                    {
                        props.discord !== "" &&
                        <Link href={props.discord}>
                            <div className='flex gap-3 items-center justify-center cursor-pointer'>
                                    <FaDiscord color='#2978F2' size={32}/>
                            </div>
                        </Link>
                    }
                    {
                        props.email !== "" &&
                        <Link href={`mailto:${props.email}`}>
                            <div className='flex gap-3 items-center justify-center cursor-pointer'>
                                    <MdEmail name='email' color='#2978F2' size={32} onMouseEnter={show} onMouseLeave={hide} title={props.email}/>
                                    {/* <div className="opacity-0 hover:opacity-100 duration-300 absolute z-10 flex */}
                                    {/*  bottom-10 justify-center items-center text-blue-950">Dwayne</div> */}
                            </div>
                        </Link>
                    }
                    {
                        props.youtube !== "" &&
                        <Link href={props.youtube}>
                            <div className='flex gap-3 items-center justify-center cursor-pointer'>
                                    <FaYoutube color='#2978F2' size={32}/>
                            </div>
                        </Link>
                    }
                    {
                        props.intra42 !== "" &&
                        <Link href={props.intra42}>
                            <div className='flex items-center m-[-5px] justify-center cursor-pointer bg-blueStrong rounded-lg w-10'>
                                    <PiNumberFourBold color='#232830' size={20}/>
                                    <PiNumberTwoBold color='#232830' size={20}/>
                            </div>
                        </Link>
                    }
                </div>
                
                {
                    contact &&
                        <h1 className='w-[80%] text-blue-400 border-dashed border-b-[1px] text-xs absolute right-3 bottom-2 text-ellipsis overflow-hidden'>
                            {props.email}
                        </h1>
                }
                
            </div>
            <div style={{backgroundImage: `url('${us[props.n]}')`}} className="cover bg-center bg-cover relative">
                <p className='text-blueStrong text-sm outline-double rounded-sm outline-offset-1 font-bold absolute top-1 right-1'>Hover me</p>
                <p className='text-whiteSmoke font-Cairo absolute bottom-7 outline1'>{props.fullName}</p>
            </div>
        </div>
    );
}