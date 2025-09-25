'use client';

import { Chat } from '@/lib/types';

interface ChatHeaderProps {
  chat: Chat;
  status: 'idle' | 'submitted' | 'error' | 'streaming' | 'ready';
}

export function ChatHeader({ chat, status }: ChatHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#075e54] px-4 py-2 md:py-3 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            <span className="text-sm md:text-base font-medium text-gray-600">
              {chat.companyName?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-base md:text-lg font-medium text-white">
              {chat.companyName}
            </h1>
            {status === 'submitted' || status === 'streaming' ? (
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
  );
}
