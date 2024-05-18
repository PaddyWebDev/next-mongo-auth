"use client"
import { SessionProvider } from "next-auth/react"

interface AuthContext {
    children: React.ReactNode
}


export default function AuthContext({ children }: AuthContext) {
    return (
        <SessionProvider>{children}</SessionProvider>
    )
}