import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ToastProvider from '@/providers/toast-provider'
import AuthContext from '@/providers/auth-providers'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next Auth',
  description: 'Created By Padmanabh Malwade',
  // icons: "/Images/Favicon.png"

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <AuthContext>
        <body className={`${inter.className} select-none`}>
          <ToastProvider>
            {children}
          </ToastProvider>
        </body>
      </AuthContext>
    </html>
  )
}
