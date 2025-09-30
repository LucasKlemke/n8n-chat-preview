"use client";

import { AuthGuard } from "@/components/auth/auth-guard";

export default function Home() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#e5ddd5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#075e54] mb-4">
            Bem-vindo à Plataforma
          </h1>
          <p className="text-lg text-gray-600">
            Você está autenticado! Acesse o painel administrativo.
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}