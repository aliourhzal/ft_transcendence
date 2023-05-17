import Image from 'next/image'
import styles from './page.module.css'
// import FormLogin from '@/components/authComponents/FormLogin'
import IntraLogin from '@/components/authComponents/IntraLogin'

export default function Home() {
	return (
		<main className={styles.main}>
			<IntraLogin />
		</main>
	)
}
/**
 * postgres port 5432
 * postgres {password}
 */
