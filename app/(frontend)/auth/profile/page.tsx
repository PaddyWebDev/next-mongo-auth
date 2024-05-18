"use client"


import { useSession } from "next-auth/react"

import UpdateProfile from "./components/update-profile-form";
import UpdatePassword from "./components/update-password-form";
import UpdateProfileImage from "./components/update-profile-image";
import { getUser } from "@/hooks/server-hooks";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";


export default function Settings() {
    const [user, setUser] = useState<User>()

    const session = useSession();

    useEffect(() => {
        async function GetUser(email: string) {
            const fetchedUser = await getUser(email);
            setUser(fetchedUser as User);
        } if (session.data?.user?.email) {
            GetUser(session.data?.user?.email as string)
        }

    }, [session?.data?.user?.email])


    return (
        <main className="bg-neutral-50 dark:bg-neutral-800 min-h-screen">
            <section className="max-w-screen-lg mx-auto px-4 py-8">

                {user && (
                    <div className=" shadow-xl rounded-md overflow-hidden ">
                        <header className="bg-neutral-100 dark:bg-neutral-950 px-4 py-6">
                            <h1 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-50">Welcome back, {user.name?.split(" ")[0]}!</h1>
                        </header>
                        <UpdateProfileImage userData={user as User} />
                        <UpdateProfile userData={user as User} />
                        <UpdatePassword userData={user as User} />
                    </div>
                )}
            </section>
        </main>
    )
}



