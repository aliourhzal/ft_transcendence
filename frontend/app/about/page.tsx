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
        <div style={{backgroundImage: "url('/images/pongTable.jpeg')"}} className="bg-slate-900 relative bg-center bg-cover h-full w-full gap-10 flex flex-col items-center justify-center overflow-y-auto">
            <div className="w-full top-0 left-0 mb-14 lg:h-5">
                <Navbar />
            </div>

            <div className="container w-full flex justify-center">
                <h1 className="text-whiteSmoke text-5xl">
                    I'm {' '}
                    <span className="text-blueStrong font-medium">
                        {text}
                    </span>
                    <Cursor/>
                </h1>
            </div>

            <div className="container w-full h-3/4 flex static p-8 items-start justify-center gap-10 overflow-y-auto">
                <div className="w-full h-full justify-items-center content-start gap-5 grid 2xl:grid-cols-4 md:grid-cols-2">
                    <Card n={0} fullName="Ayoub Salek" github="https://github.com/Asalek"
                    linkedin="https://www.linkedin.com/in/ayoub-salek-3841811b7/"
                    discord="https://discordapp.com/users/580557639180746762"
                    email="ayoub.salek8599@gmail.com"
                    youtube="https://www.youtube.com/@devasalek2582"
                    intra42="https://profile.intra.42.fr/users/asalek"
                    />
                    <Card n={1} fullName="Ali Ourhzal"
                        github="https://github.com/aliourhzal"
                        discord="https://discordapp.com/users/904985690306125834"
                        email=""
                        linkedin=""
                        youtube=""
                        intra42="https://profile.intra.42.fr/users/aourhzal"
                        />
                    <Card n={2} fullName="Taha Namir"
                        github="https://github.com/etahae"
                        discord=""
                        email=""
                        linkedin=""
                        youtube=""
                        intra42="https://profile.intra.42.fr/users/tnamir"
                        />
                    <Card n={3} fullName="Mustapha Essalih"
                        github="https://github.com/messalih1"
                        discord=""
                        email=""
                        linkedin=""
                        youtube=""
                        intra42="https://profile.intra.42.fr/users/messalih"
                    />
                </div>
            </div>
        </div>
    );
}