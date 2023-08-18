
import Container from '@/components/UI/ProfileBoxs';
import './style.css'
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { userDataContext } from '../layout';

interface StatsProps {
    for: string,
    total: number,
    wins: number,
    losses: number
}

function MatchResult() {
    return (
        <div className='w-full rounded-xl flex items-center justify-between bg-darken-300 p-3 gap-2'>
            <div className='flex gap-2 items-center'>
                <img className='w-10 h-10 rounded-full' src="images/42.jpg" alt="avatar1"/>
                <span className='text-white font-medium hidden avatarNickname'>Nickname</span>
            </div>
            <div className='text-white flex gap-1 '>
                <span>15</span>
                <span>:</span>
                <span>12</span>
            </div>
            <div className='flex gap-2 items-center'>
                <span className='text-white font-medium hidden avatarNickname'>Nickname</span>
                <img className='w-10 h-10 rounded-full' src="images/42.jpg" alt="avatar1"/>
            </div>
        </div>
    );
}

export function MatchHistory() {
    return(
        <Container className='p-5 bg-darken-100 rounded-xl flex flex-col gap-5 h-full'>
            <h2 className='text-white'>Matches History</h2>
            <div className='matchHistoryBody flex flex-col gap-3 overflow-y-auto max-h-[420px]'>
                <MatchResult />
                <MatchResult />
                <MatchResult />
                <MatchResult />
                <MatchResult />
                <MatchResult />
                <MatchResult />
                <MatchResult />
                <MatchResult />
                <MatchResult />
                <MatchResult />
                <MatchResult />
                <MatchResult />
                <MatchResult />
                <MatchResult />
            </div>
        </Container>
    );
}

function StatsTemplate(props: StatsProps) {
    const winsPercent = (props.total === 0 ? 0 : props.wins * 100 / props.total);
    let lossesPercent = (props.total === 0 ? 0 : props.losses * 100 / props.total);
    console.log('stat', props);
    return (
        <div className='text-white flex flex-col gap-5 min-[1375]:w-3/5 min-[540px]:w-2/5 mb-2'>
            <h3 className='font-semibold'>{props.for}</h3>
            <hr />
            <div className='flex justify-between'>
                <span>{`Total ${props.for}s`}</span>
                <span>{props.total}</span>
            </div>
            <div className='flex flex-col gap-2'>
                <span>Wins</span>
                <progress className="w-auto h-2 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg   [&::-webkit-progress-bar]:bg-darken-300 [&::-webkit-progress-value]:bg-blueStrong [&::-moz-progress-bar]:bg-blueStrong" value={winsPercent} max='100'></progress>
            </div>
            <div className='flex flex-col gap-2'>
                <span>Losses</span>
                <progress className="w-auto h-2 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg   [&::-webkit-progress-bar]:bg-darken-300 [&::-webkit-progress-value]:bg-blueStrong [&::-moz-progress-bar]:bg-blueStrong" value={lossesPercent} max='100'></progress>
            </div>
        </div>
    );
}

export function GameStats() {
    const userData = useContext(userDataContext);
    const [data, setdata] = useState({
        total : 0,
        totatP : 0,
        wins : 0,
        loss : 0,
        scoreW : 0,
        scoreL : 0
    });

    // console.log(userData);
    useEffect(()=>{
        axios.get('http://127.0.0.1:3000/users/profile/stats',{
            withCredentials: true
        })
        .then(res => {
            setdata(res.data);
        })
        .catch(e => {
            console.log(e);
        })
    }
    , []);
    return (
        <Container>
            <h2 className='text-white'>Statistics</h2>
            <div className='flex justify-evenly flex-col min-[540px]:flex-row gap-4'>
                <StatsTemplate for='Game' total={data.total} wins={data.wins} losses={data.loss}/>
                <StatsTemplate for='Point' total={data.totatP} wins={data.scoreW} losses={data.scoreL}/>
            </div>
        </Container>
    );
}

