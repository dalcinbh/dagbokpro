// frontend/src/components/Login.tsx
import Image from 'next/image';
import { useGoogleLogin } from '@react-oauth/google';
import { useEffect } from 'react';
import axios from 'axios';

const Login = () => {
  // Função para lidar com o sucesso da autenticação
  const handleGoogleLoginSuccess = async (tokenResponse: any) => {
    try {
      // Enviar o token para o backend para validação
      const response = await axios.post(
        'https://auth.dagbok.pro/app2/api/auth/google/', // Endpoint do backend
        { access_token: tokenResponse.access_token },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Login bem-sucedido:', response.data);
      // Redirecionar para a página principal após login (ajuste conforme necessário)
      window.location.href = 'https://auth.dagbok.pro/app1'; // Ou '/app1' se local
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  // Função para iniciar o login com Google
  const login = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: (error) => console.error('Erro no login com Google:', error),
    flow: 'implicit', // Usado para fluxo implícito (client-side)
    scope: 'profile email', // Escopos necessários
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-5">
      <div className="text-center">
        <Image src="/dagbok-logo.png" alt="Dagbok Logo" width={250} height={250} />
      </div>
      <h1 className="font-montserrat font-bold text-1xl text-[#1E2A44]">
        Log in/Create to your Dagbok account
      </h1>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => login()}
          className="flex items-center gap-3 px-5 py-2 border border-[#E0E0E0] rounded-lg bg-white hover:shadow-md transition-shadow"
        >
          <Image src="/google-icon.png" alt="Google" width={20} height={20} />
          <span className="font-poppins text-base text-[#1E2A44]">Log in with Google</span>
        </button>
        {/* Botão LinkedIn pode ser adicionado futuramente */}
      </div>
    </div>
  );
};

export default Login;