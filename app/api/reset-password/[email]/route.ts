import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
const { json } = NextResponse;
import prisma from "@/lib/prismadb";

interface ResetPasswordProps {
  params: {
    email: string;
  };
}

export async function PATCH(
  request: NextRequest,
  { params: { email } }: ResetPasswordProps
) {
  try {
    const { password } = await request.json();
    if (!email || !password) {
      return new NextResponse("Missing Email or Password", { status: 422 });
    }

    const getUser = await prisma?.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!getUser) {
      return new NextResponse("User Not Found", { status: 404 });
    }

    const checkIfThePreviousPasswordIsSame = await bcrypt.compare(
      password,
      getUser.password as string
    );
    if (checkIfThePreviousPasswordIsSame) {
      return new NextResponse("Password is same as previous", { status: 400 });
    }

    const newHashedPassword = await bcrypt.hash(password, 10);

    await prisma?.user.update({
      data: {
        password: newHashedPassword,
      },
      where: {
        email: email,
      },
    });

    return new NextResponse("Updated the Password", { status: 200 });
  } catch (error: any) {
    return json(
      { message: "Internal Server Error", ErrorMessage: error.message },
      { status: 500 }
    );
  }
}
