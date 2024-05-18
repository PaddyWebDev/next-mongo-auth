"use client"
import React, { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

interface ToastProviderProps {
    children: ReactNode
}

export default function ToastProvider({ children }: ToastProviderProps) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <Toaster position="top-center"
                reverseOrder={false} />
            {children}
        </ThemeProvider>
    )
}




export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

