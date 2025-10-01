export interface Chat {
  id: string;
  companyName: string;
  prompt: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    nome: string;
    email: string;
  };
  _count?: {
    messages: number;
  };
}

export interface Message {
  id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface CreateChatRequest {
  companyName: string;
  prompt: string;
}

export interface UpdateChatRequest {
  companyName: string;
  prompt: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ChatFormData {
  companyName: string;
  prompt: string;
}

export interface AdminAuth {
  isAuthenticated: boolean;
  adminCode: string;
}

// React Query key factories
export const queryKeys = {
  chats: {
    all: ['chats'] as const,
    lists: () => [...queryKeys.chats.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.chats.lists(), { filters }] as const,
    details: () => [...queryKeys.chats.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.chats.details(), id] as const,
    company: (companyName: string) => [...queryKeys.chats.all, 'company', companyName] as const,
  },
} as const;
