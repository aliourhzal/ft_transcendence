import Script from "next/script";
import Navbar from "../login/navbar";
import SideBar from "../profile/sideBar";
import { WebsocketContext } from "../context_sockets/gameWebSocket";
import { useContext, useEffect } from "react";


export default function Game()
{
    const socket = useContext(WebsocketContext);
    socket.on('connect', () => {
        console.log('connected');
        // socket.emit('newMessageAsalek', 'i\'m connected');
    });
    useEffect(() => {
            startGame();
            socket.on('onMessage', (data) => {
                console.log(data);
            });
            return () => {
                socket.off('connect');
                socket.off('onMessage');
                console.log("disconnect");
            }
        }
    , []);//each time player Y or Ball X | Y change trigger this effect

    let width:string = '800px';
    return (
        <section className="flex w-full h-full items-center bg-darken-200">
            <SideBar/ >
            <div className="flex flex-col items-center w-full gap-5">
                <div className="w-full flex justify-center gap-96">
                    <div className="flex items-center gap-x-5">
                        <img className="w-16 h-16" src="images/man.png" alt="man_hhhh" />
                        <h2 className=" text-whiteSmoke">Ayoub</h2>
                    </div>
                    <div className="flex items-center gap-x-5">
                        <h2 className="text-whiteSmoke">Ayoub</h2>
                        <img className="w-16 h-16" src="images/man.png" alt="man_hhhh" />
                    </div>
                </div>
                <canvas id="pongy" className="bg-darken-300 mx-auto rounded-3xl w-[{width}] h-[450x]" width={width} height="450px"></canvas>
            </div>
            {/* <Navbar/ > */}
            {/* <Script src="../../game-script.js" defer></Script> */}
        </section>
    );
}
