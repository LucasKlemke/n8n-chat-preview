'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Chat {
  id: string;
  companyName: string;
  prompt: string;
  createdAt: Date;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    prompt: ''
  });
  const [editingChat, setEditingChat] = useState<Chat | null>(null);
  const [editFormData, setEditFormData] = useState({
    companyName: '',
    prompt: ''
  });

  const checkAdminCode = (code: string) => {
    return code === 'admin123'; // Código fixo no código
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkAdminCode(adminCode)) {
      setIsAuthenticated(true);
      loadChats();
    } else {
      alert('Código de administração inválido!');
    }
  };

  const loadChats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/chats');
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error('Erro ao carregar chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setFormData({ companyName: '', prompt: '' });
        loadChats();
      } else {
        alert('Erro ao criar chat!');
      }
    } catch (error) {
      console.error('Erro ao criar chat:', error);
      alert('Erro ao criar chat!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    if (!confirm('Tem certeza que deseja excluir este chat?')) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/chats/${chatId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        loadChats();
      } else {
        alert('Erro ao excluir chat!');
      }
    } catch (error) {
      console.error('Erro ao excluir chat:', error);
      alert('Erro ao excluir chat!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditChat = (chat: Chat) => {
    setEditingChat(chat);
    setEditFormData({
      companyName: chat.companyName,
      prompt: chat.prompt
    });
  };

  const handleUpdateChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChat) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/chats/${editingChat.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });
      
      if (response.ok) {
        setEditingChat(null);
        setEditFormData({ companyName: '', prompt: '' });
        loadChats();
      } else {
        alert('Erro ao atualizar chat!');
      }
    } catch (error) {
      console.error('Erro ao atualizar chat:', error);
      alert('Erro ao atualizar chat!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingChat(null);
    setEditFormData({ companyName: '', prompt: '' });
  };

  const copyLink = (companyName: string) => {
    const link = `${window.location.origin}/${encodeURIComponent(companyName)}`;
    navigator.clipboard.writeText(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-[#075e54] rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 text-white text-xl font-bold">A</div>
            </div>
            <CardTitle className="text-2xl">Painel de Administração</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
        <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminCode" className="text-sm font-medium">
            Código de Administração
          </Label>
          <Input
            id="adminCode"
            type="password"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            required
            placeholder="Digite o código"
                  className="focus-visible:ring-0 focus-visible:border-[#075e54]"
          />
              </div>
              <Button type="submit" className='w-full bg-[#075e54] hover:bg-[#075e54]/90'>
            Entrar
          </Button>
        </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header similar to chat page */}
      <div className="bg-[#075e54] px-3 sm:px-4 py-3 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10 text-xs sm:text-sm">
              <Link href="/">
                <span className="hidden sm:inline">← Voltar</span>
                <span className="sm:hidden">←</span>
              </Link>
            </Button>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm sm:text-lg font-medium text-white">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm sm:text-lg font-medium text-white truncate">Painel de Administração</h1>
              <p className="text-xs sm:text-sm text-gray-200 hidden sm:block">
                Gerencie os chats personalizados
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">

        {/* Formulário para criar novo chat */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg">Criar Novo Chat</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handleCreateChat} className="space-y-4 sm:space-y-6">
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

        {/* Lista de chats existentes */}
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
            ) : chats.length === 0 ? (
              <div className="text-center py-8 sm:py-12 px-4">
                <div className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm sm:text-base font-medium">Nenhum chat criado</h3>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">Comece criando seu primeiro chat personalizado.</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {chats && chats.length > 0 && chats?.map((chat) => (
                  <Card key={chat.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      {editingChat?.id === chat.id ? (
                        /* Formulário de edição */
                        <form onSubmit={handleUpdateChat} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`edit-companyName-${chat.id}`} className="text-sm font-medium">
                              Nome da Empresa
                            </Label>
                            <Input
                              id={`edit-companyName-${chat.id}`}
                              value={editFormData.companyName}
                              onChange={(e) => setEditFormData({ ...editFormData, companyName: e.target.value })}
                              required
                              className="focus-visible:ring-0 focus-visible:border-[#075e54] h-10 sm:h-11"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`edit-prompt-${chat.id}`} className="text-sm font-medium">
                              Prompt Personalizado
                            </Label>
                            <textarea
                              id={`edit-prompt-${chat.id}`}
                              value={editFormData.prompt}
                              onChange={(e) => setEditFormData({ ...editFormData, prompt: e.target.value })}
                              required
                              rows={3}
                              className="w-full border border-input rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-0 focus-visible:border-[#075e54] resize-none min-h-[80px] sm:min-h-[100px]"
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                            <Button
                              type="submit"
                              disabled={isLoading}
                              className="bg-[#075e54] hover:bg-[#075e54]/90 h-10 sm:h-11 order-2 sm:order-1"
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  <span className="hidden sm:inline">Salvando...</span>
                                  <span className="sm:hidden">...</span>
                                </>
                              ) : (
                                <>
                                  <span className="hidden sm:inline">Salvar</span>
                                  <span className="sm:hidden">Salvar</span>
                                </>
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleCancelEdit}
                              disabled={isLoading}
                              className="h-10 sm:h-11 order-1 sm:order-2"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </form>
                    ) : (
                      /* Visualização normal */
                      <>
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
                              onClick={() => copyLink(chat.companyName)}
                              className="text-[#075e54] border-[#075e54]/20 hover:bg-[#075e54]/10 justify-start h-9"
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
                                onClick={() => handleEditChat(chat)}
                                className="text-blue-600 border-blue-200 hover:bg-blue-50 flex-1 h-9"
                              >
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Editar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteChat(chat.id)}
                                className="text-red-600 border-red-200 hover:bg-red-50 flex-1 h-9"
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
                          onClick={() => copyLink(chat.companyName)}
                              className="text-[#075e54] border-[#075e54]/20 hover:bg-[#075e54]/10"
                        >
                              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                          Copiar Link
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditChat(chat)}
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                          onClick={() => handleDeleteChat(chat.id)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                          Excluir
                            </Button>
                      </div>
                    </div>
                      </>
                    )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
