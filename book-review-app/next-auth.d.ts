// filepath: c:\Users\leomi\OneDrive\Documentos\GitHub\TP1F\book-review-app\next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id?: string;
    } & DefaultSession["user"];
    accessToken?: string; // Example: if you add accessToken to session
  }

  interface User extends DefaultUser {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    accessToken?: string; // Example: if you add accessToken to JWT
  }
}
