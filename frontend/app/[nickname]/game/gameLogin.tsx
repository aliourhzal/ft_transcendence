'use client'
import { useRef, useState } from "react"
import './utils/style.css'

export default function GameLogin()
{
    const [themeN, setThemeN] = useState(1);
    const def = useRef(null);
    const def2 = useRef(null);
    const def3 = useRef(null);
    const def1 = useRef(null);
    const T1 = useRef(null);
    const T2 = useRef(null);
    const T3 = useRef(null);
    const T4 = useRef(null);
    return(
        <div className=" w-full bg-darken-200 flex items-center justify-center h-full">
            <div className="w-[90%] h-3/4 max-sm:h-[95%] border-collapse bg-darken-100 rounded-xl">
                {/* Game Mode Radio Buttons */}
                <div className="w-full flex items-center justify-center gap-[30%] my-10">
                    <div className="flex flex-col items-center gap-3 relative tooltip">
                        <span className="tooltiptext opacity-25 top-16">Practice With a Bot</span>
                        <h1 className="text-whiteSmoke text-lg font-bold">Practice</h1>
                        <input className="h-5 w-5" type="radio" name="practice" id="" checked/>
                        {/* <Radio color="primary" size="lg" ttvariant="soft" name="radio-buttons" checked/> */}
                    </div>
                    <div className="flex flex-col items-center gap-3 relative tooltip">
                        <span className="tooltiptext opacity-25 top-16">1 v 1 Online Game</span>
                        <h1 className="text-whiteSmoke text-lg font-bold">Play Online</h1>
                        <input className="h-5 w-5" type="radio" name="practice" id="" />
                    </div>
                </div>
                {/* Themse */}
                <div style={{display:"grid", justifyItems:"center"}} className="w-full grid-cols-2 gap-x-2 gap-y-8 lg:grid-cols-4 mt-28">
                    <label className="relative text-center cursor-pointer"
                    onClick={()=>{
                        setThemeN(1);
                        T1.current.style.border = '5px solid #2978F2';
                        T2.current.style.border = 'none';
                        T3.current.style.border = 'none';
                        T4.current.style.border = 'none';
                    }}
                    onMouseEnter={()=>{def.current.style.visibility = 'hidden'}} onMouseOut={()=>{def.current.style.visibility = 'visible'}}>
                        <h1 style={{fontFamily: "Comic Sans MS"}} ref={def} className="outlineT absolute top-[40%] z-10 left-[36%] font-semibold font-mono">Default</h1>
                        {/* <input id="theme1" type="radio" className="hidden" /> */}
                        <img ref={T1} className="border-[5px] border-blueStrong rounded-md w-[200px] h-28 blur-[2px] hover:blur-none" src="/images/42.jpg" alt="" />
                    </label>
                    <label className="relative text-center cursor-pointer"
                    onClick={()=>{
                        setThemeN(2);
                        T2.current.style.border = '5px solid #2978F2';
                        T1.current.style.border = 'none';
                        T3.current.style.border = 'none';
                        T4.current.style.border = 'none';
                    }}
                    onMouseEnter={()=>{def1.current.style.visibility = 'hidden'}} onMouseOut={()=>{def1.current.style.visibility = 'visible'}}>
                        <h1 style={{fontFamily: "Comic Sans MS"}} ref={def1} className="outlineT absolute top-[40%] z-10 left-[40%] font-semibold font-mono">1988</h1>
                        {/* <input id="theme1" type="radio" className="hidden" /> */}
                        <img ref={T2} className="rounded-md w-[200px] h-28 blur-[2px] hover:blur-none" src="/images/42.jpg" alt="" />
                    </label>
                    <label className="relative text-center cursor-pointer"
                    onClick={()=>{
                        setThemeN(3);
                        T3.current.style.border = '5px solid #2978F2';
                        T1.current.style.border = 'none';
                        T2.current.style.border = 'none';
                        T4.current.style.border = 'none';
                    }}
                    onMouseEnter={()=>{def2.current.style.visibility = 'hidden'}} onMouseOut={()=>{def2.current.style.visibility = 'visible'}}>
                        <h1 style={{fontFamily: "Comic Sans MS"}} ref={def2} className="outlineT absolute top-[40%] z-10 left-[36%] font-semibold font-mono">Colory</h1>
                        {/* <input id="theme1" type="radio" className="hidden" /> */}
                        <img ref={T3} className="rounded-md w-[200px] h-28 blur-[2px] hover:blur-none" src="/images/42.jpg" alt="" />
                    </label>
                    <label className="relative text-center cursor-pointer"
                    onClick={()=>{
                        setThemeN(4);
                        T4.current.style.border = '5px solid #2978F2';
                        T1.current.style.border = 'none';
                        T2.current.style.border = 'none';
                        T3.current.style.border = 'none';
                    }}
                    onMouseEnter={()=>{def3.current.style.visibility = 'hidden'}} onMouseOut={()=>{def3.current.style.visibility = 'visible'}}>
                        <h1 style={{fontFamily: "Comic Sans MS"}} ref={def3} className="outlineT absolute top-[40%] z-10 left-[36%] font-semibold font-mono">Switcher</h1>
                        {/* <input id="theme1" type="radio" className="hidden" /> */}
                        <img ref={T4} className="rounded-md w-[200px] h-28 blur-[2px] hover:blur-none" src="/images/42.jpg" alt="" />
                    </label>
                </div>
                {/* Effects */}
                <div className="w-full flex max-sm:flex-col items-center gap-y-10 justify-evenly my-24">
                    <div className="flex flex-col gap-8 items-center">
                        <h1 className=" text-whiteSmoke text-xl">Special Effects</h1>
                        <div className="flex gap-16">
                            <div className="flex flex-col items-center gap-3">
                                <input className="h-5 w-5" type="radio" name="effects" id="" checked/>
                                <h1 className="text-whiteSmoke text-lg">ON</h1>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <input className="h-5 w-5" type="radio" name="effects" id=""/>
                                <h1 className="text-whiteSmoke text-lg">OFF</h1>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-8 items-center">
                        <h1 className=" text-whiteSmoke text-xl">Ball Colorized</h1>
                        <div className="flex gap-16">
                            <div className="flex flex-col items-center gap-3">
                                <input className="h-5 w-5" type="radio" name="ballC" id="" checked/>
                                <h1 className="text-whiteSmoke text-lg">ON</h1>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <input className="h-5 w-5" type="radio" name="ballC" id=""/>
                                <h1 className="text-whiteSmoke text-lg">OFF</h1>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-8 items-center">
                        <h1 className=" text-whiteSmoke text-xl">Targets</h1>
                        <div className="flex gap-16">
                            <div className="flex flex-col items-center gap-3">
                                <input className="h-5 w-5" type="radio" name="target" id="" checked/>
                                <h1 className="text-whiteSmoke text-lg">ON</h1>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <input className="h-5 w-5" type="radio" name="target" id=""/>
                                <h1 className="text-whiteSmoke text-lg">OFF</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-center">
                    <button className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-lg px-20 py-2.5 text-center mr-2 mb-2">Start</button>
                </div>
            </div>
        </div>
    );
}