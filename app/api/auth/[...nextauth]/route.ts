import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prismadb";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing Credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        if (!user || !user?.password) {
          throw new Error("Missing Credentials");
        }

        const IsPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!IsPasswordCorrect) {
          throw new Error("Password Doesn't Match");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        // Update the token with new session data
        token = { ...token, ...session.user };
      }
      return token;
    },
    async session({ session, token }) {
      // Merge session data with token data
      session.user = token;
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
