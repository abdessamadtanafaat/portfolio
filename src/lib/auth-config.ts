import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { adminUser } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/lib/password";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
    };
  }
  interface User {
    id: string;
    email: string;
    name: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    name: string;
  }
}

const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db
          .select()
          .from(adminUser)
          .where(eq(adminUser.email, credentials.email as string))
          .get();

        if (!user || !(await verifyPassword(credentials.password as string, user.passwordHash))) {
          return null;
        }

        await db.update(adminUser).set({ lastLoginAt: Date.now() }).where(eq(adminUser.id, user.id)).run();

        return { id: user.id.toString(), email: user.email, name: user.name };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
  cookies: {
    sessionToken: {
      name: "admin-session",
      options: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" },
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id;
      if (token.name) session.user.name = token.name;
      return session;
    },
  },
});

export { handlers, auth, signIn, signOut };