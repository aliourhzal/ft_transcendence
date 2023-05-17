'use client'

import axios from 'axios';

import styles from './FormLogin.module.css'

/**
 * async function postData(url = "", data = {}) {
	console.log(data);
	// Default options are marked with *
	const response = await fetch(url, {
	  method: "POST", // *GET, POST, PUT, DELETE, etc.
	  mode: "cors", // no-cors, *cors, same-origin
	  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
	  credentials: "same-origin", // include, *same-origin, omit
	  headers: {
		"Content-Type": "application/json",
		// 'Content-Type': 'application/x-www-form-urlencoded',
	  },
	  redirect: "follow", // manual, *follow, error
	  referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
	  body: JSON.stringify(data), // body data type must match "Content-Type" header
	});
	return response.json(); // parses JSON response into native JavaScript objects
  }
 * 
 */

export default function FormLogin() {

	const submitFormHandler = async (e: any) => {
		e.preventDefault();
		const username = e.target[0].value;
		const password = e.target[1].value;
		console.log(username, password);

		const userData = await axios.post('http://127.0.0.1:3000/auth/login', { username, password });
		console.log(userData.data);
	}

    return(
        <form className={styles.form} onSubmit={submitFormHandler}>
            <input type="text" placeholder="username"/>
            <input type="password" placeholder="password"/>
            <button type="submit">Continue</button>
        </form>
    );
}