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
        scope: "openid profile email"
      }
    }
  })
];

/**
 * Configuração do NextAuth com manipuladores de autenticação
 */
const handler = NextAuth({
  providers,
  debug: true, // Ativa o modo de debug
  logger: {
    error(code, metadata) {
      console.error(`NextAuth error: ${code}`, metadata);
    },
    warn(code) {
      console.warn(`NextAuth warning: ${code}`);
    },
    debug(code, metadata) {
      console.log(`NextAuth debug: ${code}`, metadata);
    }
  },
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("Login attempt:", { email: user.email, provider: account?.provider });
      console.log("Account data:", account);
      console.log("Profile data:", profile);
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirecting to:", url, "from:", baseUrl);
      // Permite qualquer redirecionamento do provedor de autenticação
      // e então direciona para o dashboard após autenticação bem-sucedida
      if (url.startsWith(baseUrl) || url.includes('/api/auth/callback')) {
        return `${baseUrl}/dashboard`;
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
