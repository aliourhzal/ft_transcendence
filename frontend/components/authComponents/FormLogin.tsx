import styles from './FormLogin.module.css'

export default function FormLogin() {
    return(
        <form className={styles.form}>
            <input type="text" placeholder="username"/>
            <input type="password" placeholder="password"/>
            <button type="submit">Continue</button>
        </form>
    );
}