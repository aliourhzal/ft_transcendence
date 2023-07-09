import Script from "next/script";
import Navbar from "../login/navbar";
import SideBar from "../profile/sideBar";

export default function Game()
{
    return (
        <section className="flex w-full h-full items-center gap-10">
            <SideBar/ >
            <canvas id="pongy" className="bg-darken-300 rounded-3xl w-[800px] h-[600px]" width="800px" height="600px">
            </canvas>
            {/* <Navbar/ > */}
            <Script src="../../game-script.js" defer></Script>
        </section>
    );
}

