
import Link from 'next/link';
import styles from './AuthForm.module.css'

export default function AuthForm() {
    return(
        <>
            <div className={styles.container}>
                <h1 className={styles.title}>Login</h1>
                <form className={styles.form}>
                    <input type="text" placeholder='login'/>
                    <input type="password" placeholder='password'/>
                    <button type="submit">login</button>
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