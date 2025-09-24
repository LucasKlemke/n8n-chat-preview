'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, Loader2, CheckCheck } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatInfo {
  id: string;
  companyName: string;
  prompt: string;
}

export default function Chat() {
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [input, setInput] = useState('');
  const params = useParams();
  const companyName = decodeURIComponent(params.companyName as string);

  const { messages, sendMessage, status } = useChat({transport: new DefaultChatTransport ( {
    body: {
      companyName: companyName
    }
  })
  })



  useEffect(() => {
    const loadChatInfo = async () => {
      try {
        const response = await fetch(`/api/company/${encodeURIComponent(companyName)}`);
        if (response.ok) {
          const data = await response.json();
          setChatInfo(data);
        } else if (response.status === 404) {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Erro ao carregar informações do chat:', error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (companyName) {
      loadChatInfo();
    }
  }, [companyName]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className='w-10 h-10 animate-spin' />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 border-2 border-muted-foreground rounded-full"></div>
            </div>
            <CardTitle className="text-2xl">Chat não encontrado</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Não foi possível encontrar um chat configurado para a empresa &quot;{companyName}&quot;.
            </p>
            <Badge variant="outline" className="text-xs">
              {companyName}
            </Badge>
            <p className="text-sm text-muted-foreground">
              Verifique se o link está correto ou entre em contato com o administrador.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen max-h-screen flex flex-col bg-[#e5ddd5] overflow-hidden">
      {/* WhatsApp-style Header - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#075e54] px-4 py-2 md:py-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                <span className="text-sm md:text-base font-medium text-gray-600">
                  {chatInfo?.companyName?.charAt(0).toUpperCase()}
                </span>
            </div>
            <div className="flex-1">
              <h1 className="text-base md:text-lg font-medium text-white">
                {chatInfo?.companyName}
              </h1>
              {status === 'submitted' ? (
                <p className="text-xs md:text-sm text-gray-200">
                  digitando...
                </p>
              ) : (
                <p className="text-xs md:text-sm text-gray-200">
                  Online
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-[#e5ddd5] px-3 md:px-4 py-2 md:py-4 space-y-2 pt-16 md:pt-20 pb-16 md:pb-20">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4 max-w-md mx-auto">
             

            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} pb-1`}
              >
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <div
                    className={`px-3 py-2 rounded-lg shadow-sm relative ${
                      message.role === 'user'
                        ? 'bg-[#dcf8c6] text-gray-800 rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {message.parts.map((part, i) => {
                      if (part.type === 'text') {
                        return (
                          <div key={`${message.id}-${i}`} className="whitespace-pre-wrap text-sm leading-relaxed">
                            <Markdown remarkPlugins={[remarkGfm]}>{part.text}</Markdown>
                          </div>
                        );
                      }
                      return null;
                    })}
                    <div className={`text-xs text-gray-500 flex items-center justify-end space-x-1`}>
                      <span>14:42</span>
                      {message.role === 'user' && (
                        <div className="flex space-x-1">
                          <CheckCheck className='size-3 text-blue-500'/>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {status === 'submitted' && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-[80%]">
              
              <div className="bg-white text-gray-800 px-3 py-2 rounded-lg rounded-bl-none shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm text-gray-500 ml-2">Digitando...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#f0f0f0] px-3 md:px-4 py-2 border-t border-gray-200 safe-area-inset-bottom">
        <form
          onSubmit={e => {
            e.preventDefault();
            if (input.trim()) {
              sendMessage({ text: input });
              setInput('');
            }
          }}
          className="flex items-end space-x-2"
        >
          <div className="flex-1 relative">
            <Input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="w-full rounded-full bg-white border border-gray-300 px-3 md:px-4 py-2 text-sm placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-[#075e54] min-h-[36px] md:min-h-[40px] max-h-[120px] resize-none"
              disabled={false}
            />
          </div>
          <Button
            type="submit"
            disabled={!input.trim()}
            size="icon"
            className="rounded-full w-9 h-9 md:w-10 md:h-10 bg-[#075e54] hover:bg-[#075e54]/90 disabled:bg-gray-300 disabled:text-gray-500 shadow-sm flex-shrink-0"
          >
            <ArrowUp className="w-4 h-4 md:w-5 md:h-5 text-white"/>
          </Button>
        </form>
      </div>
    </div>
  );
}