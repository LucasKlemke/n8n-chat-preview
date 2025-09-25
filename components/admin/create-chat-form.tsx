'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useCreateChat } from '@/lib/hooks/use-chats';
import { ChatFormData } from '@/lib/types';

export function CreateChatForm() {
  const [formData, setFormData] = useState<ChatFormData>({
    companyName: '',
    prompt: ''
  });

  const createChatMutation = useCreateChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createChatMutation.mutateAsync(formData);
      setFormData({ companyName: '', prompt: '' });
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Error creating chat:', error);
    }
  };

  const isLoading = createChatMutation.isPending;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base sm:text-lg">Criar Novo Chat</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-sm font-medium">
              Nome da Empresa
            </Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
              placeholder="Ex: Empresa ABC"
              className="focus-visible:ring-0 focus-visible:border-[#075e54] h-10 sm:h-11"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-sm font-medium">
              Prompt Personalizado
            </Label>
            <textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              required
              rows={3}
              className="w-full border border-input rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:border-[#075e54] resize-none min-h-[80px] sm:min-h-[100px]"
              placeholder="Digite o prompt personalizado para esta empresa..."
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-[#075e54] hover:bg-[#075e54]/90 h-10 sm:h-11"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span className="hidden sm:inline">Criando...</span>
                <span className="sm:hidden">...</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Criar Chat</span>
                <span className="sm:hidden">Criar</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
