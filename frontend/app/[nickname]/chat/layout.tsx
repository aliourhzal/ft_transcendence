import '../../globals.css'
import { Inter } from 'next/font/google'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <html lang="en">
      <body className=' bg-fixed bg-gray-900'>{children}</body>
    </html>
  )
}
