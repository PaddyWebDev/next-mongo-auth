"use client"
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'


const LoginSchema = z.object({
    email: z.string().min(7).max(30).email(),
    password: z.string().min(8).max(30),
})

type LoginType = z.infer<typeof LoginSchema>;

export default function Login() {

    const [passwordState, setPasswordState] = useState<boolean>(false)
    const session = useSession();
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    async function onSubmit(data: LoginType) {
        await signIn('credentials', {
            ...data,
            redirect: false
        }).then((callback) => {
            if (callback?.error) {
                toast.error("Missing Credentials")
            }
            if (callback?.ok && !callback?.error) {
                toast.success("Login Success!")
                form.reset()
            }
        }).catch((error) => toast.error("Error Occurred while processing the request"))
    }

    useEffect(() => {
        if (session.status === 'authenticated') {
            router.push('/auth/Dashboard');
        }
    }, [session, router])
    return (
        <main
            id="page-container"
            className="mx-auto flex min-h-dvh w-full min-w-[320px] flex-col bg-neutral-100 dark:bg-neutral-950 dark:text-neutral-100"
        >
            <article id="page-content" className="flex max-w-full flex-auto flex-col">
                <section className="relative mx-auto flex min-h-dvh w-full max-w-10xl items-center justify-center overflow-hidden p-4 lg:p-8">
                    <section className="w-full max-w-xl py-6">
                        <header className="mb-10 text-center">
                            <h1 className="mb-2 inline-flex items-center gap-2 text-2xl font-bold">
                                <svg
                                    className="hi-mini hi-cube-transparent inline-block size-5 text-indigo-600 dark:text-indigo-500"
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
                            </h1>
                            <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                Welcome, please sign in to your dashboard
                            </h2>
                        </header>

                        <section className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm dark:bg-neutral-900 dark:text-neutral-100">
                            <div className="grow p-5 md:px-16 md:py-12">
                                <Form {...form} >
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7 flex flex-col">

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
                                                    <FormLabel className='flex items-center justify-between'>
                                                        <h3>
                                                            Password
                                                        </h3>
                                                        <Link className="text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50" href="/ForgetPassword" type='button'>forgot password</Link>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter your password" type={passwordState ? 'text' : 'password'}  {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex items-center ml-5">
                                            <Checkbox id='showPassword' onClick={() => setPasswordState(!passwordState)} />
                                            <label
                                                htmlFor="showPassword"
                                                className="text-sm ml-3  cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Show Password
                                            </label>
                                        </div>

                                        <Button type="submit" variant={"default"}>Submit</Button>
                                    </form>
                                    <div className="my-5 flex items-center">
                                        <span
                                            aria-hidden="true"
                                            className="h-0.5 grow rounded bg-neutral-100 dark:bg-neutral-700/75"
                                        />
                                        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200">
                                            or sign in with
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className="h-0.5 grow rounded bg-neutral-100 dark:bg-neutral-700/75"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold leading-5 text-neutral-800 hover:border-neutral-300 hover:text-neutral-900 hover:shadow-sm focus:ring focus:ring-neutral-300/25 active:border-neutral-200 active:shadow-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-neutral-200 dark:focus:ring-neutral-600/40 dark:active:border-neutral-700"
                                        >
                                            <svg
                                                className="bi bi-facebook inline-block size-4 text-[#1877f2]"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 16 16"
                                                aria-hidden="true"
                                            >
                                                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                                            </svg>
                                            <span>Facebook</span>
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold leading-5 text-neutral-800 hover:border-neutral-300 hover:text-neutral-900 hover:shadow-sm focus:ring focus:ring-neutral-300/25 active:border-neutral-200 active:shadow-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-neutral-200 dark:focus:ring-neutral-600/40 dark:active:border-neutral-700"
                                        >
                                            <svg
                                                className="bi bi-twitter-x inline-block size-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 16 16"
                                                aria-hidden="true"
                                            >
                                                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
                                            </svg>
                                            <span className="sr-only">X</span>
                                        </button>
                                    </div>
                                </Form>
                            </div>
                            <div className="grow bg-neutral-50 p-5 text-center text-sm dark:bg-neutral-700/50 md:px-16">
                                {"Don't "}have an account yet?{" "}
                                <Link
                                    href="/guest/Register"
                                    className="font-medium text-indigo-600 hover:text-indigo-400 dark:text-indigo-400 dark:hover:text-indigo-300"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </section>

                    </section>
                </section>
            </article>
        </main >
    );
}
