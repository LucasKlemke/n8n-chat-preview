"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function RegisterPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao criar conta");
      } else {
        router.push("/login?message=Conta criada com sucesso");
      }
    } catch (error) {
      setError("Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left side - Image/Illustration */}
        <div className="hidden lg:flex lg:flex-col lg:justify-center lg:items-center bg-gradient-to-br from-[#075e54] to-[#075e54]/80 p-12">
          <div className="text-center text-white space-y-6">

            <div>
              <h2 className="text-3xl font-bold mb-4">Junte-se a nós!</h2>
              <p className="text-white/90 text-lg">
                Crie sua conta e comece a construir chats personalizados para seus clientes.
              </p>
            </div>
            <div className="flex justify-center space-x-4 mt-8">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white/40 rounded-full"></div>
              <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex flex-col justify-center px-6 py-12 sm:px-8 lg:px-12">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Criar Conta</h1>
              <p className="text-muted-foreground">
                Preencha os dados para criar sua conta
              </p>
            </div>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-sm font-medium">Nome</Label>
                    <Input
                      id="nome"
                      type="text"
                      placeholder="Seu nome completo"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                      className="h-11 focus-visible:ring-0 focus-visible:border-[#075e54]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 focus-visible:ring-0 focus-visible:border-[#075e54]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-11 focus-visible:ring-0 focus-visible:border-[#075e54]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Digite a senha novamente"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-11 focus-visible:ring-0 focus-visible:border-[#075e54]"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-[#075e54] hover:bg-[#075e54]/90 h-11" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Criando conta..." : "Criar Conta"}
                  </Button>
                  
                  <div className="text-center text-sm">
                    <span className="text-muted-foreground">Já tem uma conta? </span>
                    <Link href="/login" className="text-[#075e54] hover:underline font-medium">
                      Fazer login
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
