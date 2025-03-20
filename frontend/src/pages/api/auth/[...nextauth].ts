// frontend/src/pages/api/auth/[...nextauth].ts

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

// Define the AccountType for TypeScript
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
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: any; account: AccountType | null }) {
      if (account) {
        try {
          // Send the Google access token to the Django backend
          const response = await axios.post(
            `${process.env.BACKEND_API_URL}/api/auth/google/`,
            { access_token: account.access_token },
            { headers: { "Content-Type": "application/json" } }
          );

          // Store the token returned by the backend in the session
          token.accessToken = response.data.token; // Assuming your backend returns a token
        } catch (error) {
          console.error("Error exchanging token with backend:", error);
          throw new Error("Failed to authenticate with backend");
        }
      }
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      // Pass the token to the session
      session.accessToken = token.accessToken;
      return session;
    },
  },
});