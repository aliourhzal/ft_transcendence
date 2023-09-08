'use client'
import { Fragment, SetStateAction, useRef, useState } from "react"
import './utils/style.css';
import dynamic from "next/dynamic";
import Lottie from 'react-lottie';
import * as pongLoading from "./utils/pongLoading.json";
import botLoading from './utils/botLoading.json';
import startButton from './utils/startButton.json';
import { Dialog, Transition } from "@headlessui/react";
import { CirclePicker } from 'react-color'
import { useSearchParams } from "next/navigation";

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: pongLoading,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
};
const startbuttonGame = {
    loop: true,
    autoplay: true,
    animationData: startButton,
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
	loading: () => <p className="text-whiteSmoke text-7xl"> . . . </p>
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
        <>
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
                <img ref={props.T1} className="border-[5px] border-blueStrong rounded-md w-[200px] h-28 blur-[2px] hover:blur-none" src="/images/default_T1.png" alt="" />
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
                <img ref={props.T2} className="rounded-md w-[200px] h-28 blur-[2px] hover:blur-none" src="/images/1988_T2.png" alt="" />
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
                <h1 style={{fontFamily: "Comic Sans MS"}} ref={props.def2} className="outlineT absolute top-[40%] z-10 left-[36%] font-semibold font-mono">Bright</h1>
                {/* <input id="theme1" type="radio" className="hidden" /> */}
                <img ref={props.T3} className="rounded-md w-[200px] h-28 blur-[2px] hover:blur-none" src="/images/bright_T3.png" alt="" />
            </label>
            <label className="relative text-center cursor-pointer"
            onClick={()=>{
                props.setThemeN(4);
                props.setIsOpen(true);
                props.T4.current.style.border = '5px solid #2978F2';
                props.T1.current.style.border = 'none';
                props.T2.current.style.border = 'none';
                props.T3.current.style.border = 'none';
            }}
            onMouseEnter={()=>{props.def3.current.style.visibility = 'hidden'}} onMouseOut={()=>{props.def3.current.style.visibility = 'visible'}}>
                <h1 style={{fontFamily: "Comic Sans MS"}} ref={props.def3} className="outlineT absolute top-[40%] z-10 left-[36%] font-semibold font-mono">Custom</h1>
                {/* <input id="theme1" type="radio" className="hidden" /> */}
                <img ref={props.T4} className="rounded-md w-[200px] h-28 blur-[2px] hover:blur-none" src="/images/custom.png" alt="" />
            </label>
        </div>
        <CustomPopUp colors={props.colors} setC={props.setC} isOpen={props.isOpen} setIsOpen={props.setIsOpen}/>
        </>
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
                        <input className="h-5 w-5" type="radio" name="effects" id="" onClick={() => props.setEffect(true)}/>
                        <h1 className="text-whiteSmoke text-lg">ON</h1>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <input className="h-5 w-5" type="radio" name="effects" id="" onClick={() => props.setEffect(false)} defaultChecked/>
                        <h1 className="text-whiteSmoke text-lg">OFF</h1>
                    </div>
                </div>
            </div>
            {/* Ball Colorized */}
            <div className="flex flex-col gap-8 items-center">
                <h1 className=" text-whiteSmoke text-xl">Ball Colorized</h1>
                <div className="flex gap-16">
                    <div className="flex flex-col items-center gap-3">
                        <input className="h-5 w-5" type="radio" name="ballC" id="" onClick={() => props.setBall(true)}/>
                        <h1 className="text-whiteSmoke text-lg">ON</h1>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <input className="h-5 w-5" type="radio" name="ballC" id="" onClick={() => props.setBall(false)} defaultChecked/>
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

export function CustomPopUp(props)
{
    // const [colors, setC] = useState({
    //     p1: "#2879F2",
    //     p2: "#E8EAEB",
    //     bc: "#FFFFFF",
    //     bg: "#353D49"
    // });
    const [chosenColor, setColor] = useState("");//Color picker
    const [changeAt , setChange] = useState(1); //number of element to switch color: 1&2 : players, 3:backgrounf, 4: ballColor 
 
    function checkWhereToset(color)
    {
        setColor(color);
        if (changeAt === 1)
            props.setC(oldC => ({...oldC, p1 : color}));
        if (changeAt === 2)
            props.setC(oldC => ({...oldC, bc : color}));
        if (changeAt === 3)
            props.setC(oldC => ({...oldC, bg : color}));
        if (changeAt === 4)
            props.setC(oldC => ({...oldC, p2 : color}));
    }
    function modalAppearance() {
		props.setIsOpen(oldState => !oldState)
	}
    return (
        <div>
            <Transition appear show={props.isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={modalAppearance}>
                <Transition.Child as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25"></div>
                </Transition.Child>
    
                <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                    >
                    {/* inside pop Up */}
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-whiteSmoke p-6 text-left align-middle shadow-xl transition-all">
                        <div className="flex items-center justify-center flex-col h-full gap-6">
                            {/* canva */}
                            <div  style={{backgroundColor:props.colors.bg}} className="relative w-full h-[200px] bg-darken-300 rounded-md">
                                <div style={{backgroundColor:props.colors.p1}} className="absolute h-20 top-16 w-4 bg-blueStrong">
                                </div>
                                <div style={{backgroundColor:props.colors.p2}} className="absolute h-20 top-16 right-0 w-4 bg-white">
                                </div>
                                <div className="absolute left-[48%] border-dashed border-white border-2 h-[200px]">
                                </div>
                                <div style={{backgroundColor:props.colors.bc}} className="absolute left-[45.5%] top-[45%] h-6 w-6 bg-white rounded-full">
                                </div>
                            </div>
                            <div className="flex items-center justify-center w-full">
                                <div className="radio-input w-[100%] justify-evenly">
                                    <label className="label">
                                        <input type="radio" name="radio" defaultChecked onClick={()=>{setChange(1)}} />
                                        <span style={{backgroundColor:props.colors.p1}} className="check"></span>
                                    </label>
                                    <label className="label">
                                        <input type="radio" name="radio" onClick={()=>{setChange(2)}}/>
                                        <span style={{backgroundColor:props.colors.bc}} className="check"></span>
                                    </label>
                                    <label className="label">
                                        <input type="radio" name="radio" onClick={()=>{setChange(3)}}/>
                                        <span style={{backgroundColor:props.colors.bg}} className="check"></span>
                                    </label>
                                        
                                    <label className="label">
                                        <input type="radio" name="radio" onClick={()=>{setChange(4)}}/>
                                        <span style={{backgroundColor:props.colors.p2}} className="check"></span>
                                    </label>
                                </div>
                            </div>
                            <CirclePicker
                                color = {chosenColor}
                                onChangeComplete = {(p1color: { hex: SetStateAction<string>; }) =>
                                {checkWhereToset(p1color.hex);}}
                            />
                        </div>
                    </Dialog.Panel>
                    {/* outside pop Up */}
                    </Transition.Child>
                </div>
                </div>
            </Dialog>
            </Transition>
        </div>
        );
}

export default function GameLogin()
{
    const [playWith, setOp] = useState("bot"); // online
    const [ballColors, setBall] = useState(false); // ball colored
    const searchParams = useSearchParams();
    const selectOpt = searchParams.get('id') !== null ? false : true;
    const [themeN, setThemeN] = useState(1);    //themes
    const [hell, setHell] = useState(false);    // hell of flame mode
    const [Mode, setMode] = useState("");   //bot online
    const [Effect, setEffect] = useState(false);   //Special Effects
    const [isOpen, setIsOpen] = useState(false);//open popUp
    const def = useRef(null);
    const def2 = useRef(null);
    const def3 = useRef(null);
    const def1 = useRef(null);
    const T1 = useRef(null);
    const T2 = useRef(null);
    const T3 = useRef(null);
    const T4 = useRef(null);
    const main = useRef(null);
    const [colors, setC] = useState({
        p1: "#2879F2",
        p2: "#E8EAEB",
        bc: "#FFFFFF",
        bg: "#353D49"
    });

    return(
        <div className=" w-full bg-darken-200 flex items-center justify-center h-full">
            <div ref={main} className="w-[90%] h-auto px-5 py-1 max-sm:h-[95%] border-collapse bg-darken-100 rounded-xl overflow-y-auto">
                {/* Game Mode Radio Buttons */}
                {
                    selectOpt && <ModeRadio setOp={setOp}/>
                }
                {/* Themse */}
                <Themes colors={colors} setC={setC} isOpen={isOpen} setIsOpen={setIsOpen} setThemeN={setThemeN} T1={T1} T2={T2} T3={T3} T4={T4} def={def} def1={def1} def2={def2} def3={def3} />
                {/* Effects */}
                <Effects setBall={setBall} setEffect={setEffect} setHell={setHell} setMode={setMode} main={main} playWith={playWith} />
            </div>
            {/* {!show && } */}
            {(Mode === "online" && <LazyGame specials={Effect} colors={colors} themeN={themeN} ball={ballColors} hell={hell} />) ||
                (Mode==="bot" && <BotGame  colors={colors} themeN={themeN} ball={ballColors} hell={hell} />)}
        </div>
    );
}