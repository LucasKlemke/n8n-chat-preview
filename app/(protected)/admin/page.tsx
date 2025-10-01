'use client';

import { useSession } from 'next-auth/react';
import { AdminHeader } from '@/components/admin/admin-header';
import { ChatList } from '@/components/admin/chat-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleCreateNewChat = () => {
    router.push('/admin/chat/new');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#075e54] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground mb-6">
            Você precisa estar logado para acessar o painel administrativo.
          </p>
          <Button
            onClick={() => router.push('/login')}
            className="bg-[#075e54] hover:bg-[#075e54]/90"
          >
            Fazer Login
          </Button>
        </div>
      </div>
    );
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
              Gerencie seus chats e agentes personalizados
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Logado como: {session.user?.name || session.user?.email}
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
