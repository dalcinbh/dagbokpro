// frontend/src/pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

type AccountType = {
  provider: string;
  type: string;
  access_token?: string;
};

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: any; account: AccountType | null }) {
      if (account) {
        try {
          const response = await axios.post(
            `${process.env.BACKEND_API_URL}/auth/google/`,
            { access_token: account.access_token },
            { headers: { "Content-Type": "application/json" } }
          );
          token.accessToken = response.data.token;
        } catch (error) {
          console.error("Error exchanging token with backend:", error);
          throw new Error("Failed to authenticate with backend");
        }
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken;
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      const correctedBaseUrl = process.env.NEXTAUTH_URL || baseUrl;
      return url.startsWith("/") ? `${correctedBaseUrl}${url}` : url;
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  debug: true, // Ativa logs para depuração
});