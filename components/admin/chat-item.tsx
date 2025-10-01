'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDeleteChat } from '@/lib/hooks/use-chats';
import { Chat } from '@/lib/types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { 
  Copy, 
  Edit3, 
  Trash2, 
  MessageCircle, 
  Calendar,
  Building2,
  ExternalLink
} from 'lucide-react';

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
    const link = `${window.location.origin}/user/${chat.userId}/chat/${encodeURIComponent(chat.companyName)}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copiado para a área de transferência!');
  };

  const isLoading = deleteChatMutation.isPending;

  return (
    <Card className="group hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/30">
      <CardContent className="p-5 sm:p-6">
        <div className="space-y-5">
          {/* Header Section */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="text-lg font-semibold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
                  {chat.companyName}
                </h4>
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></div>
                  Ativo
                </Badge>
              </div>
              
              {/* Stats Row */}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>
                    {new Date(chat.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                {chat._count && (
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4 text-gray-400" />
                    <span>
                      {chat._count.messages} mensagem{chat._count.messages !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-100">
            {/* Mobile buttons - stacked */}
            <div className="flex flex-col sm:hidden space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={copyLink}
                className="w-full justify-start h-10 text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all"
                disabled={isLoading}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar Link
              </Button>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="flex-1 h-10 text-blue-700 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all"
                  disabled={isLoading}
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="flex-1 h-10 text-red-700 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all"
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </div>
            
            {/* Desktop buttons - horizontal */}
            <div className="hidden sm:flex items-center justify-start gap-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyLink}
                className="h-9 px-4 text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all"
                disabled={isLoading}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="h-9 px-4 text-blue-700 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all"
                disabled={isLoading}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="h-9 px-4 text-red-700 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all"
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

