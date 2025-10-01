'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useDeleteChat } from '@/lib/hooks/use-chats';
import { Chat } from '@/lib/types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ChatItemProps {
  chat: Chat;
}

export function ChatItem({ chat }: ChatItemProps) {
  const router = useRouter();
  const deleteChatMutation = useDeleteChat();

  const handleEdit = () => {
    router.push(`/admin/chat/${chat.id}/edit`);
  };


  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este chat?')) return;
    
    try {
      await deleteChatMutation.mutateAsync(chat.id);
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Error deleting chat:', error);
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/${encodeURIComponent(chat.companyName)}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copiado para a área de transferência!');
  };

  const isLoading = deleteChatMutation.isPending;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-[#075e54]/10 rounded-full flex items-center justify-center">
                <span className="text-xs sm:text-sm font-medium text-[#075e54]">
                  {chat.companyName?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm sm:text-lg font-semibold truncate">{chat.companyName}</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Criado em {new Date(chat.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              {chat._count && (
                <p className="text-xs text-muted-foreground">
                  {chat._count.messages} mensagem{chat._count.messages !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Ativo
              </span>
            </div>
          </div>
          
          {/* Accordion para o prompt */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={`prompt-${chat.id}`} className="border-none">
              <AccordionTrigger className="py-2 px-3 sm:px-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-all duration-200 [&[data-state=open]]:bg-[#075e54]/10 [&[data-state=open]]:text-[#075e54] group">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-muted-foreground group-data-[state=open]:text-[#075e54]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-xs sm:text-sm font-medium">
                      <span className="group-data-[state=closed]:inline group-data-[state=open]:hidden">Ver Prompt</span>
                      <span className="group-data-[state=closed]:hidden group-data-[state=open]:inline">Ocultar Prompt</span>
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-3 pb-0">
                <div className="bg-gradient-to-br from-muted/40 to-muted/60 rounded-lg p-3 sm:p-4 border border-muted/50">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-2 h-2 bg-[#075e54] rounded-full"></div>
                    <p className="text-xs sm:text-sm font-semibold text-[#075e54]">Prompt Personalizado:</p>
                  </div>
                  <div className="bg-background/80 rounded-md p-3 border border-border/50">
                    <p className="text-xs sm:text-sm leading-relaxed break-words whitespace-pre-wrap text-foreground/90">
                      {chat.prompt}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="pt-4 border-t space-y-3">
          {/* Mobile buttons - stacked */}
          <div className="flex flex-col sm:hidden space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyLink}
              className="text-[#075e54] border-[#075e54]/20 hover:bg-[#075e54]/10 justify-start h-9"
              disabled={isLoading}
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copiar Link
            </Button>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="text-blue-600 border-blue-200 hover:bg-blue-50 flex-1 h-9"
                disabled={isLoading}
              >
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 border-red-200 hover:bg-red-50 flex-1 h-9"
                disabled={isLoading}
              >
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Excluir
              </Button>
            </div>
          </div>
          
          {/* Desktop buttons - horizontal */}
          <div className="hidden sm:flex items-center justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyLink}
              className="text-[#075e54] border-[#075e54]/20 hover:bg-[#075e54]/10"
              disabled={isLoading}
            >
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copiar Link
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
              disabled={isLoading}
            >
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 border-red-200 hover:bg-red-50"
              disabled={isLoading}
            >
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Excluir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
