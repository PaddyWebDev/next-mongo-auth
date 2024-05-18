import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import ForgetPasswordEmailTemplate from "@/components/email-templates/forget-password";
import { Resend } from "resend";
import { generateEmailHashToken, getExpirationDate } from "@/hooks/hooks";

const { json } = NextResponse;
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    if (!email) {
      return new NextResponse(
        "Email is Required for the process of forget Password",
        { status: 422 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return new NextResponse("User Not Found", { status: 404 });
    }

    const hashToken = generateEmailHashToken();
    const data = await resend.emails.send({
      from: "Next Auth App <onboarding@resend.dev>",
      to: [email],
      subject: "Reset Password",
      react: ForgetPasswordEmailTemplate({
        email: email,
        token: hashToken,
      }),
    });

    if (data.error === null) {
      await prisma.emailSent.create({
        data: {
          purpose: "PASSWORD_RESET",
          sentTo: email,
          expirationTime: getExpirationDate(),
          token: hashToken,
          status: "Pending",
        },
      });
      return new NextResponse("Email Sent", { status: 200 });
    }

    return new NextResponse("Failed to send the email", { status: 503 });
  } catch (error: any) {
    return json(
      { message: "Internal Server Error", ErrorMessage: error.message },
      { status: 500 }
    );
  }
}
