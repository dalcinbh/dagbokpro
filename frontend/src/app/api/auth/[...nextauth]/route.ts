// Implementação de API Route para NextAuth.js com App Router
// Este arquivo é responsável por gerenciar todas as rotas de autenticação
// em /api/auth/*, incluindo callbacks, login, logout, etc.

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import LinkedIn from "next-auth/providers/linkedin";
import type { NextAuthOptions } from "next-auth";

// Logs para depuração
console.log("Google Client ID disponível?", !!process.env.GOOGLE_CLIENT_ID);
console.log("Google Client Secret disponível?", !!process.env.GOOGLE_CLIENT_SECRET);
console.log("GitHub ID disponível?", !!process.env.GITHUB_ID);
console.log("LinkedIn ID disponível?", !!process.env.LINKEDIN_ID);
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("AUTH_REDIRECT_LINKEDIN:", process.env.AUTH_REDIRECT_LINKEDIN);

// Definição da URL base para redirecionamentos
const baseUrl = process.env.NEXTAUTH_URL || "https://auth.dagbok.pro";

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

// Configuração principal do NextAuth
export const authOptions: NextAuthOptions = {
  providers,
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt" as const
  },
  // Adicionando callback de redirecionamento
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("Tentativa de login:", { 
        email: user.email, 
        provider: account?.provider,
        providerAccountId: account?.providerAccountId
      });
      
      if (account?.provider === "linkedin") {
        console.log("Detalhes da conta LinkedIn:", JSON.stringify(account, null, 2));
        console.log("Perfil LinkedIn:", JSON.stringify(profile, null, 2));
      }
      
      return true;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      console.log("Redirecionamento:", { url, baseUrl });
      
      // Redirecionamento após autenticação
      if (url.includes('/api/auth/callback') || url === baseUrl || url === '/' || url.startsWith(baseUrl)) {
        return `${baseUrl}/dashboard`;
      }
      return url;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.sub;
      }
      return session;
    }
  },
  // Configurações adicionais
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  logger: {
    error(code, metadata) {
      console.error(`[NextAuth][Error][${code}]`, metadata);
    },
    warn(code) {
      console.warn(`[NextAuth][Warning][${code}]`);
    },
    debug(code, metadata) {
      console.log(`[NextAuth][Debug][${code}]`, metadata);
    }
  },
  // Na versão atual do NextAuth, basePath e trustHost já são configurados pela importação padrão
};

// Instância do NextAuth com as configurações
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
