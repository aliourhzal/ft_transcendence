'use client'

import { useEffect } from "react";


export default function Profile() {

	useEffect(() => {
		const cookies = document.cookie.split(';');
		console.log(cookies);
	}, []);

	return (
		<h1>hello</h1>
	);
}