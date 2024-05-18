import bcrypt from "bcryptjs";
import prisma from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
const { json } = NextResponse;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;
    if (!email || !name || !password)
      return json({ message: "Missing Details" }, { status: 422 });

    const HashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        name,
        email,
        password: HashedPassword,
      },
    });

    return new NextResponse("User Created", { status: 200 });
  } catch (error: any) {
    return json(
      { message: "Internal Server Error", ErrorMessage: error.message },
      { status: 500 }
    );
  }
}
