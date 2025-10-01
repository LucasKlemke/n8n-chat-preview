'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useCreateChat } from '@/lib/hooks/use-chats';
import { ChatFormData } from '@/lib/types';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

export function CreateChatForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ChatFormData>({
    companyName: '',
    prompt: ''
  });
  const [businessInfo, setBusinessInfo] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);

  const createChatMutation = useCreateChat();

  const generatePrompt = async () => {
    if (!businessInfo.trim()) {
      // Se não há informações do negócio, vai direto para o step 2 com prompt vazio
      setGeneratedPrompt('');
      setFormData({ ...formData, prompt: '' });
      setStep(2);
      toast.success('Prosseguindo para criação do prompt manual');
      return;
    }

    setIsGeneratingPrompt(true);
    try {
      const response = await fetch('/api/admin/create-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: businessInfo }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar prompt');
      }

      const data = await response.json();
      setGeneratedPrompt(data.data.content);
      setFormData({ ...formData, prompt: data.data.content });
      setStep(2);
      toast.success('Prompt gerado com sucesso!');
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast.error('Erro ao gerar prompt. Tente novamente.');
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createChatMutation.mutateAsync(formData);
      setFormData({ companyName: '', prompt: '' });
      setBusinessInfo('');
      setGeneratedPrompt('');
      setStep(1);
      toast.success('Chat criado com sucesso!');
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Error creating chat:', error);
    }
  };

  const isLoading = createChatMutation.isPending;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg">
            {step === 1 ? 'Informações da Empresa' : 'Revisar Prompt'}
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
                Informações sobre o Negócio (Opcional)
              </Label>
              <Textarea
                id="businessInfo"
                value={businessInfo}
                onChange={(e) => setBusinessInfo(e.target.value)}
                className="h-96 focus-visible:ring-0 focus-visible:border-[#075e54]"
                placeholder="Descreva tudo sobre o negócio da empresa: produtos, serviços, valores, missão, público-alvo, diferenciais, etc... (Deixe em branco se quiser criar o prompt manualmente)"
                disabled={isGeneratingPrompt}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={generatePrompt}
                disabled={isGeneratingPrompt || !formData.companyName.trim()}
                className="flex-1 sm:flex-none bg-[#075e54] hover:bg-[#075e54]/90 h-10 sm:h-11"
              >
                {isGeneratingPrompt ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span className="hidden sm:inline">Gerando Prompt...</span>
                    <span className="sm:hidden">Gerando...</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Gerar Prompt</span>
                    <span className="sm:hidden">Gerar</span>
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
                disabled={isGeneratingPrompt || !formData.companyName.trim()}
                className="flex-1 sm:flex-none h-10 sm:h-11"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Pular para Prompt</span>
                <span className="sm:hidden">Pular</span>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-sm font-medium">
                Prompt Gerado (Você pode editar)
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
                    <span className="hidden sm:inline">Criando Chat...</span>
                    <span className="sm:hidden">Criando...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Criar Chat</span>
                    <span className="sm:hidden">Criar</span>
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
