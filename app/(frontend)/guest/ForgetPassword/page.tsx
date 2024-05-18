"use client"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form'
import { useForm } from "react-hook-form";
import z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ForgetPasswordSchema = z.object({
    email: z.string().min(8).max(30).email()
})
type ForgetPasswordType = z.infer<typeof ForgetPasswordSchema>;

export default function ForgetPassword() {

    const session = useSession();
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(ForgetPasswordSchema),
        defaultValues: {
            email: ""
        }
    });

    async function onSubmit(data: ForgetPasswordType) {
        await axios.post(`/api/forget-password`, data)
            .then((data) => toast.success(data.data))
            .catch((error) => toast.error(error.response.data))
    }

    useEffect(() => {
        if (session.status === 'authenticated') {
            router.push('/Dashboard');
        }
    }, [session, router])
    return (
        <main className="flex flex-col justify-center items-center min-h-screen">
            <section className="w-full max-w-xs mx-auto bg-neutral-50 dark:bg-neutral-900 flex flex-col  p-4 rounded-lg shadow-md gap-4 sm:max-w-md md:max-w-lg lg:max-w-xl">
                <Form {...form} >
                    <h2 className="scroll-m-20  pb-2 text-3xl mt-2 font-semibold tracking-tight ">
                        Forgot Password
                    </h2>
                    <p className="text-sm text-gray-600">Enter your email to reset your password.</p>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" >

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" type="email"  {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <Button type="submit" variant={"default"}>Submit</Button>
                    </form>

                </Form>
            </section>

        </main>
    );
}
