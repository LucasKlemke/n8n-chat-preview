'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogoutButton } from '@/components/auth/logout-button';

export function AdminHeader() {
  const { data: session } = useSession();

  return (
    <div className="bg-[#075e54] px-3 sm:px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">

            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm sm:text-lg font-medium text-white">
                {session?.user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm sm:text-lg font-medium text-white truncate">Painel de Administração</h1>
              <p className="text-xs sm:text-sm text-gray-200 hidden sm:block">
                Olá, {session?.user?.name || 'Usuário'}
              </p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
