

export function FriendBarColumns(props: any)
{
	return (
		<div /*style={ {animation: "scroll 40s linear infinite",}}*/
            className="animate flex flex-row gap-1 h-full items-center cursor-pointer  rounded-md"
            onClick={()=>{alert("clicked");}}>
                <img style={{transition: "transform 1s"}} className="w-[80px] rounded-full" src={props.src} alt="f_img" />
			    {/* <h3 className="w-lg text-white font-medium">{props.nickname}</h3> */}
		</div>
	);
}

export default function FriendCarouselBar()
{
    return (
    <div  className="w-[90%] bg-darken-100 rounded-xl flex justify-end">
        <div /*style={{width: "calc(56px * 13)"}}*/ className="w-full h-full flex justify-end overflow-hidden gap-4">
            <FriendBarColumns nickname="ayoub" src="../images/profile.png" />
            <FriendBarColumns nickname="ayoub" src="../images/profile.png" />
            {/* <FriendBarColumns nickname="ayoub" src="../images/profile.png" />
            <FriendBarColumns nickname="ayoub" src="../images/profile.png" />
            <FriendBarColumns nickname="ayoub" src="../images/profile.png" />
            <FriendBarColumns nickname="ayoub" src="../images/profile.png" />
            <FriendBarColumns nickname="ayoub" src="../images/profile.png" />
            <FriendBarColumns nickname="ayoub" src="../images/profile.png" />
            <FriendBarColumns nickname="ayoub" src="../images/profile.png" />
            <FriendBarColumns nickname="ayoub" src="../images/profile.png" />
            <FriendBarColumns nickname="ayoub" src="../images/profile.png" />
            <FriendBarColumns nickname="ayoub" src="../images/profile.png" />
            <FriendBarColumns nickname="ayoub" src="../images/profile.png" /> */}
        </div>
    </div>
    );
}