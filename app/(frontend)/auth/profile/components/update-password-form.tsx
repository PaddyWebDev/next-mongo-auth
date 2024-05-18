import React, { useState } from 'react'


import { z } from "zod";


import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchUserDataUsingEmail } from '@/hooks/email-hook';
import bcrypt from 'bcryptjs'
import axios from 'axios';
import toast from 'react-hot-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from '@prisma/client';


interface UpdatePasswordProps {
    userData: User
}

const UpdatePasswordSchema = z.object({
    currentPassword: z.string().min(5, {
        message: "Password must contain at least 5 character(s)"
    }).max(35, {
        message: "Password must contain only 5 character(s)"
    }),
    updatedPassword: z.string().min(5, {
        message: "Password must contain at least 5 character(s)"
    }).max(35, {
        message: "Password must contain only 5 character(s)"
    }),
    confirmUpdatedPassword: z.string().min(5, {
        message: "Password must contain at least 5 character(s)"
    }).max(35, {
        message: "Password must contain only 5 character(s)"
    }),
})

type UpdatePasswordType = z.infer<typeof UpdatePasswordSchema>;



export default function UpdatePassword({ userData }: UpdatePasswordProps) {

    const [passwordState, setPasswordState] = useState<boolean>(false)

    const updatePasswordForm = useForm({
        resolver: zodResolver(UpdatePasswordSchema),
        defaultValues: {
            currentPassword: "",
            updatedPassword: "",
            confirmUpdatedPassword: "",
        }
    })


    async function HandleProfileUpdate(formData: UpdatePasswordType) {
        const user = await fetchUserDataUsingEmail(userData.email)
        if (await bcrypt.compare(formData.currentPassword, user?.password as string)) {
            if (formData.updatedPassword === formData.confirmUpdatedPassword) {
                const password = formData.updatedPassword
                await axios.patch(`/api/reset-password/${userData?.email}`, { password })
                    .then((data) => {
                        toast.success(data.data)
                        updatePasswordForm.reset()
                    })
                    .catch((error) => {
                        toast.error(error.response.data)

                    })
            } else {
                toast.error("Passwords do not match")
            }
        } else {
            toast.error("Current password is incorrect")
        }
    }

    return (
        <div className="bg-neutral-100 dark:bg-neutral-900 mt-5 rounded p-8 ">
            <h1 className="scroll-m-20  pb-2 text-xl mt-2 font-semibold tracking-tight ">
                Update Password
            </h1>
            <p className="text-sm">Ensure your account is using a long, random password to stay secure</p>
            <div className="mt-5">
                <div className="md:w-6/12">
                    <Form {...updatePasswordForm} >
                        <form onSubmit={updatePasswordForm.handleSubmit(HandleProfileUpdate)} className="space-y-6">

                            <FormField
                                control={updatePasswordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel >
                                            Current Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your current password" type={passwordState ? 'text' : "password"}  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={updatePasswordForm.control}
                                name="updatedPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter new password" type={passwordState ? 'text' : 'password'}  {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={updatePasswordForm.control}
                                name="confirmUpdatedPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
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
                                    className="text-sm ml-3  cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Show Password
                                </label>
                            </div>

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
