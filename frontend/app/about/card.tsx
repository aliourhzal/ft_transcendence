
import React from  'react';
import './style.css';

export default function Card(props: {n : number, fullName: string})
{
    const us = [    '/images/us/ayoub_salek.jpg',
                    '/images/us/ali_ourhzal.jpeg',
                    '/images/us/taha_enamir.jpeg',
                    '/images/us/mustapha_essalih.jpeg'
                ];

    return (
        <div className="book bg-slate-600 w-full h-full">
            <p>Hello</p>
            <div style={{backgroundImage: `url('${us[props.n]}')`}} className="cover bg-center bg-cover relative">
                <p className='text-blueStrong text-sm outline-double rounded-sm outline-offset-1 font-bold absolute top-1 right-1'>Hover me</p>
                <p className='text-whiteSmoke font-Cairo absolute bottom-7 outline1'>{props.fullName}</p>
            </div>
        </div>
    );
}