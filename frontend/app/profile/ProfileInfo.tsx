
import Container from "@/components/UI/ProfileBoxs";

function Informations(props:any)
{
    return (
        <div className="h-full w-full md:w-5/6">
            <p className="pb-2 text-blueStrong">{props.title}</p>
            <div className="text-whiteSmoke flex container bg-darken-300 justify-start rounded-lg md:gap-24 p-3 overflow-x-auto infoContainer">
                <h1>{props.attribute}</h1>
            </div>
        </div>
    );
}

export default function ProfileInfo() {
    return (
        <Container className='items-center justify-center xl:w-3/6 w-5/6 mb-[auto]'>
            <img className='w-5/12 h-auto' src="images/man.png" alt="avatar" />
            <div className="flex flex-col items-center justify-center h-full w-full gap-8 ">
                <div className="flex w-full md:w-5/6 container bg-darken-300 justify-evenly md:justify-evenly rounded-lg pr-3 pl-3 p-2">
                    <div className="flex flex-col items-center">
                        <h2 className="text-blueStrong">Grade</h2>
                        <p className="text-whiteSmoke font-sans">Learner</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <h2 className="text-blueStrong">Coins</h2>
                        <p className="text-whiteSmoke font-sans">37</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <h2 className="text-blueStrong">Wallet</h2>
                        <p className="text-whiteSmoke font-sans">1337</p>
                    </div>
                </div>
                <Informations title="Name" attribute="Ayoub Salek"/>
                <Informations title="Email" attribute="ayoub.salek8599@gmail.com"/>
                <Informations title="Nickname" attribute="asalek"/>
                <button className=" bg-blue-700 hover:bg-blueStrong text-white font-bold py-3 px-9 border border-blue-900 rounded-md">
                    Settings
                </button>
            </div>
        </Container>
    );
}