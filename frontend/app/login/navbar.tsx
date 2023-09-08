'use client'

import { useEffect, useState } from 'react';
import './style.css'

export default function Navbar()
{
    const [isDisplayed, setDisplay] = useState(true);
    const collapse = () => {
        setDisplay(isDisplay => !isDisplay)
    }
    useEffect(()=>{
        window.addEventListener("resize", checkCollapse);
        function checkCollapse ()
        {
            if (window.innerWidth > 767)
                setDisplay(true);
        }
        return () => window.removeEventListener("resize", checkCollapse);
    }, []);

    return(
        <nav className="absolute top-0 left-0 w-full z-10">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="https://github.com/Asalek" className="hover:animate-pulse flex items-center">
                <img src="images/ping.png" className="h-8 mr-3" alt="Pongy" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">Pongy</span>
            </a>
            <button onClick={collapse} data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 ml-3 text-sm rounded-lg md:hidden focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="true">
                <span className="sr-only">Open main menu</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
            </button>
            {
                isDisplayed && <div className="w-full md:block md:w-auto" id="navbar-default">{/* change hidden with button click */}
                <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 border-gray-700">
                    <li>
                    <a href="#" className="block py-2 pl-3 pr-4 bg-blue-700 rounded md:bg-transparent md:p-0 text-white md:text-blue-500" aria-current="page">Home</a>
                    </li>
                    <li>
                    <a href="#" className="block py-2 pl-3 pr-4 rounded md:border-0 md:p-0 text-white md:hover:text-blue-500 hover:bg-gray-700 hover:text-white md:hover:bg-transparent">About</a>
                    </li>
                    <li>
                    <a href="#" className="block py-2 pl-3 pr-4 rounded md:border-0 md:p-0 text-white md:hover:text-blue-500 hover:bg-gray-700 hover:text-white md:hover:bg-transparent">Contact</a>
                    </li>
                </ul>
            </div>
            }
        </div>
        </nav>

    );
}