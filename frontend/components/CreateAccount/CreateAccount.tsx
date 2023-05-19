'use client'

import CreateAccountInputField from '../UI/inputComponent/CreateAccountInputField';
import Button from '../UI/button/ButtonComponent';

import * as verificationTools from './tools/fieldVerification'

import styles from './CreateAccount.module.css'
import { useState } from 'react';

export default function CreateAccount() {
    const [enteredName, setName] = useState('');
    const [enteredNickname, setNickname] = useState('');
    const [enteredEmail, setEmail] = useState('');
    const [enteredPasswd, setPasswd] = useState('');
    const [enteredConfirm, setConfirm] = useState('');


    const submitHandler = (e: any) => {
        e.preventDefault();
        const name = e.target[0].value;
        const nickname = e.target[1].value;
        const email = e.target[2].value;
        const passwd = e.target[3].value;
        const confirmPasswd = e.target[4].value;
        let formIsValid = true;

        if (!verificationTools.verifyName(name, setName))
            formIsValid = false;
        if (!verificationTools.verifyNickname(nickname, setNickname))
            formIsValid = false;
        if (!verificationTools.verifyEmail(email, setEmail))
            formIsValid = false;
        if (!verificationTools.verifyPasswd(passwd, setPasswd))
            formIsValid = false;
        if (!verificationTools.confirmPasswd(passwd, confirmPasswd, setConfirm))
            formIsValid = false;
        if (!formIsValid)
            return ;
    }

    return (
        <>
            <div className={styles.createAccountContainer}>
                <h1 className={styles.title}>Create Account</h1>
                <form className={styles.form} onSubmit={submitHandler}>
                    <CreateAccountInputField label='Full Name' errorMsg={enteredName} inputType='text' inputPlaceholder='full name'/>
                    <CreateAccountInputField label='nickname' errorMsg={enteredNickname} inputType='text' inputPlaceholder='nickname'/>
                    <CreateAccountInputField label='email' errorMsg={enteredEmail} inputType='text' inputPlaceholder='email'/>
                    <CreateAccountInputField label='password' errorMsg={enteredPasswd} inputType='password' inputPlaceholder='password'/>
                    <CreateAccountInputField label='confirm password' errorMsg={enteredConfirm} inputType='password' inputPlaceholder='confirm password'/>
                    <Button type="submit" label="Submit"/>
                </form>
            </div>
        </>
    );
}