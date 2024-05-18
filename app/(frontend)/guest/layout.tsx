import React from 'react'

interface GuestLayoutProps {
    children: React.ReactNode
}

export default function GuestLayout({ children }: GuestLayoutProps) {
    return (
        <main>
            {children}
        </main>
    )
}
