'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp } from 'lucide-react';

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
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="space-y-2 text-center">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <p className="text-muted-foreground">Carregando...</p>
          </CardContent>
        </Card>
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
    <div className="h-screen flex flex-col bg-background">
      {/* Header - Compact */}
      <div className="flex-shrink-0 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-primary-foreground rounded-full"></div>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {chatInfo?.companyName}
              </h1>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-muted px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <div className="w-6 h-6 border-2 border-primary rounded-full"></div>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-foreground">Olá! Como posso ajudá-lo hoje?</p>
                <p className="text-sm text-muted-foreground">Digite sua mensagem abaixo para começar a conversar.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] sm:max-w-md px-4 py-2 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted text-foreground rounded-bl-md'
                  }`}
                >
                  {message.parts.map((part, i) => {
                    if (part.type === 'text') {
                      return (
                        <div key={`${message.id}-${i}`} className="whitespace-pre-wrap text-sm leading-relaxed">
                          {part.text}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {status === 'submitted' && (
          <div className="flex justify-start max-w-4xl mx-auto">
            <div className="bg-background text-foreground px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm text-muted-foreground ml-2">Digitando...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form - Fixed at bottom */}
      <div className="flex-shrink-0 bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={e => {
              e.preventDefault();
              if (input.trim()) {
                sendMessage({ text: input });
                setInput('');
              }
            }}
            className="flex items-center space-x-2"
          >
            <div className="flex-1 relative">
              <Input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="w-full rounded-full bg-muted/50 border-0 px-6 py-3 text-sm md:text-base placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background shadow-sm"
                disabled={false}
              />
            </div>
            <Button
              type="submit"
              disabled={!input.trim()}
              size="icon"
              className="rounded-full w-10 h-10 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground shadow-sm"
            >
              <ArrowUp className="w-4 h-4"/>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}