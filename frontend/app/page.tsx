import Image from 'next/image'
import styles from './page.module.css'
import FormLogin from '@/components/authComponents/FormLogin'

export default function Home() {
	return (
		<main className={styles.main}>
			<FormLogin />
		</main>
	)
}
/**
 * postgres port 5432
 * postgres {password}
 */
