'use client';

import { useParams } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
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

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      body: {
        companyName: companyName
      }
    })
  });

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

  const handleSendMessage = (text: string) => {
    sendMessage({ text });
  };

  return (
    <div className="h-screen max-h-screen flex flex-col bg-[#e5ddd5] overflow-hidden">
      <ChatHeader chat={chatInfo} status={status} />

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
        
        {status === 'submitted'  && <TypingIndicator withLabel={false} />}
      </div>

      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={status === 'submitted' || status === 'streaming'} 
      />
    </div>
  );
}