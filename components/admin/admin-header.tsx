'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AdminHeader() {
  return (
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
  );
}
