// frontend/src/pages/api/auth/[...nextauth].ts
import NextAuth, { JWT, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import GithubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";
import axios from "axios";

type AccountType = {
  provider: string;
  type: string;
  access_token?: string;
  id_token?: string;
  email?: string;
};

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
        },
      },
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        try {
          console.log('Attempting to exchange token with backend...');
          console.log('Account data:', {
            provider: account.provider,
            type: account.type,
            email: account.email
          });
          console.log('Backend URL:', `${process.env.BACKEND_API_URL}/api/auth/token_login/${account.provider}/`);
          
          const response = await axios.post(
            `${process.env.BACKEND_API_URL}/api/auth/token_login/${account.provider}/`,
            { 
              access_token: account.access_token,
              id_token: account.id_token,
              email: account.email
            },
            { 
              headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
              } 
            }
          );
          
          console.log('Backend response:', response.data);
          token.accessToken = response.data.access;
          token.refreshToken = response.data.refresh;
        } catch (error: any) {
          console.error("Error exchanging token with backend:", error);
          if (error.response) {
            console.error("Backend response:", error.response.data);
            console.error("Status:", error.response.status);
            console.error("Headers:", error.response.headers);
          }
          // Fallback to provider token if backend exchange fails
          token.accessToken = account.access_token;
        }
      }
      return token;
    },
    async session({ session, token, user }) {
      if (token) {
        session.accessToken = token.accessToken as string | undefined;
        session.refreshToken = token.refreshToken as string | undefined;
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Allow authentication-related URLs
      if (url.includes('/login') || url.includes('/api/auth')) {
        return url;
      }

      // Handle relative URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }

      // Allow same-domain URLs
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // Default redirect to resume page
      return `${baseUrl}/resume`;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: true,
});