'use client';

import { useState } from 'react';
import { AdminLogin } from '@/components/admin/admin-login';
import { AdminHeader } from '@/components/admin/admin-header';
import { CreateChatForm } from '@/components/admin/create-chat-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function NewChatPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const handleLogin = (code: string) => {
    // In a real application, this should validate against server
    if (code === 'admin123') {
      setIsAuthenticated(true);
      toast.success('Login realizado com sucesso!');
    } else {
      toast.error('Código de administração inválido!');
    }
  };

  const handleBackToAdmin = () => {
    router.push('/admin');
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-6">
          {/* Header with back button */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToAdmin}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Admin
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Criar Novo Chat/Agente
              </h1>
              <p className="text-muted-foreground mt-1">
                Configure um novo chat personalizado para uma empresa
              </p>
            </div>
          </div>

          {/* Chat creation form - full width */}
          <div className="w-full">
            <CreateChatForm />
          </div>
        </div>
      </div>
    </div>
  );
}
