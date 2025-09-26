'use client';

import { useState } from 'react';
import { AdminLogin } from '@/components/admin/admin-login';
import { AdminHeader } from '@/components/admin/admin-header';
import { ChatList } from '@/components/admin/chat-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AdminPage() {
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

  const handleCreateNewChat = () => {
    router.push('/admin/chat/new');
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Painel Administrativo
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie chats e agentes da plataforma
            </p>
          </div>
          <Button
            onClick={handleCreateNewChat}
            className="bg-[#075e54] hover:bg-[#075e54]/90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Criar Novo Chat</span>
            <span className="sm:hidden">Novo</span>
          </Button>
        </div>
        <ChatList />
      </div>
    </div>
  );
}
