'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-16">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16 space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl font-light text-foreground tracking-tight">
              My AI App
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Plataforma de chat AI personalizada para empresas
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-normal">
            Powered by AI
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/admin">
              Painel Administrativo
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={(e) => {
              e.preventDefault();
              const company = prompt("Digite o nome da empresa para acessar o chat:");
              if (company) {
                window.location.href = `/${encodeURIComponent(company)}`;
              }
            }}
          >
            Acessar Chat da Empresa
          </Button>
        </div>
      </div>
    </div>
  );
}
