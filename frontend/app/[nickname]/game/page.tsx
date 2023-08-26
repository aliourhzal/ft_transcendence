'use client'

import Canvas from "./components/Canvas";


export default function Game()
{

    return (
        <section className="flex w-full h-full items-center bg-darken-200">
            <div className="flex flex-col items-center w-full gap-5">
                <div className="w-full flex justify-center gap-96">
                    <div className="flex items-center gap-x-5">
                        <img className="w-16 h-16" src="../images/man.png" alt="man_hhhh" />
                        <h2 className=" text-whiteSmoke">Ayoub</h2>
                    </div>
                    <div className="flex items-center gap-x-5">
                        <h2 className="text-whiteSmoke">Ayoub</h2>
                        <img className="w-16 h-16" src="../images/man.png" alt="man_hhhh" />
                    </div>
                </div>
                <Canvas />
                {/* <canvas id="pongy" className="bg-darken-300 mx-auto rounded-md " width={width} height="450px"></canvas> */}
            </div>
            {/* <Navbar/ > */}
            {/* <Script src="../../game-script.js" defer></Script> */}
        </section>
    );
}
