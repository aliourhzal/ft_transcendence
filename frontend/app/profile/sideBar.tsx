import {BsFillPersonFill} from "react-icons/bs";
import {BsFillChatSquareDotsFill} from "react-icons/bs";
import {FaTableTennis} from "react-icons/fa";

export default function SideBar(props:any)
{
    return (
            <section className="h-full w-2/12 bg-darken-100 flex flex-col items-center max-w-[150px] absolute top-0 left-0">
                <div className="flex flex-col items-center pt-[20%] gap-5">
                    <img className=" w-1/2" src="images/man.png" alt="user_pic" />
                    <h2 className="text-whiteSmoke sm:text-base lg:text-[20px] ">{props.name}</h2>
                </div>
                <div className=" flex flex-col gap-9 mt-[55%]">
                    <a className="flex flex-col md:flex-row items-center gap-5" href="/profile">
                        {/* <img className=" w-[15%] h-[25%]" src="images/user.png" alt="profile" /> */}
                        <BsFillPersonFill style={{color: 'white', fontSize: '24px'}}/>
                        <span className="text-md text-whiteSmoke hidden sm:inline">Profile</span>
                    </a>
                    <a className="flex flex-col md:flex-row items-center gap-5" href="/profile">
                        {/* <img className=" w-[15%] h-[25%]" src="images/chat.png" alt="profile" /> */}
                        <BsFillChatSquareDotsFill style={{color: 'white', fontSize: '24px'}}/>
                        <span className="text-md text-whiteSmoke hidden sm:inline">Chat</span>
                    </a>
                    <a className="flex flex-col md:flex-row items-center gap-5" href="/profile">
                        {/* <img className=" w-[15%] h-[25%]" src="images/controller.png" alt="profile" /> */}
                        <FaTableTennis  style={{color: 'white', fontSize: '24px'}}/>
                        <span className="text-md text-whiteSmoke hidden sm:inline">Game</span>
                    </a>
                </div>
            </section>
    );
}