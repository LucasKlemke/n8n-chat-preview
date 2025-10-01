'use client';

import { useSession } from 'next-auth/react';
import { AdminHeader } from '@/components/admin/admin-header';
import { CreateChatForm } from '@/components/admin/create-chat-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NewChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleBackToAdmin = () => {
    router.push('/admin');
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
            Você precisa estar logado para criar chats.
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
      <div className="px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-6">
          {/* Header with back button */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleBackToAdmin}
              className="rounded-full"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Criar Novo Chat
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
