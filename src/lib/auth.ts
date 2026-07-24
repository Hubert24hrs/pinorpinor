import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,

  providers: [
    // ── Google OAuth ──────────────────────────────────────────
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    // ── Facebook OAuth ─────────────────────────────────────────
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID!,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
    }),

    // ── Email + Password ───────────────────────────────────────
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
            image: true,
            role: true,
            verificationStatus: true,
            passwordHash: true,
            emailVerified: true,
            isActive: true,
            isBanned: true,
          },
        });

        if (!user || !user.passwordHash) return null;
        if (!user.isActive || user.isBanned) return null;

        const isValid = await compare(password, user.passwordHash);
        if (!isValid) return null;

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          username: user.username,
          role: user.role,
          verificationStatus: user.verificationStatus,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.role = (user as any).role;
        token.verificationStatus = (user as any).verificationStatus;
      }

      // Refresh role from DB on each token refresh (for role updates)
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, username: true, verificationStatus: true, isActive: true, isBanned: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.username = dbUser.username;
          token.verificationStatus = dbUser.verificationStatus;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
        session.user.verificationStatus = token.verificationStatus as string;
      }
      return session;
    },

    async signIn({ user, account }) {
      // Allow OAuth sign-ins without email verification requirement
      if (account?.provider !== "credentials") return true;

      // For credentials, require email verification
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
        select: { emailVerified: true },
      });

      return !!dbUser?.emailVerified;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/verify-email",
    newUser: "/register/complete",
  },

  events: {
    async createUser({ user }) {
      // Create default profile and settings for new users
      await prisma.profile.upsert({
        where: { userId: user.id! },
        update: {},
        create: { userId: user.id! },
      });
      await prisma.settings.upsert({
        where: { userId: user.id! },
        update: {},
        create: { userId: user.id! },
      });
    },
  },
});
