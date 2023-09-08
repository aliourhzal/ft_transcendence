'use client'
import Card from "./card";
import { useTypewriter, Cursor } from 'react-simple-typewriter'
import Navbar from '../login/navbar';

export default function About()
{
    const [text] = useTypewriter({
        words: ['Ayoub Salek', 'Ali Ourhzal', 'Mustapha Essalih', 'Taha Enamir'],
        loop: true,
        typeSpeed: 100,
        deleteSpeed: 60
    });
    return (
        <div style={{backgroundImage: "url('/images/pongTable.jpeg')"}} className="bg-slate-900 bg-center bg-cover h-full w-full flex flex-col items-center justify-center overflow-y-auto">
            <Navbar />
                <h1 className="text-whiteSmoke text-5xl absolute max-sm:top-56 sm:top-56 z-10">
                    I'm {' '}
                    <span className="text-blueStrong font-medium">
                        {text}
                    </span>
                    <Cursor/>
                </h1>
            <div className="w-full flex flex-col items-center justify-center max-sm:mt-72 sm:mt-72 gap-10 overflow-y-auto">
                <div className="h-[65%] items-center justify-items-center content-center gap-5 grid min-sm:grid-cols-2 2xl:grid-cols-4 md:grid-cols-2">
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                </div>
            </div>
        </div>
    );
}