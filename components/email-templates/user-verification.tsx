// emails/verifyOTP.tsx
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Section,
    Tailwind,
    Img,
    Text,
} from "@react-email/components";

interface VerifyOTPProps {
    verificationCode: string;
}

const LOGO_URL = "https://example.com/logo.png"; // Replace with your logo URL

export default function UserVerification({ verificationCode }: VerifyOTPProps) {
    return (
        <Html>
            <Tailwind>
                <Head />
                <Body className="font-sans bg-gray-50">
                    <Container className="bg-white border border-gray-200 rounded-lg shadow-md mt-8 mx-auto p-8">
                        <div className="flex flex-col items-center">
                            <Img
                                src={LOGO_URL}
                                width={88}
                                height={88}
                                alt="Logo"
                                className="my-4"
                            />
                            <Text className="text-blue-500 text-xs font-bold tracking-wide uppercase mb-2">
                                Verify Your Identity
                            </Text>
                            <Heading className="text-gray-800 text-2xl font-medium text-center mb-4">
                                Enter the following code to verify your identity.
                            </Heading>
                        </div>
                        <Section className="bg-gray-100 rounded-md px-4 py-6 flex items-center justify-center mb-6">
                            <Text className="text-4xl font-bold text-gray-800 tracking-wide">
                                {verificationCode}
                            </Text>
                        </Section>
                        <Text className="text-gray-600 text-base font-normal leading-6 text-center">
                            If you did not request this code, please disregard this message.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}