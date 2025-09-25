'use client';

import { UIMessage } from 'ai';
import { CheckCheck } from 'lucide-react';
import { Markdown } from '../markdown';

interface ChatMessageProps {
  message: UIMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
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
                          <div key={`${message.id}-${i}`} className=" text-sm ">
                            <Markdown>{part.text}</Markdown>
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
  );
}
