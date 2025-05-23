import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

console.log(
  "Prisma client in /api/auth/register:",
  typeof prisma,
  prisma ? Object.keys(prisma) : "Prisma is null/undefined"
);
console.log(
  "DATABASE_URL available in /api/auth/register:",
  !!process.env.DATABASE_URL
);
console.log(
  "NEXTAUTH_SECRET starts with in /api/auth/register:",
  process.env.NEXTAUTH_SECRET?.substring(0, 5)
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new NextResponse("Missing name, email, or password", {
        status: 400,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword, // Changed 'password' to 'passwordHash'
      },
    });

    return NextResponse.json(
      {
        user: { id: user.id, name: user.name, email: user.email },
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
