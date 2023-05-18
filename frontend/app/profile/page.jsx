'use client'

import Cookies from 'js-cookie';
import axios from 'axios';
import { useEffect } from 'react';

export default function Profile() {

	const getUserData = async () => {
		const accessToken = Cookies.get('accessToken');
		const user_id = Cookies.get('user_id');
		const {data: userData} = await axios.get(`http://127.0.0.1:3000/auth/user`, {
			params: {
				id: user_id,
				accessToken
			}
		})
		console.log(userData);
	}

	useEffect(() => {
		getUserData();
	})

	return (
		<h1>hello</h1>
	);
}