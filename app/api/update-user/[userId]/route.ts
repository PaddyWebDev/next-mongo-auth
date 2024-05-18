import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { redirect } from "next/navigation";

interface UpdateUserProps {
  params: {
    userId: string;
  };
}

export async function PATCH(request: NextRequest, { params }: UpdateUserProps) {
  try {
    const data = await request.json();
    const { name, email } = data.formData;
    const existingUserWithEmail = await prisma?.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUserWithEmail && existingUserWithEmail.id !== params.userId) {
      return new NextResponse("Email address is already registered", {
        status: 409,
      });
    }

    // Check if the user exists
    const user = await prisma?.user.findUnique({
      where: {
        id: params.userId,
      },
    });

    if (!user) {
      return new NextResponse("User Not Found", { status: 404 });
    }

    // if (user.email === email) {
    //   return new NextResponse("Emails must be different", { status: 400 });
    // }

    // Update the user
    await prisma?.user.update({
      where: {
        id: params.userId,
      },
      data: {
        name: name,
        email: email,
        emailVerified: null,
      },
    });


    return new NextResponse("User Updated", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
