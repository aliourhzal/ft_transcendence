import React, { useRef } from "react";


export function FriendBarColumns(props: any)
{
	return (
		<div /*style={ {animation: "scroll 40s linear infinite",}} className="animate flex flex-row gap-1 h-full items-center cursor-pointer  rounded-md"*/
            className="w-full"
            onClick={()=>{alert("clicked");}}>
                <img className="w-[60px] h-[60px] rounded-full" src={props.src} alt="f_img" />
			    {/* <h3 className="w-lg text-white font-medium">{props.nickname}</h3> */}
		</div>
	);
}

export default function FriendCarouselBar()
{
    const imgContainer = useRef<HTMLDivElement>();
    const imgCircle = useRef<HTMLDivElement>();
    const imgL = useRef<HTMLImageElement>();
    const imgR = useRef<HTMLImageElement>();
    let scrollPos = 0;
    let scrollAmount = 100;
    
    
    function scrollHorizontal(val: number) {
        let maxScroll = -imgContainer.current.offsetWidth + imgCircle.current.offsetWidth;
        scrollPos += (val * scrollAmount);
        if (scrollPos <= 0)
        {
            scrollPos = 0;
            imgL.current.style.opacity = "0";
        }
        else
            imgL.current.style.opacity = "1";
        if (scrollPos >= maxScroll)
        {
            scrollPos = maxScroll
            imgR.current.style.opacity = "0";
        }
        else
        {
            imgR.current.style.opacity = "1";
            // imgR.current.style.display = "true";
        }
        imgContainer.current.style.left = scrollPos + "px";
    }

    return (
        <div className="w-[90%] rounded-xl flex bg-darken-100 h-20vh">
            <div ref={imgCircle} className="overflow-hidden horizontal-scroll h-[80px] flex justify-between items-center relative w-full ">
                <img ref={imgL} className=" p-2 m-2 rounded-full btn-scroll max-sm:hidden w-[35px] h-[44%]" src="../images/L_arrow.png"  alt="" onClick={()=>scrollHorizontal(-1)}/>
                <div ref={imgContainer} className="storys-container flex items-center justify-center px-4 gap-3">
                        <FriendBarColumns src="../images/man.png" nickname="asalek" />
                        <FriendBarColumns src="../images/man.png" nickname="asalek" />
                        <FriendBarColumns src="../images/man.png" nickname="asalek" />
                        <FriendBarColumns src="../images/man.png" nickname="asalek" />
                        <FriendBarColumns src="../images/man.png" nickname="asalek" />
                        <FriendBarColumns src="../images/man.png" nickname="asalek" />
                        <FriendBarColumns src="../images/man.png" nickname="asalek" />
                </div>
                <img ref={imgR} className=" p-2 m-2 rounded-full btn-scroll max-sm:hidden w-[35px] h-[44%]" src="../images/R_arrow.png"  alt="" onClick={()=>scrollHorizontal(1)}/>

            </div>
        </div>
    // <div  className="w-[90%] bg-darken-100 rounded-xl flex justify-end">
    //     <div /*style={{width: "calc(56px * 13)"}}*/ className="w-[99%] h-full flex justify-end overflow-hidden gap-4">
    //         <FriendBarColumns nickname="ayoub" src="../images/profile.png" />
    //         <FriendBarColumns nickname="ayoub" src="../images/profile.png" />
    //         {/* <FriendBarColumns nickname="ayoub" src="../images/profile.png" />
    //         <FriendBarColumns nickname="ayoub" src="../images/profile.png" />
    //         <FriendBarColumns nickname="ayoub" src="../images/profile.png" />
    //         <FriendBarColumns nickname="ayoub" src="../images/profile.png" />
    //         <FriendBarColumns nickname="ayoub" src="../images/profile.png" />
    //         <FriendBarColumns nickname="ayoub" src="../images/profile.png" />
    //         <FriendBarColumns nickname="ayoub" src="../images/profile.png" />
    //         <FriendBarColumns nickname="ayoub" src="../images/profile.png" />
    //         <FriendBarColumns nickname="ayoub" src="../images/profile.png" />
    //         <FriendBarColumns nickname="ayoub" src="../images/profile.png" />
    //         <FriendBarColumns nickname="ayoub" src="../images/profile.png" /> */}
    //     </div>
    // </div>
    );
}