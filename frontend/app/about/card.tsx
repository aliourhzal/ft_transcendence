import { FaDiscord, FaGithub, FaLinkedin } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'

import React, { useState } from  'react';
import './style.css';
import Link from 'next/link';

export default function Card(props: {n : number, fullName: string, github: string
            , linkedin: string, discord: string, email: string})
{
    const us = [    '/images/us/ayoub_salek.jpg',
                    '/images/us/ali_ourhzal.jpeg',
                    '/images/us/taha_enamir.jpeg',
                    '/images/us/mustapha_essalih.jpeg'
                ];

    const [contact, setContact] = useState(false);
    function show(e)
    {
        console.log(e.target.getAttribute('name'));//setAttribute
    }

    return (
        <div className="book bg-slate-600 w-full h-full">
            <div className='flex flex-col gap-4 w-[50%]'>
                <h1>I'm at :</h1>
                <div className='grid grid-cols-2 gap-6'>
                    <Link href={props.github}>
                        <div className='flex gap-3 items-center justify-center cursor-pointer'>
                                <FaGithub color='#2978F2' size={32} onMouseEnter={show}/>
                                {/* <h2 className='font-Shantell text-lg'>Asalek</h2> */}
                        </div>
                    </Link>
                    <Link href={props.linkedin}>
                        <div className='flex gap-3 items-center justify-center cursor-pointer'>
                                <FaLinkedin color='#2978F2' size={32} onMouseEnter={show}/>
                        </div>
                    </Link>
                    <Link href={props.discord}>
                        <div className='flex gap-3 items-center justify-center cursor-pointer'>
                                <FaDiscord color='#2978F2' size={32} onMouseEnter={show}/>
                        </div>
                    </Link>
                    <Link href={`mailto:${props.email}`}>
                        <div className='flex gap-3 items-center justify-center cursor-pointer'>
                                <MdEmail name='email' color='#2978F2' size={32} onMouseEnter={show}/>
                                {/* <div className="opacity-0 hover:opacity-100 duration-300 absolute z-10 flex */}
                                {/*  bottom-10 justify-center items-center text-blue-950">Dwayne</div> */}
                        </div>
                    </Link>
                </div>
                <h1 className=' text-sm'>
                    {/* contact here */}
                </h1>
                
            </div>
            <div style={{backgroundImage: `url('${us[props.n]}')`}} className="cover bg-center bg-cover relative">
                <p className='text-blueStrong text-sm outline-double rounded-sm outline-offset-1 font-bold absolute top-1 right-1'>Hover me</p>
                <p className='text-whiteSmoke font-Cairo absolute bottom-7 outline1'>{props.fullName}</p>
            </div>
        </div>
    );
}