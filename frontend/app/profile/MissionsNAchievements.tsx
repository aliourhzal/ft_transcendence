import Container from "@/components/UI/ProfileBoxs";

interface MissionProps {
    mission: string,
    xp: number
}
interface Achieve{
    title: string,
    description: string,
    img: string
}

function Mission(props: MissionProps) {
    return (
        <div className='w-full rounded-xl flex items-center justify-between bg-darken-300 p-3 gap-2'>
            <span className="text-white">{props.mission}</span>
            <span className="text-blue-600 tracking-[1px]">{`+${props.xp}xp`}</span>
        </div>
    );
}

function Achieve(props: Achieve) {
    return (
        <div className='w-full rounded-xl flex flex-col items-start justify-between bg-darken-300 p-3 gap-2'>
            <div className="flex gap-5 w-full h-auto items-center">
                <img className="w-10 h-10 rounded-full" src={props.img} alt="" />
                <span className=" text-lg font-bold text-blue-400">{props.title}</span>
            </div>
            <p className="text-white tracking-[1px]">{props.description}</p>
        </div>
    );
}

export function Missions() {
    return (
        <Container className='p-5 bg-darken-100 rounded-xl flex flex-col gap-5'>
            <h2 className='text-white'>Missions</h2>
            <div className='matchHistoryBody flex flex-col gap-3 overflow-y-auto max-h-[266px]'>
                <Mission mission="Win 5 matches in a row" xp={5}/>
                <Mission mission="Win 5 matches in a row" xp={5}/>
                <Mission mission="Win 5 matches in a row" xp={5}/>
            </div>
        </Container>
    );
}

export function Achievements() {
    return (
        <Container className='p-5 bg-darken-100 rounded-xl flex flex-col gap-5'>
            <h2 className='text-white'>Achievements</h2>
            <div className='matchHistoryBody flex flex-col gap-3 overflow-y-auto max-h-[266px]'>
                <Achieve title="The Breaker" description="Win 3 matches in a row with different players" img={"images/man.png"}/>
                <Achieve title="The Breaker" description="Play 1k Game" img={"images/man.png"}/>
                <Achieve title="The Breaker" description="Win a game after gathering all effects" img={"images/man.png"}/>
            </div>
        </Container>
    );
}