import React from 'react'


import { z } from "zod";


import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import toast from 'react-hot-toast';
import { getUser } from '@/hooks/server-hooks';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { User } from '@prisma/client';



interface UpdateProfileProps {
    userData: User
}

const UpdateProfileSchema = z.object({
    name: z.string().min(5).max(35),
    email: z.string().min(10).max(35).email()
})

type UpdateProfileType = z.infer<typeof UpdateProfileSchema>;

export default function UpdateProfile({ userData }: UpdateProfileProps) {
    const { data: session, update } = useSession()
    const router = useRouter()

    const UpdateProfile = useForm({
        resolver: zodResolver(UpdateProfileSchema),
        defaultValues: {
            name: userData.name,
            email: userData.email
        }
    })


    async function HandleProfileUpdate(formData: UpdateProfileType) {
        const user = await getUser(userData.email)
        if (user) {
            await axios.patch(`/api/update-user/${user.id}`, { formData })
                .then(async (data) => {
                    toast.success("User Updated")
                    if (session?.user?.email !== formData.email) {
                        router.push(`/verify-user?email=${user.email}`); // redirect to verify email page

                    }
                    await update({
                        user: {
                            name: formData.name,
                            email: formData.email
                        },
                    });

                }).catch((error) => {
                    toast.error(error.request.response)
                })

        }

    }
    return (
        <div className="bg-neutral-100 dark:bg-neutral-900 mt-5 rounded p-8 ">
            <h1 className="scroll-m-20  pb-2 text-xl mt-2 font-semibold tracking-tight ">
                Profile Information
            </h1>
            <p className="text-sm">Update your {"account's"} profile information & email address</p>
            <div className="mt-5">
                <div className="md:w-6/12">
                    <Form {...UpdateProfile} >
                        <form onSubmit={UpdateProfile.handleSubmit(HandleProfileUpdate)} className="space-y-6">

                            <FormField
                                control={UpdateProfile.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel >
                                            Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your password" type={'text'}  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={UpdateProfile.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your email" type='email'  {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" variant={"default"}>Submit</Button>
                        </form>
                    </Form>
                </div>
                <div>

                </div>
            </div>
        </div>

    )
}


