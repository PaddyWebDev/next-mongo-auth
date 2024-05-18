"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { z } from 'zod'
import axios from 'axios';
import toast from 'react-hot-toast'
import { Checkbox } from '@/components/ui/checkbox'



const RegisterSchema = z.object({
    name: z.string().min(9).max(30),
    email: z.string().min(7).max(30).email(),
    password: z.string().min(8).max(30),
    confirmPassword: z.string().min(8).max(30)
})


type RegisterType = z.infer<typeof RegisterSchema>;

export default function Register() {
    const [passwordState, setPasswordState] = useState<boolean>(false)

    const session = useSession();
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    async function onSubmit(data: RegisterType) {
        const { name, email, password } = data;
        await axios.post(`/api/register`, { name, email, password })
            .then((data) => {
                toast.success("Register Success")
                form.reset()
                router.push(`/verify-user?email=${email}`)
            }).catch((error) => {
                toast.error("Failed to Register the User")
            })

    }

    useEffect(() => {
        if (session?.status === 'authenticated') {
            router.push('/auth/Dashboard')
        }


    }, [session, router])

    return (
        <main className='dark:bg-neutral-950 bg-neutral-50 flex items-center justify-center h-screen p-5'>
            <section className=' lg:w-4/12 md:w-8/12 w-[100%] dark:bg-neutral-900 bg-neutral-100 p-3 rounded-md shadow-md '>
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <h2 className="scroll-m-20  pb-2 text-3xl mt-2 font-semibold tracking-tight ">
                            Register
                        </h2>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your name" type='text'  {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
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
                        <FormField
                            control={form.control}
                            name="password"
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
                        <Button onClick={() => router.push("/guest/Login")} type='button' variant={"link"} >Already have a Account? Login</Button>
                    </div>
                </Form>
            </section>


        </main>
    )
}
