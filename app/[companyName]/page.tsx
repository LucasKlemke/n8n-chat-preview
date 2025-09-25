'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { UIMessage } from 'ai';
import { Loader2 } from 'lucide-react';
import { useChatByCompany } from '@/lib/hooks/use-chats';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatMessage } from '@/components/chat/chat-message';
import { ChatInput } from '@/components/chat/chat-input';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import { ChatNotFound } from '@/components/chat/chat-not-found';

export default function Chat() {
  const params = useParams();
  const companyName = decodeURIComponent(params.companyName as string);

  const { data: chatInfo, isLoading, error } = useChatByCompany(companyName);

  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className='w-10 h-10 animate-spin' />
      </div>
    );
  }

  if (error || !chatInfo) {
    return <ChatNotFound companyName={companyName} />;
  }

  const handleSendMessage = async (text: string) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Adicionar mensagem do usuário
    const userMessage: UIMessage = {
      id: Date.now().toString(),
      role: 'user',
      parts: [{ type: 'text', text }]
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
          companyName: companyName
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Adicionar resposta do assistente
        const assistantMessage: UIMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          parts: [{ type: 'text', text: result.data.content }]
        };
        
        setMessages([...newMessages, assistantMessage]);
      } else {
        console.error('Erro na resposta:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen max-h-screen flex flex-col bg-[#e5ddd5] overflow-hidden">
      <ChatHeader chat={chatInfo} status={isSubmitting ? 'submitted' : 'idle'} />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-[#e5ddd5] px-3 md:px-4 py-2 md:py-4 space-y-2 pt-16 md:pt-20 pb-16 md:pb-20">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4 max-w-md mx-auto">
              {/* Welcome message area - can be customized */}
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        )}
        
        {isSubmitting && <TypingIndicator withLabel={false} />}
      </div>

      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={isSubmitting} 
      />
    </div>
  );
}