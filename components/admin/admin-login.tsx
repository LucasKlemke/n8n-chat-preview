'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export function AdminLogin() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-[#075e54] rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 text-white text-xl font-bold">A</div>
          </div>
          <CardTitle className="text-2xl">Painel de Administração</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Faça login para acessar o painel de administração
            </p>
            <Button asChild className="w-full bg-[#075e54] hover:bg-[#075e54]/90">
              <Link href="/login">
                Fazer Login
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <Link href="/register" className="text-[#075e54] hover:underline">
                Criar conta
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
