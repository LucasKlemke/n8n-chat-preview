'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminLoginProps {
  onLogin: (code: string) => void;
  isLoading?: boolean;
}

export function AdminLogin({ onLogin, isLoading = false }: AdminLoginProps) {
  const [adminCode, setAdminCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(adminCode);
  };

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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminCode" className="text-sm font-medium">
                Código de Administração
              </Label>
              <Input
                id="adminCode"
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                required
                placeholder="Digite o código"
                className="focus-visible:ring-0 focus-visible:border-[#075e54]"
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#075e54] hover:bg-[#075e54]/90"
              disabled={isLoading}
            >
              {isLoading ? 'Verificando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
