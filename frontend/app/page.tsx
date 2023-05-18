import Image from 'next/image'
import styles from './page.module.css'
import AuthForm from '@/components/authComponents/AuthForm'

export default function Home() {
	return (
		<main className={styles.main}>
			<AuthForm />
		</main>
	)
}
/**
 * postgres port 5432
 * postgres {password}
 */
