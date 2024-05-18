"use client"
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormMessage, FormLabel, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getEmailInfo } from '@/hooks/email-hook';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';


interface ResetPasswordProps {
    searchParams: {
        email: string,
        token: string
    }
}

const resetPasswordSchema = z.object({
    newPassword: z.string().min(5, {
        message: "Password must contain at least 5 character(s)"
    }).max(35, {
        message: "Password must contain only 5 character(s)"
    }),
    confirmPassword: z.string().min(5, {
        message: "Password must contain at least 5 character(s)"
    }).max(35, {
        message: "Password must contain only 5 character(s)"
    }),
})
type ResetPasswordType = z.infer<typeof resetPasswordSchema>;


export default function ResetPassword(props: ResetPasswordProps) {
    const session = useSession();
    const [passwordState, setPasswordState] = useState<boolean>(false)
    const [showSuccess, setShowSuccess] = useState<boolean>(false)
    const form = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: ""
        }
    });

    const router = useRouter();


    async function handleResetPassword(data: ResetPasswordType) {

        await axios.patch(`/api/reset-password/${props.searchParams.email}`, data)
            .then((response) => {
                setShowSuccess(!showSuccess)
                toast.success(response.data)
                form.reset()
            })
            .catch((error) => toast.error(error.response.data))
    }

    useEffect(() => {
        async function checkIfTheLinkIsExpired() {
            const user = await getEmailInfo(props.searchParams.email, props.searchParams.token);

            if (!user || user?.expirationTime === undefined) {
                router.push("/")
            }

            if (user?.expirationTime && user?.expirationTime < new Date()) {
                toast.error("This link is expired redirecting to Homepage")
                setTimeout(() => {
                    router.push("/")
                }, 3000)
            }


        }

        if (session.status === 'authenticated') {
            router.push('/Dashboard');
        }
        checkIfTheLinkIsExpired();


        if (!props.searchParams.email || !props.searchParams.token) {
            router.push("/")
        }

    }, [session, router, props.searchParams.email, props.searchParams.token])
    return (
        <main className='dark:bg-neutral-950 bg-neutral-50 flex items-center justify-center h-screen p-5'>
            <section className=' lg:w-4/12 md:w-8/12 w-[100%] dark:bg-neutral-900 bg-neutral-100 p-3 rounded-md shadow-md '>
                {

                    showSuccess ?
                        (
                            <div className=" text-center p-8 space-y-3">
                                <h2 className="text-3xl font-semibold text-emerald-400">Password Reset Successful!</h2>
                                <p>Your password has been successfully updated.</p>
                                <Button variant={"default"} onClick={() => router.push("/Login")}>
                                    To Login
                                </Button>
                            </div>
                        ) : (
                            <Form {...form} >
                                <form onSubmit={form.handleSubmit(handleResetPassword)} className="space-y-6">
                                    <h2 className="scroll-m-20  pb-2 text-3xl mt-2 font-semibold tracking-tight ">
                                        Reset Password
                                    </h2>
                                    <FormField
                                        control={form.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your password" type={passwordState ? 'text' : 'password'}  {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel> Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Confirm your password" type={passwordState ? 'text' : 'password'}  {...field} />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex items-center ml-5">
                                        <Checkbox id='showPassword' onClick={() => setPasswordState(!passwordState)} />
                                        <label
                                            htmlFor="showPassword"
                                            className="text-sm ml-3 cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Show Password
                                        </label>
                                    </div>

                                    <Button type="submit" variant={"default"}>Submit</Button>
                                </form>
                                <div className='flex items-center justify-center'>
                                    <Button onClick={() => router.push("/Login")} type='button' variant={"link"} >Already have a Account? Login</Button>
                                </div>
                            </Form>
                        )
                }
            </section>

        </main >
    )
}



