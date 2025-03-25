// Implementação de API Route para NextAuth.js com App Router
// Este arquivo é responsável por gerenciar todas as rotas de autenticação
// em /api/auth/*, incluindo callbacks, login, logout, etc.

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import LinkedIn from "next-auth/providers/linkedin";

/**
 * Configuração dos provedores de autenticação OAuth
 */
const providers = [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    authorization: {
      params: {
        prompt: "consent",
        access_type: "offline",
        response_type: "code"
      }
    }
  }),
  GitHub({
    clientId: process.env.GITHUB_ID || "",
    clientSecret: process.env.GITHUB_SECRET || "",
  }),
  LinkedIn({
    clientId: process.env.LINKEDIN_ID || "",
    clientSecret: process.env.LINKEDIN_SECRET || "",
    authorization: {
      params: {
        scope: 'openid profile email'
      }
    }
  })
];

/**
 * Configuração do NextAuth com manipuladores de autenticação
 */
const handler = NextAuth({
  providers,
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("Login attempt:", { email: user.email, provider: account?.provider });
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirecting to:", url, "from:", baseUrl);
      if (url.includes('/api/auth/callback') || url === baseUrl || url === '/' || url.startsWith(baseUrl)) {
        return `${baseUrl}/blog`;
      }
      return url;
    },
    async session({ session }) {
      console.log("Session created:", session);
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/'
  }
});

// Exportação direta dos handlers GET e POST para App Router
export { handler as GET, handler as POST };
