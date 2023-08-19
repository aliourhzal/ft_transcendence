
import Container from '@/components/UI/ProfileBoxs';
import './style.css'
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { userDataContext } from '../layout';


interface matchTemplate {
    player1: {
        avatar: string,
        nickname: string,
        score: number
    },
    player2: {
        avatar: string,
        nickname: string,
        score: number
    }
}

function MatchResult(props) {
    return (
        <div className='w-full rounded-xl flex items-center justify-between bg-darken-300 p-3 gap-2'>
            <div className='flex gap-2 items-center'>
                <img className='w-10 h-10 rounded-full' src={props.av1} alt="avatar1"/>
                <span className='text-white font-medium hidden avatarNickname'>{props.p1}</span>
            </div>
            <div className='text-white flex gap-1 '>
                <span>{props.score1}</span>
                <span>:</span>
                <span>{props.score2}</span>
            </div>
            <div className='flex gap-2 items-center'>
                <span className='text-white font-medium hidden avatarNickname'>{props.p2}</span>
                <img className='w-10 h-10 rounded-full' src={props.av2} alt="avatar1"/>
            </div>
        </div>
    );
}

export function MatchHistory() {
    const [historyState, setHistory] = useState<matchTemplate[]>([]);
    const his : matchTemplate[] = [];
    const matchTemplate : matchTemplate = {
        player1: {
            avatar: "",
            nickname: "",
            score: 0
        },
        player2: {
            avatar: "",
            nickname: "",
            score: 0
        }
    };
    useEffect(()=>{
        axios.get('http://127.0.0.1:3000/users/profile/history',{
            withCredentials: true
        })
        .then(res => {
            res.data.forEach(x => {
                const match: matchTemplate = { ...matchTemplate };
                match.player1.avatar = x.player1.avatar;
                match.player1.nickname = x.player1.nickname;
                match.player1.score = x.player1.score;
                match.player2.avatar = x.player2.avatar;
                match.player2.nickname = x.player2.nickname;
                match.player2.score = x.player2.score;
                his.push(match);
            });
            setHistory(his);
        })
        .catch(e => {
            console.log(e);
        })
    }, []);

    return(
        <Container className='p-5 bg-darken-100 rounded-xl flex flex-col gap-5 h-full'>
            <h2 className='text-white'>Matches History</h2>
            <div className='matchHistoryBody flex flex-col gap-3 overflow-y-auto max-h-[420px]'>
                {
                    historyState.map(x => {
                        let i = 0;
                        return (<MatchResult
                            key={i++}
                            p1={x.player1.nickname}
                            av1={x.player1.avatar}
                            score1={x.player1.score}
                            p2={x.player2.nickname}
                            av2={x.player2.avatar}
                            score2={x.player2.score}
                            />
                        )
                    })
                }
            </div>
        </Container>
    );
}

function StatsTemplate(props) {
    const winsPercent = ( props.total === 0 ? 0 : props.wins * 100 / props.total);
    const lossesPercent = (props.total === 0 ? 0 : props.losses * 100 / props.total);

    return (
        <div className='text-white flex flex-col gap-5 min-[1375]:w-3/5 min-[540px]:w-2/5 mb-2'>
            <h3 className='font-semibold'>{props.for}</h3>
            <hr />
            <div className='flex justify-between'>
                <span>{`Total ${props.for}s`}</span>
                <span>{props.total}</span>
            </div>
            <div className='flex flex-col gap-2'>
                <span>{props.type1}</span>
                <progress className="w-auto h-2 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg   [&::-webkit-progress-bar]:bg-darken-300 [&::-webkit-progress-value]:bg-blueStrong [&::-moz-progress-bar]:bg-blueStrong" value={winsPercent} max='100'></progress>
            </div>
            <div className='flex flex-col gap-2'>
                <span>{props.type2}</span>
                <progress className="w-auto h-2 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg   [&::-webkit-progress-bar]:bg-darken-300 [&::-webkit-progress-value]:bg-blueStrong [&::-moz-progress-bar]:bg-blueStrong" value={lossesPercent} max='100'></progress>
            </div>
        </div>
    );
}

export function GameStats() {
    const userData = useContext(userDataContext);
    const [data, setdata] = useState({
        total : 0,
        totalP : 0,
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
            if (res.data.lentgh === 0)
                return ;
            setdata(res.data);
        })
        .catch(e => {
            console.log(e);
        })
    }
    , []);
    console.log(data);
    return (
        <Container>
            <h2 className='text-white'>Statistics</h2>
            <div className='flex justify-evenly flex-col min-[540px]:flex-row gap-4'>
                <StatsTemplate type1="Wins" type2="Losses" for='Game' total={data.total} wins={data.wins} losses={data.loss}/>
                <StatsTemplate type1="Goals For" type2="Goals Against " for='Point' total={data.totalP} wins={data.scoreW} losses={data.scoreL}/>
            </div>
        </Container>
    );
}

