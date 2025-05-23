import NextAuth, { AuthOptions, SessionStrategy } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

console.log("Prisma client in /api/auth/[...nextauth]:", typeof prisma, prisma ? Object.keys(prisma) : "Prisma is null/undefined");
console.log("DATABASE_URL available in /api/auth/[...nextauth]:", !!process.env.DATABASE_URL);
console.log("NEXTAUTH_SECRET starts with in /api/auth/[...nextauth]:", process.env.NEXTAUTH_SECRET?.substring(0, 5));

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Use user.passwordHash and user.avatar as per schema
        if (user && user.passwordHash && bcrypt.compareSync(credentials.password, user.passwordHash)) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.avatar, // Changed from user.image to user.avatar
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy, // Explicitly cast to SessionStrategy
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) { // Using any for now to avoid compile errors
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) { // Using any for now
      if (session.user && token.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
