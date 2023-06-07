export default function SideBar(props:any)
{
    return (
        <div className='h-full w-2/12 bg-darken-100'>
        <div className="container">
            <div className="flex flex-col items-center pt-[20%] gap-5">
                <img className=" w-1/2" src="images/man.png" alt="user_pic" />
                <h1 className="text-whiteSmoke sm:text-sm md:text-[25px] ">{props.name}</h1>
            </div>
            <div className=" flex flex-col gap-9 mt-[55%]">
                <a className="pl-3 flex sm:flex-col md:flex-row items-center gap-2" href="/profile">
                    <img className=" w-[15%] h-[25%]" src="images/user.png" alt="profile" />
                    <span className="md:text-2xl sm:text-sm text-whiteSmoke">Profile</span>
                </a>
                <a className="pl-3 flex sm:flex-col md:flex-row items-center gap-2" href="/profile">
                    <img className=" w-[15%] h-[25%]" src="images/chat.png" alt="profile" />
                    <span className="md:text-2xl sm:text-sm text-whiteSmoke">Chat</span>
                </a>
                <a className="pl-3 flex sm:flex-col md:flex-row items-center gap-2" href="/profile">
                    <img className=" w-[15%] h-[25%]" src="images/controller.png" alt="profile" />
                    <span className="md:text-2xl sm:text-sm text-whiteSmoke">Game</span>
                </a>
            </div>
        </div>   
        </div>
    );
}