import Script from "next/script";
import Navbar from "../../login/navbar";
// import SideBar from "../profile/sideBar";

export default function Game()
{
    let width:string = '800px';
    return (
        <section className="flex w-full h-full items-center bg-darken-200">
            {/* <SideBar/ > */}
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
            <Script src="../../game-script.js" defer></Script>
        </section>
    );
}

