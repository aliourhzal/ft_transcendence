'use client'

import Input from '@mui/joy/Input';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import Button from '@mui/joy/Button';
import { useState } from 'react';

export default function TwoFa()
{
	const [token, setToken] = useState("");
	
	function hundleChangeToken(e)
	{
		setToken(e.target.value);
	}
	
	function checkToken()
	{
		let tokenCode = token.split(' ').join('');
		console.log("code", tokenCode); 
		// setToken();
	}
	
	return (
		<div style={{backgroundImage: "url('/images/pongTable.jpeg')"}}  className='h-full w-full flex flex-col items-center justify-center bg-slate-900 bg-center bg-cover'>
			<canvas id="canvas" className="bg-transparent h-1/2 w-full absolute left-0 top-0"></canvas>
			<div className=' container md:w-3/4 lg:w-2/4 2xl:w-1/4 relative flex items-center justify-center flex-col bg-slate-700/30 p-10 rounded-xl backdrop-blur-[3px] hover:backdrop-blur-[9px]'>
				<div className='border border-white rounded-md flex'>
					<input onChange={hundleChangeToken} className='w-full p-3 rounded text-center bg-transparent border-none text-white outline-none placeholder-white' type="text" placeholder='Token'/>
					<Button onClick={checkToken} variant="outlined" endIcon={<QrCodeScannerIcon />}
					>Verify</Button>
				</div>
			</div>
			<script src="../script.js" />
		</div>
	);
}