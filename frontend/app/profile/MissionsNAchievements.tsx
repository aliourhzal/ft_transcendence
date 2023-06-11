import Container from "@/components/UI/ProfileBoxs";

interface MissionProps {
    mission: string,
    xp: number
}

function Mission(props: MissionProps) {
    return (
        <div className='w-full rounded-xl flex items-center justify-between bg-darken-300 p-3 gap-2'>
            <span className="text-white">{props.mission}</span>
            <span className="text-blue-600 tracking-[1px]">{`+${props.xp}xp`}</span>
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