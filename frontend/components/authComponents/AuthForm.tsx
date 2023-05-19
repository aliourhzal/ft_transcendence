
import Link from 'next/link';

import Input from '../UI/inputComponent/InputComponent';
import Button from '../UI/button/ButtonComponent';

import styles from './AuthForm.module.css'

export default function AuthForm() {
    return(
        <>
            <div className={styles.container}>
                <h1 className={styles.title}>Login</h1>
                <form className={styles.form}>
                    <Input type="text" placeholder='login'/>
                    <Input type="password" placeholder='password'/>
                    <Button type="submit" label="login"/>
                </form>
                <span className={styles.choice}>Or</span>
                <hr />
                <div className={styles.authOptions}>
                    <a href="http://10.11.100.162:3000/auth/42">
                        <button className={`${styles.auth42} ${styles.auth}`}></button>
                    </a>
                    <button className={`${styles.authGoogle} ${styles.auth}`}></button>
                    <button className={`${styles.authFacebook} ${styles.auth}`}></button>
                </div>
                <p className={styles.noAccount}>You don't have an account? <Link href='/createAccount'>Create One</Link></p>
            </div>
        </>
    );
}