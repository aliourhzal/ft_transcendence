
import styles from './IntraLogin.module.css'

export default function IntraLogin() {

    return (
		<a href="http://127.0.0.1:3000/auth/42">
			<button className={styles.button}>login with intra</button>
		</a>
    );
}