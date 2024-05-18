"use server";
import UserVerification from "@/components/email-templates/user-verification";
import prisma from "@/lib/prismadb";
import { Resend } from "resend";
import { getExpirationDate } from "./hooks";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function getEmailInfo(userEmail: string, emailToken: string) {
  const response = await prisma?.emailSent.findUnique({
    where: {
      token: emailToken,
      sentTo: userEmail,
      status: "Pending",
    },
  });

  return response;
}

export async function sendEmailVerification(
  userEmail: string,
  verificationCode: string
) {
  const expirationDate = getExpirationDate();
  await prisma.emailSent
    .create({
      data: {
        sentTo: userEmail,
        purpose: "ACCOUNT_ACTIVATION",
        token: verificationCode.toString(),
        expirationTime: expirationDate,
        status: "Pending",
      },
    })
    .then(async (data) => {
      const email = await resend.emails
        .send({
          from: "Next Auth App <onboarding@resend.dev>",
          to: userEmail,
          subject: "User Verification",
          react: UserVerification({ verificationCode: verificationCode }),
        })
        .catch((error) => {
          throw new Error("Failed to Send the Email");
        });
    })
    .catch((error) => {
      throw new Error("Insertion to Database Failed");
    });
}

export async function verifyOtp(frontEndOtp: string, userEmail: string) {
  const response = await prisma.emailSent.findUnique({
    where: {
      token: frontEndOtp,
      sentTo: userEmail,
      status: "Pending",
    },
  });
  if (response?.expirationTime && response?.expirationTime < new Date()) {
    return "The Link has expired";
  }

  const data = await prisma.user
    .update({
      data: {
        emailVerified: new Date(),
        updatedAt: new Date(),
      },
      where: {
        email: userEmail,
      },
    })
    .then(async (data) => {
      await prisma?.emailSent.update({
        data: {
          status: "Done",
        },
        where: {
          id: response?.id,
          sentTo: userEmail,
        },
      });
    })
    .catch((error) => {
      return "Failed to Update the Email Table";
    })
    .catch((error) => {
      return "Failed to Update the User";
    });
  return data;
}

export async function fetchUserDataUsingEmail(email: string) {
  const data = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return data;
}


