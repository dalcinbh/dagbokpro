"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();

    const handleGoogleLogin = async () => {
        const result = await signIn("google");
        if (result?.error) {
            console.error("Login error:", result.error);
        } else {
            router.push("/");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-5">
            <div className="text-center">
                <Image src="/dagbok-logo.png" alt="Dagbok Logo" width={250} height={250} />
            </div>
            <h1 className="font-montserrat font-bold text-xl text-[#1E2A44]">
                Log in/Create to your Dagbok account
            </h1>
            <button
                onClick={handleGoogleLogin}
                className="flex items-center gap-3 px-5 py-2 border border-[#E0E0E0] rounded-lg bg-white hover:shadow-md transition-shadow"
            >
                <Image src="/google-icon.png" alt="Google" width={20} height={20} />
                <span className="font-poppins text-base text-[#1E2A44]">Log in with Google</span>
            </button>
        </div>
    );
}