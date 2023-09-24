'use client'

import Script from 'next/script'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import Button from '@mui/joy/Button';
import { useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function TwoFa()
{
	const router = useRouter();
	const border = useRef<HTMLDivElement>();
	const cursor = useRef<HTMLDivElement>();
	const [token, setToken] = useState("");
	
	function hundleChangeToken(e)
	{
		setToken(e.target.value);
	}

	async function checkToken()
	{
		let tokenCode = token.split(' ').join('');
		try
		{
			const res = await axios.post(`http://${process.env.NEXT_PUBLIC_BACK}:3000/qr/TokenCheck`,{tokenCode}, {
			withCredentials: true});
			if (res.data.valid)
			{
				cursor.current.style.cursor = 'wait';
				border.current.style.borderColor = 'green';
				router.replace(`${res.data.nickname}`);
			}
			else
			{
				border.current.style.borderColor = 'red';
			}
		}
		catch(err)
		{
			console.log("error wrong token try again !")
		}
	}
	
	return (
		<div ref={cursor} style={{backgroundImage: "url('/images/pongTable.jpeg')"}}  className='h-full w-full flex flex-col items-center justify-center bg-slate-900 bg-center bg-cover'>
			<canvas id="canvas" className="bg-transparent h-1/2 w-full absolute left-0 top-0"></canvas>
			<div className=' container md:w-3/4 lg:w-2/4 2xl:w-1/4 relative flex items-center justify-center flex-col bg-slate-700/30 p-10 rounded-xl backdrop-blur-[3px] hover:backdrop-blur-[9px]'>
				<div ref={border} className='border border-white rounded-md flex'>
					<input onChange={hundleChangeToken} className='w-full p-3 rounded text-center bg-transparent border-none text-white outline-none placeholder-white' type="text" placeholder='Token'/>
					<Button onClick={checkToken} endDecorator={<QrCodeScannerIcon color='primary' />} variant="outlined">Verify
					</Button>
				</div>
			</div>
			<Script src="../script.js" />
		</div>
	);
}