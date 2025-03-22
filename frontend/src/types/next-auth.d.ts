import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"]
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
  }
} 