import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios, { AxiosError } from "axios";

console.log("NEXTAUTH_URL at module level:", process.env.NEXTAUTH_URL);

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
      // Adicionar log para depurar o redirect_uri
      profile(profile) {
        console.log("Google Provider - redirect_uri:", `${process.env.NEXTAUTH_URL}/api/auth/callback/google`);
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      console.log("NEXTAUTH_URL in jwt callback:", process.env.NEXTAUTH_URL);
      console.log("Redirect URI in jwt callback:", `${process.env.NEXTAUTH_URL}/api/auth/callback/google`);
      if (account) {
        try {
          const response = await axios.post(
            `${process.env.BACKEND_API_URL}/api/auth/google/`,
            { access_token: account.access_token },
            { headers: { "Content-Type": "application/json" } }
          );
          token.accessToken = response.data.token;
        } catch (error) {
          const axiosError = error as AxiosError;
          console.error("Error exchanging token with backend:", axiosError.response?.data || axiosError.message);
          throw new Error("Failed to authenticate with backend");
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback - baseUrl:", baseUrl);
      const correctedBaseUrl = process.env.NEXTAUTH_URL || baseUrl;
      console.log("Corrected baseUrl:", correctedBaseUrl);
      return `${correctedBaseUrl}/`;
    },
  },
  pages: {
    error: '/error',
    signIn: '/login',
  },
  debug: true,
});