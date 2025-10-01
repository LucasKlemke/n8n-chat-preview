'use client';

import { useSession } from 'next-auth/react';
import { AdminHeader } from '@/components/admin/admin-header';
import { EditChatForm } from '@/components/admin/edit-chat-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useChats } from '@/lib/hooks/use-chats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const chatId = params?.id as string;

  const { data: chats, isLoading: chatsLoading, error: chatsError } = useChats();
  const chat = chats?.find(c => c.id === chatId);

  const handleBackToAdmin = () => {
    router.push('/admin');
  };

  const handleEditSuccess = () => {
    router.push('/admin');
  };

  if (status === 'loading' || chatsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <div className="px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#075e54]" />
            <span className="ml-2 text-muted-foreground">Carregando...</span>
          </div>
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
            Você precisa estar logado para editar chats.
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

  if (chatsError || !chat) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <div className="px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
          <div className="space-y-6">
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
            </div>
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base sm:text-lg">Erro</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-center py-8 sm:py-12 px-4">
                  <div className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-red-500">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm sm:text-base font-medium">Chat não encontrado</h3>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                    O chat que você está tentando editar não foi encontrado ou não existe mais.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
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
                Editar Chat
              </h1>
              <p className="text-muted-foreground mt-1">
                Edite as configurações do chat da empresa: {chat.companyName}
              </p>
            </div>
          </div>

          {/* Chat edit form - full width */}
          <div className="w-full">
            <EditChatForm chat={chat} onSuccess={handleEditSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
}
