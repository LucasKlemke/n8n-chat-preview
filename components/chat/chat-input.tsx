'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUp } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#f0f0f0] px-3 md:px-4 py-2 border-t border-gray-200 safe-area-inset-bottom">
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="w-full rounded-full bg-white border border-gray-300 px-3 md:px-4 py-2 text-sm placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-[#075e54] min-h-[36px] md:min-h-[40px] max-h-[120px] resize-none"
            disabled={disabled}
          />
        </div>
        <Button
          type="submit"
          disabled={!input.trim() || disabled}
          size="icon"
          className="rounded-full w-9 h-9 md:w-10 md:h-10 bg-[#075e54] hover:bg-[#075e54]/90 disabled:bg-gray-300 disabled:text-gray-500 shadow-sm flex-shrink-0"
        >
          <ArrowUp className="w-4 h-4 md:w-5 md:h-5 text-white"/>
        </Button>
      </form>
    </div>
  );
}
