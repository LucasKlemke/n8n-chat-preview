'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useUpdateChat } from '@/lib/hooks/use-chats';
import { ChatFormData, Chat } from '@/lib/types';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

interface EditChatFormProps {
  chat: Chat;
  onSuccess?: () => void;
}

export function EditChatForm({ chat, onSuccess }: EditChatFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ChatFormData>({
    companyName: chat.companyName,
    prompt: chat.prompt
  });
  const [businessInfo, setBusinessInfo] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);

  const updateChatMutation = useUpdateChat();

  // Initialize form data when chat changes
  useEffect(() => {
    setFormData({
      companyName: chat.companyName,
      prompt: chat.prompt
    });
  }, [chat]);

  const generatePrompt = async () => {
    if (!businessInfo.trim()) {
      toast.error('Por favor, insira informações sobre o negócio da empresa');
      return;
    }

    setIsGeneratingPrompt(true);
    try {
      const response = await fetch('/api/admin/create-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: businessInfo,
          currentPrompt: formData.prompt,
          isImprovement: true
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao melhorar prompt');
      }

      const data = await response.json();
      setGeneratedPrompt(data.data.content);
      setFormData({ ...formData, prompt: data.data.content });
      setStep(2);
      toast.success('Prompt melhorado com sucesso!');
    } catch (error) {
      console.error('Error improving prompt:', error);
      toast.error('Erro ao melhorar prompt. Tente novamente.');
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateChatMutation.mutateAsync({
        id: chat.id,
        data: formData
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      toast.success('Chat atualizado com sucesso!');
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Error updating chat:', error);
    }
  };

  const isLoading = updateChatMutation.isPending;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg">
            {step === 1 ? 'Editar Chat' : 'Revisar Prompt'}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Passo {step} de 2</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {step === 1 ? (
          <div className="space-y-4 sm:space-y-6">
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
                disabled={isGeneratingPrompt}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessInfo" className="text-sm font-medium">
                Informações Adicionais para Melhorar o Prompt (Opcional)
              </Label>
              <Textarea
                id="businessInfo"
                value={businessInfo}
                onChange={(e) => setBusinessInfo(e.target.value)}
                className="h-32 focus-visible:ring-0 focus-visible:border-[#075e54]"
                placeholder="Descreva informações adicionais sobre o negócio da empresa para melhorar o prompt atual..."
                disabled={isGeneratingPrompt}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-sm font-medium">
                Prompt Atual (Você pode editar diretamente)
              </Label>
              <Textarea
                id="prompt"
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                required
                className="h-64 focus-visible:ring-0 focus-visible:border-[#075e54]"
                placeholder="Prompt personalizado para esta empresa..."
                disabled={isGeneratingPrompt}
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={generatePrompt}
                disabled={isGeneratingPrompt || !businessInfo.trim()}
                variant="outline"
                className="w-full sm:w-auto h-10 sm:h-11"
              >
                {isGeneratingPrompt ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span className="hidden sm:inline">Melhorando Prompt...</span>
                    <span className="sm:hidden">Melhorando...</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Melhorar Prompt</span>
                    <span className="sm:hidden">Melhorar</span>
                  </>
                )}
              </Button>
              <Button
                onClick={() => setStep(2)}
                disabled={isGeneratingPrompt || !formData.companyName.trim() || !formData.prompt.trim()}
                className="flex-1 sm:flex-none bg-[#075e54] hover:bg-[#075e54]/90 h-10 sm:h-11"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Continuar</span>
                <span className="sm:hidden">Próximo</span>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-sm font-medium">
                Prompt Final (Você pode editar)
              </Label>
              <Textarea
                id="prompt"
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                required
                className="h-96 focus-visible:ring-0 focus-visible:border-[#075e54]"
                placeholder="Prompt personalizado para esta empresa..."
                disabled={isLoading}
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 sm:flex-none bg-[#075e54] hover:bg-[#075e54]/90 h-10 sm:h-11"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span className="hidden sm:inline">Salvando...</span>
                    <span className="sm:hidden">Salvando...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Salvar Alterações</span>
                    <span className="sm:hidden">Salvar</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
