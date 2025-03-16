// components/Login.tsx
import Image from 'next/image';

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-5">
      {/* Logo */}
      <div className="text-center">
        <Image src="/dagbok-logo.png" alt="Dagbok Logo" width={250} height={250} />
      </div>

      {/* Title */}
      <h1 className="font-montserrat font-bold text-1xl text-[#1E2A44]">
        Log in/Create to your Dagbok account
      </h1>

      {/* Social Login Buttons */}
      <div className="flex flex-col gap-3">
        <button className="flex items-center gap-3 px-5 py-2 border border-[#E0E0E0] rounded-lg bg-white hover:shadow-md transition-shadow">
          <Image src="/google-icon.png" alt="Google" width={20} height={20} />
          <span className="font-poppins text-base text-[#1E2A44]">Log in with Google</span>
        </button>
        <button className="flex items-center gap-3 px-5 py-2 border border-[#E0E0E0] rounded-lg bg-white hover:shadow-md transition-shadow">
          <Image src="/linkedin-icon.png" alt="LinkedIn" width={20} height={20} />
          <span className="font-poppins text-base text-[#1E2A44]">Log in with LinkedIn</span>
        </button>
      </div>
    </div>
  );
};

export default Login;