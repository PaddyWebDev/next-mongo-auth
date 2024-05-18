"use client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { sendEmailVerification, verifyOtp } from "@/hooks/email-hook"
import { generateOTP } from "@/hooks/hooks"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"

import React, { useEffect } from 'react'
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

interface VerifyUserProps {
    params: {}
    searchParams: {
        email: string
    }
}

const VerifyUserSchema = z.object({
    otp: z.string().min(6, {
        message: "Otp must contain at least 6 character(s)"
    }).max(6, {
        message: "Otp must contain at least 6 character(s)"
    })
})


type VerifyUserType = z.infer<typeof VerifyUserSchema>;

export default function VerifyUser(props: VerifyUserProps) {
    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(VerifyUserSchema),
        defaultValues: {
            otp: ""
        }
    });

    async function onSubmit(data: VerifyUserType) {
        if (await verifyOtp(data.otp, props.searchParams.email) === "The Link has expired") {
            toast.error("The Link has expired")
            setTimeout(() => {
                router.push("/")
            }, 3000)
        }
        toast.success("Email Verified Successfully, Redirecting to Login page")
        setTimeout(() => {
            router.push("/Login")
        }, 3000)
    }

    useEffect(() => {
        sendEmailVerification(props.searchParams.email, generateOTP())
    }, [props.searchParams.email])



    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center">
            <section className="bg-neutral-100 dark:bg-neutral-950 p-8 rounded-md shadow-md max-w-2xl">
                <Alert variant={"success"} className="my-1.5">
                    <AlertTitle>Email Sent!</AlertTitle>
                    <AlertDescription>
                        You will shortly receive email with verification code
                    </AlertDescription>
                </Alert>
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col ">
                        <h2 className="scroll-m-20  pb-2 text-2xl mt-2 font-semibold tracking-tight ">
                            User Verification
                        </h2>
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormDescription>
                                        Please enter the one-time password sent to your email.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <Button type="submit" variant={"default"}>Submit</Button>
                    </form>

                </Form>
            </section>
        </main>
    )
}
