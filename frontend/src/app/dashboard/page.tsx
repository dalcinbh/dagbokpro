import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth, signOutUser } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Dashboard Page Component
 * This is a protected page that can only be accessed by authenticated users
 * It displays user information and provides logout functionality
 */
export default async function Dashboard() {
  // Get the current session
  const session = await auth();
  
  // Redirect to home if not authenticated
  if (!session) {
    redirect('/login');
  }

  /**
   * Server Action for Sign Out
   * This function is called when the logout button is clicked
   * It ends the user session and redirects to the home page
   */
  async function signOutAction() {
    'use server';
    await signOutUser();
  }

  return (
    // Main container with centered content and gray background
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Dashboard card displaying user info */}
      <Card className="w-[350px]">
        <CardHeader className="flex flex-col items-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={session.user?.image || ""} />
            <AvatarFallback>{session.user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <CardTitle>{session.user?.name || "Usuário"}</CardTitle>
          <CardDescription>{session.user?.email || ""}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {/* User information display */}
          <div className="mb-4">
            <p><strong>Nome:</strong> {session.user?.name}</p>
            <p><strong>Email:</strong> {session.user?.email}</p>
          </div>
          {/* Logout button */}
          <form action={signOutAction}>
            <Button variant='destructive'>Logout</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 