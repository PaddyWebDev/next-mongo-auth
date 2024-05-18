import React, { useEffect, useRef, useState } from 'react'


import { z } from "zod";


import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from 'react-hot-toast';
import { decryptImageString, encryptImageString, getUser, updateProfileImage } from '@/hooks/server-hooks';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { User } from '@prisma/client';



interface UpdateProfileImageProps {
    userData: User
}


const UpdateProfileImageSchema = z.object({
    profileImageSrc: z.any()
})


export default function UpdateProfileImage({ userData }: UpdateProfileImageProps) {
    const [imageSrc, setImageSrc] = useState<string>("https://github.com/shadcn.png")
    const { data: session, update } = useSession()
    const UpdateImageForm = useForm({
        resolver: zodResolver(UpdateProfileImageSchema),
        defaultValues: {
            profileImageSrc: null
        }
    })

    useEffect(() => {
        async function getImage() {
            if (userData.picture) {
                setImageSrc(await decryptImageString(userData.picture))
            }
        }
        getImage()
    }, [userData.picture])

    async function HandleProfileImageUpdate(data: any) {
        const user = await getUser(userData.email)
        if (imageSrc && user) {
            await updateProfileImage(user?.id, await encryptImageString(imageSrc))
                .then((response) => {
                    toast.success("Updated Profile")
                }).catch((error) => toast.error("Failed to Update the Image"))
        }

    }

    function HandleImageUrl(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            // Convert the selected file to a data URL
            const reader = new FileReader();
            reader.onloadend = (e) => {
                setImageSrc(e.target?.result as string); // Update the image source with the data URL
            };
            reader.readAsDataURL(file);
        }

    }
    return (
        <div className="bg-neutral-100 dark:bg-neutral-900 mt-5 rounded p-8 ">
            <h1 className="scroll-m-20  pb-2 text-xl mt-2 font-semibold tracking-tight ">
                Profile Image
            </h1>
            <p className="text-sm">Update your {"account's"} profile information & email address</p>
            <div className="mt-5 flex items-center justify-between flex-wrap-reverse">
                <div className="md:w-6/12 md:flex-1 md:my-0 my-3 w-full  " >

                    <Form {...UpdateImageForm} >
                        <form className="space-y-8" onSubmit={UpdateImageForm.handleSubmit(HandleProfileImageUpdate)}>
                            <FormField
                                name="profileImageSrc"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Profile Picture</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                {...field}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    field.onChange(event);
                                                    HandleImageUrl(event);
                                                }}
                                                accept='image/*'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Upload</Button>
                        </form>
                    </Form>
                </div>

                <div className='md:6/12  p-3  md:flex-1 flex items-center justify-center '>
                    <Avatar className="md:h-4/12 md:w-4/12 h-[70%] w-[70%]" >
                        <AvatarImage src={imageSrc} className="object-cover" draggable="false" />
                    </Avatar>

                </div>
                <div>

                </div>
            </div >
        </div >

    )
}
{/* <form className='space-y-8' onSubmit={HandleProfileImageUpdate}>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label>Picture</Label>
                            <Input id="picture" type="file" onChange={HandleImageUrl} accept='image/*' />
                        </div>


                        <Button type="submit" variant={"default"}>Submit</Button>
                    </form> */}