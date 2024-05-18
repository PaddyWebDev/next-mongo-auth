"use client"
import React, { memo, useMemo } from 'react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CircleUser, LogOut, Menu } from "lucide-react"
import Link from "next/link"
import { signOut, useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import useRoutes from '@/hooks/routes-hook'
import clsx from 'clsx'


export default function Navbar() {
    const session = useSession();
    console.log(session);
    const router = useRouter();
    if (session.status === "unauthenticated") {
        redirect("/guest/Login")
    }
    return (
        <header
            id="page-header"
            className="z-1 flex flex-none items-center bg-white shadow-sm dark:bg-neutral-950"
        >
            <div className="container mx-auto px-4 lg:px-8 xl:max-w-7xl">
                <div className="flex justify-between py-4">
                    <div className="flex items-center">
                        <a
                            href="#"
                            className="group inline-flex items-center gap-2 text-lg font-bold tracking-wide text-neutral-900 hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-300"
                        >
                            <svg
                                className="hi-mini hi-cube-transparent inline-block size-5 text-indigo-600 transition group-hover:scale-110 dark:text-indigo-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9.638 1.093a.75.75 0 01.724 0l2 1.104a.75.75 0 11-.724 1.313L10 2.607l-1.638.903a.75.75 0 11-.724-1.313l2-1.104zM5.403 4.287a.75.75 0 01-.295 1.019l-.805.444.805.444a.75.75 0 01-.724 1.314L3.5 7.02v.73a.75.75 0 01-1.5 0v-2a.75.75 0 01.388-.657l1.996-1.1a.75.75 0 011.019.294zm9.194 0a.75.75 0 011.02-.295l1.995 1.101A.75.75 0 0118 5.75v2a.75.75 0 01-1.5 0v-.73l-.884.488a.75.75 0 11-.724-1.314l.806-.444-.806-.444a.75.75 0 01-.295-1.02zM7.343 8.284a.75.75 0 011.02-.294L10 8.893l1.638-.903a.75.75 0 11.724 1.313l-1.612.89v1.557a.75.75 0 01-1.5 0v-1.557l-1.612-.89a.75.75 0 01-.295-1.019zM2.75 11.5a.75.75 0 01.75.75v1.557l1.608.887a.75.75 0 01-.724 1.314l-1.996-1.101A.75.75 0 012 14.25v-2a.75.75 0 01.75-.75zm14.5 0a.75.75 0 01.75.75v2a.75.75 0 01-.388.657l-1.996 1.1a.75.75 0 11-.724-1.313l1.608-.887V12.25a.75.75 0 01.75-.75zm-7.25 4a.75.75 0 01.75.75v.73l.888-.49a.75.75 0 01.724 1.313l-2 1.104a.75.75 0 01-.724 0l-2-1.104a.75.75 0 11.724-1.313l.888.49v-.73a.75.75 0 01.75-.75z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>Company</span>
                        </a>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-5">
                        <nav className="hidden items-center gap-2 lg:flex">
                            <NavbarLinks />

                        </nav>

                        <div className="flex w-full  justify-end items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="secondary" size="icon" className="rounded-full">
                                        <CircleUser className="h-5 w-5" />
                                        <span className="sr-only">Toggle user menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className='p-2'>
                                    <DropdownMenuLabel>{session.data?.user?.name}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => router.push("/auth/profile")}>Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Support</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className='flex items-center gap-2' onClick={() => signOut({ callbackUrl: "/guest/Login" })}>Logout <LogOut size={18} /> </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <Sheet>
                            <SheetTrigger asChild className="">
                                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle navigation menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <nav className="grid gap-6 text-lg font-medium mt-7">
                                    <NavbarLinks />
                                </nav>
                            </SheetContent>
                        </Sheet>


                    </div>
                </div>

            </div>
        </header>
    )
}

function NavbarLinks() {
    const routes = useRoutes()
    return (
        <>
            {
                routes.map((route, id: number) => (
                    <Link
                        key={id}
                        href={route.href}
                        className={clsx("group flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 hover:text-neutral-600 active:border-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:hover:text-neutral-50 dark:active:border-neutral-600", route.active && "dark:bg-neutral-700 dark:border-neutral-600 bg-neutral-50 opacity-100 dark:text-neutral-50 text-neutral-950  ")}
                    >
                        <route.icon active={route.active} />
                        <span>{route.label}</span>
                    </Link>
                ))
            }
        </>
    )
}