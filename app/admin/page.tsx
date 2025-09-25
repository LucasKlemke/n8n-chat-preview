'use client';

import { useState } from 'react';
import { AdminLogin } from '@/components/admin/admin-login';
import { AdminHeader } from '@/components/admin/admin-header';
import { CreateChatForm } from '@/components/admin/create-chat-form';
import { ChatList } from '@/components/admin/chat-list';
import { toast } from 'sonner';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (code: string) => {
    // In a real application, this should validate against server
    if (code === 'admin123') {
      setIsAuthenticated(true);
      toast.success('Login realizado com sucesso!');
    } else {
      toast.error('Código de administração inválido!');
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
        <CreateChatForm />
        <ChatList />
      </div>
    </div>
  );
}
