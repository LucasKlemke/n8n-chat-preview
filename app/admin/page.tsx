'use client';

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

  const copyLink = (companyName: string) => {
    const link = `${window.location.origin}/${encodeURIComponent(companyName)}`;
    navigator.clipboard.writeText(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Administração
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Digite o código de administração para acessar
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700">
                  Código de Administração
                </label>
                <div className="mt-1">
                  <input
                    id="adminCode"
                    type="password"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Digite o código"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel de Administração</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gerencie os chats personalizados para empresas
          </p>
        </div>

        {/* Formulário para criar novo chat */}
        <div className="bg-white shadow sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Criar Novo Chat
            </h3>
            <form onSubmit={handleCreateChat} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Nome da Empresa
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Ex: Empresa ABC"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
                  Prompt Personalizado
                </label>
                <textarea
                  id="prompt"
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  required
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Digite o prompt personalizado para esta empresa..."
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? 'Criando...' : 'Criar Chat'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Lista de chats existentes */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Chats Existentes
            </h3>
            {isLoading ? (
              <p className="text-gray-500">Carregando...</p>
            ) : chats.length === 0 ? (
              <p className="text-gray-500">Nenhum chat criado ainda.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {chats.map((chat) => (
                  <li key={chat.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">{chat.companyName}</h4>
                        <p className="text-sm text-gray-600 mt-1">{chat.prompt}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          Criado em: {new Date(chat.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="ml-4 flex space-x-2">
                        <button
                          onClick={() => copyLink(chat.companyName)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Copiar Link
                        </button>
                        <button
                          onClick={() => handleDeleteChat(chat.id)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
