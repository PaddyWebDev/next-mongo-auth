import React from 'react'
import { Tailwind, Button, Html, Head, Container, Text, Hr, Body, Link } from '@react-email/components'
interface ForgetPasswordEmailTemplateProps {
    token: string,
    email: string
}

export default function ForgetPasswordEmailTemplate({ token, email }: ForgetPasswordEmailTemplateProps) {

    return (
        <Html>
            <Tailwind>
                <Head />
                <Body className="max-w-xl mx-auto bg-neutral-50 dark:bg-neutral-950 shadow-lg rounded-md px-8 pt-6 pb-8 mb-4 space-y-8 ">
                    <Container className="mb-4">
                        <h1 className="text-neutral-700 dark:text-neutral-300 text-2xl font-bold mb-2">Reset Your Password</h1>
                        <Text className="text-neutral-700 dark:text-neutral-300 text-sm">
                            We received a request to reset your password. Click the button below to reset it:
                        </Text>
                    </Container>
                    <Container className='w-[100%] flex items-center justify-center'>
                        <Button
                            className="bg-neutral-900 text-neutral-50 px-3 py-2 rounded-md mx-auto hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90"
                            target='default: _blank'
                            href={`${process.env.URL}/reset-password?email=${email}&token=${token}`}
                        >
                            Reset Password
                        </Button>
                    </Container>
                    <Container className=''>
                        <Text className="text-neutral-700 dark:text-neutral-300 text-sm">If you did not create an account, no further action is required.</Text>
                        <Text className="text-neutral-700 dark:text-neutral-300 text-sm my-1">Regards,</Text>
                        <Text className="text-neutral-700 dark:text-neutral-300 text-sm">Next Auth App</Text>
                    </Container>
                    <Hr />
                </Body>
            </Tailwind>
        </Html >
    )
}


