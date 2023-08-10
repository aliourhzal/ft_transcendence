'use client'
import { useRef, useState } from "react"
import './utils/style.css'
import Game from "./Game";
import dynamic from "next/dynamic";
import Lottie from 'react-lottie';
import * as pongLoading from "./utils/pongLoading.json";
import botLoading from './utils/botLoading.json';
import BotPractice from "./oldGame";
import { Divider } from "@nextui-org/react";

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: pongLoading,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
};
const BotLottie = {
    loop: true,
    autoplay: true,
    animationData: botLoading,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
};

const LazyGame = dynamic(() => import('./Game'), {
	ssr: false,
	loading: () => 
    <Lottie 
        options={defaultOptions}
        width={400}
        height={400}
    />
});

const BotGame = dynamic(() => import('./oldGame'), {
	ssr: false,
	loading: () => 
    <Lottie 
        options={BotLottie}
        width={400}
        height={300}
    />
});

function ModeRadio( props : any )
{
    return (
        <div className="w-full flex items-center justify-center gap-[30%] my-10">
            <div className="flex flex-col items-center gap-3 relative tooltip">
                <span className="tooltiptext opacity-25 top-16">Practice With a Bot</span>
                <h1 className="text-whiteSmoke text-lg font-bold">Practice</h1>
                <input className="h-5 w-5" type="radio" name="practice" id="" defaultChecked onChange={()=>{props.setOp("bot")}}/>
                {/* <Radio color="primary" size="lg" ttvariant="soft" name="radio-buttons" checked/> */}
            </div>
            <div className="flex flex-col items-center gap-3 relative tooltip">
                <span className="tooltiptext opacity-25 top-16">1 v 1 Online Game</span>
                <h1 className="text-whiteSmoke text-lg font-bold">Play Online</h1>
                <input className="h-5 w-5" type="radio" name="practice" id="" onChange={()=>{props.setOp("online")}}/>
            </div>
        </div>
    );
}

function Themes(props: any)
{
    return (
        <div style={{display:"grid", justifyItems:"center"}} className="w-full grid-cols-2 gap-x-2 gap-y-8 lg:grid-cols-4 mt-28">
            <label className="relative text-center cursor-pointer"
            onClick={()=>{
                props.setThemeN(1);
                props.T1.current.style.border = '5px solid #2978F2';
                props.T2.current.style.border = 'none';
                props.T3.current.style.border = 'none';
                props.T4.current.style.border = 'none';
            }}
            onMouseEnter={()=>{props.def.current.style.visibility = 'hidden'}} onMouseOut={()=>{props.def.current.style.visibility = 'visible'}}>
                <h1 style={{fontFamily: "Comic Sans MS"}} ref={props.def} className="outlineT absolute top-[40%] z-10 left-[36%] font-semibold font-mono">Default</h1>
                {/* <input id="theme1" type="radio" className="hidden" /> */}
                <img ref={props.T1} className="border-[5px] border-blueStrong rounded-md w-[200px] h-28 blur-[2px] hover:blur-none" src="/images/42.jpg" alt="" />
            </label>
            <label className="relative text-center cursor-pointer"
            onClick={()=>{
                props.setThemeN(2);
                props.T2.current.style.border = '5px solid #2978F2';
                props.T1.current.style.border = 'none';
                props.T3.current.style.border = 'none';
                props.T4.current.style.border = 'none';
            }}
            onMouseEnter={()=>{props.def1.current.style.visibility = 'hidden'}} onMouseOut={()=>{props.def1.current.style.visibility = 'visible'}}>
                <h1 style={{fontFamily: "Comic Sans MS"}} ref={props.def1} className="outlineT absolute top-[40%] z-10 left-[40%] font-semibold font-mono">1988</h1>
                {/* <input id="theme1" type="radio" className="hidden" /> */}
                <img ref={props.T2} className="rounded-md w-[200px] h-28 blur-[2px] hover:blur-none" src="/images/42.jpg" alt="" />
            </label>
            <label className="relative text-center cursor-pointer"
            onClick={()=>{
                props.setThemeN(3);
                props.T3.current.style.border = '5px solid #2978F2';
                props.T1.current.style.border = 'none';
                props.T2.current.style.border = 'none';
                props.T4.current.style.border = 'none';
            }}
            onMouseEnter={()=>{props.def2.current.style.visibility = 'hidden'}} onMouseOut={()=>{props.def2.current.style.visibility = 'visible'}}>
                <h1 style={{fontFamily: "Comic Sans MS"}} ref={props.def2} className="outlineT absolute top-[40%] z-10 left-[36%] font-semibold font-mono">Colory</h1>
                {/* <input id="theme1" type="radio" className="hidden" /> */}
                <img ref={props.T3} className="rounded-md w-[200px] h-28 blur-[2px] hover:blur-none" src="/images/42.jpg" alt="" />
            </label>
            <label className="relative text-center cursor-pointer"
            onClick={()=>{
                props.setThemeN(4);
                props.T4.current.style.border = '5px solid #2978F2';
                props.T1.current.style.border = 'none';
                props.T2.current.style.border = 'none';
                props.T3.current.style.border = 'none';
            }}
            onMouseEnter={()=>{props.def3.current.style.visibility = 'hidden'}} onMouseOut={()=>{props.def3.current.style.visibility = 'visible'}}>
                <h1 style={{fontFamily: "Comic Sans MS"}} ref={props.def3} className="outlineT absolute top-[40%] z-10 left-[36%] font-semibold font-mono">Switcher</h1>
                {/* <input id="theme1" type="radio" className="hidden" /> */}
                <img ref={props.T4} className="rounded-md w-[200px] h-28 blur-[2px] hover:blur-none" src="/images/42.jpg" alt="" />
            </label>
        </div>
    );
}

function Effects(props: any)
{
    return (
        <>
        {/* Special Effects */}
        <div className="w-full flex max-sm:flex-col items-center gap-y-10 justify-evenly my-24">
            <div className="flex flex-col gap-8 items-center">
                <h1 className=" text-whiteSmoke text-xl">Special Effects</h1>
                <div className="flex gap-16">
                    <div className="flex flex-col items-center gap-3">
                        <input className="h-5 w-5" type="radio" name="effects" id="" defaultChecked/>
                        <h1 className="text-whiteSmoke text-lg">ON</h1>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <input className="h-5 w-5" type="radio" name="effects" id=""/>
                        <h1 className="text-whiteSmoke text-lg">OFF</h1>
                    </div>
                </div>
            </div>
            {/* Ball Colorized */}
            <div className="flex flex-col gap-8 items-center">
                <h1 className=" text-whiteSmoke text-xl">Ball Colorized</h1>
                <div className="flex gap-16">
                    <div className="flex flex-col items-center gap-3">
                        <input className="h-5 w-5" type="radio" name="ballC" id="" defaultChecked/>
                        <h1 className="text-whiteSmoke text-lg">ON</h1>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <input className="h-5 w-5" type="radio" name="ballC" id=""/>
                        <h1 className="text-whiteSmoke text-lg">OFF</h1>
                    </div>
                </div>
            </div>
            {/* Hell Of Flame */}
            <div className="flex flex-col gap-8 items-center">
                <h1 className=" text-whiteSmoke text-xl">Hell Of Flame</h1>
                <div className="flex gap-16">
                    <div className="flex flex-col items-center gap-3">
                        <input className="h-5 w-5" type="radio" name="target" id="" onClick={() => props.setHell(true)}/>
                        <h1 className="text-whiteSmoke text-lg">ON</h1>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <input className="h-5 w-5" type="radio" name="target" id="" onClick={() => props.setHell(false)} defaultChecked/>
                        <h1 className="text-whiteSmoke text-lg">OFF</h1>
                    </div>
                </div>
            </div>
        </div>
        {/* Start Game */}
        <div className="w-full flex justify-center">
            <button className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-lg px-20 py-2.5 text-center mr-2 mb-2"
            onClick={()=>{
                props.main.current.style.display = 'none';
                (props.playWith === "bot" ? props.setMode("bot") : props.setMode('online'))
            }}>Start</button>
        </div>
        {/* Spaces */}
        <div><p>&nbsp;</p></div>
        </>
    );
}

export default function GameLogin()
{
    const [playWith, setOp] = useState("bot"); // online
    const [themeN, setThemeN] = useState(1);
    const [hell, setHell] = useState(false);
    const [Mode, setMode] = useState("");
    const def = useRef(null);
    const def2 = useRef(null);
    const def3 = useRef(null);
    const def1 = useRef(null);
    const T1 = useRef(null);
    const T2 = useRef(null);
    const T3 = useRef(null);
    const T4 = useRef(null);
    const main = useRef(null);
    return(
        <div className=" w-full bg-darken-200 flex items-center justify-center h-full">
            <div ref={main} className="w-[90%] h-auto px-5 py-1 max-sm:h-[95%] border-collapse bg-darken-100 rounded-xl">
                {/* Game Mode Radio Buttons */}
                <ModeRadio setOp={setOp}/>
                {/* Themse */}
                <Themes setThemeN={setThemeN} T1={T1} T2={T2} T3={T3} T4={T4} def={def} def1={def1} def2={def2} def3={def3} />
                {/* Effects */}
                <Effects setHell={setHell} setMode={setMode} main={main} playWith={playWith} />
            </div>    
            {/* {!show && } */}t
            {(Mode === "online" && <LazyGame hell={hell} />) || (Mode==="bot" && <BotGame />)}
        </div>
    );
}