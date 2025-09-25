'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useChats } from '@/lib/hooks/use-chats';
import { ChatItem } from './chat-item';

export function ChatList() {
  const { data: chats, isLoading, error } = useChats();

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base sm:text-lg">Chats Existentes</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-red-500">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm sm:text-base font-medium">Erro ao carregar chats</h3>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
              Ocorreu um erro ao tentar carregar os chats. Tente recarregar a página.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base sm:text-lg">Chats Existentes</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-[#075e54]" />
            <span className="ml-2 text-sm sm:text-base text-muted-foreground">
              <span className="hidden sm:inline">Carregando...</span>
              <span className="sm:hidden">...</span>
            </span>
          </div>
        ) : !chats || chats.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm sm:text-base font-medium">Nenhum chat criado</h3>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
              Comece criando seu primeiro chat personalizado.
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {chats.map((chat) => (
              <ChatItem key={chat.id} chat={chat} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
