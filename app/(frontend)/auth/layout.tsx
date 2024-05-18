import React from 'react'
import Navbar from '@/components/ui/navbar'


interface AuthProps {
    children: React.ReactNode
}

export default function AuthLayout({ children }: AuthProps) {


    return (
        <main className="bg-neutral-50 dark:bg-neutral-800 h-screen">
            <Navbar />
            {children}
        </main>
    )
}
