"use client";

import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams ? searchParams.get("error") : null;

  return (
    <div>
      <h1>Erro de Autenticação</h1>
      <p>Ocorreu um erro durante o login: {error}</p>
      <a href="/app1/login">Tentar novamente</a>
    </div>
  );
}