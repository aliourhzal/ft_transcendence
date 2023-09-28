import './globals.css'
import { Montserrat } from 'next/font/google'
import Head from 'next/head'

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata = {
	title: 'pongy',
	icons: {
		icon: '/images/ping.png'
	}
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={`${montserrat.className} h-screen w-screen`}>{children}</body>
		</html>
	)
}
