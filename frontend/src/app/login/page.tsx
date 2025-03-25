'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signInWithGoogle, signInWithGitHub, signInWithLinkedIn } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Login Page Component
 * This is the main entry point for authentication
 * It handles the social login buttons and their actions
 */
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [linkedinError, setLinkedinError] = useState(false);

  /**
   * Server Action for Google Login
   * This function is called when the Google login button is clicked
   * It initiates the OAuth flow with Google
   */
  async function signInGoogleAction() {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setIsLoading(false);
    }
  }

  /**
   * Server Action for GitHub Login
   * This function is called when the GitHub login button is clicked
   * It initiates the OAuth flow with GitHub
   */
  async function signInGitHubAction() {
    setIsLoading(true);
    try {
      await signInWithGitHub();
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
      setIsLoading(false);
    }
  }

  /**
   * Server Action for LinkedIn Login
   * This function is called when the LinkedIn login button is clicked
   * It initiates the OAuth flow with LinkedIn
   */
  async function signInLinkedInAction() {
    setIsLoading(true);
    try {
      await signInWithLinkedIn();
    } catch (error) {
      console.error('Error signing in with LinkedIn:', error);
      setIsLoading(false);
      setLinkedinError(true);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Dagbok"
            width={240}
            height={80}
            priority
            className="object-contain w-auto"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Entre com sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Escolha um dos provedores abaixo
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Login Social</CardTitle>
            <CardDescription className="text-center">Escolha seu método de login</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mensagem de erro para LinkedIn */}
            {linkedinError && (
              <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md mb-4 text-sm">
                O login com LinkedIn está temporariamente indisponível. Por favor, use Google ou GitHub.
              </div>
            )}
            
            {/* Google Login Button */}
            <Button 
              className="w-full flex items-center justify-center gap-3" 
              onClick={signInGoogleAction}
              disabled={isLoading}
            >
              <Image
                src="/google.svg"
                alt="Google"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span>Continuar com Google</span>
            </Button>

            {/* GitHub Login Button */}
            <Button 
              className="w-full flex items-center justify-center gap-3" 
              variant="outline"
              onClick={signInGitHubAction}
              disabled={isLoading}
            >
              <Image
                src="/github.svg"
                alt="GitHub"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span>Continuar com GitHub</span>
            </Button>

            {/* LinkedIn Login Button */}
            <Button 
              className="w-full flex items-center justify-center gap-3" 
              variant="secondary"
              onClick={signInLinkedInAction}
              disabled={isLoading}
            >
              <Image
                src="/linkedin.svg"
                alt="LinkedIn"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span>Continuar com LinkedIn</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 