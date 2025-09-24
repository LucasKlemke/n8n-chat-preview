'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="text-center py-8 sm:py-12 space-y-4">
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl font-light text-foreground tracking-tight">
            N8N App Preview
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Plataforma de previsão de chat de inteligência artificial personalizada para empresas
          </p>
        </div>
      </div>

      {/* Cards Grid Section */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Admin Panel Card */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Painel Administrativo</CardTitle>
              <CardDescription>
                Gerencie configurações, visualize estatísticas e monitore conversas
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button asChild size="lg" className="w-full">
                <Link href="/admin">
                  Acessar Painel
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Company Chat Card */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Chat da Empresa</CardTitle>
              <CardDescription>
                Acesse o chat personalizado da sua empresa com IA
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  const company = prompt("Digite o nome da empresa para acessar o chat:");
                  if (company) {
                    window.location.href = `/${encodeURIComponent(company)}`;
                  }
                }}
              >
                Acessar Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
