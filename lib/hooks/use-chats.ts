'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, Chat, CreateChatRequest, UpdateChatRequest } from '@/lib/types';
import { toast } from 'sonner';

// API functions
async function fetchChats(): Promise<Chat[]> {
  const response = await fetch('/api/admin/chats');
  if (!response.ok) {
    throw new Error('Failed to fetch chats');
  }
  return response.json();
}

async function fetchChatByCompany(companyName: string, userId?: string): Promise<Chat> {
  const url = userId 
    ? `/api/user/${userId}/chat/${encodeURIComponent(companyName)}`
    : `/api/company/${encodeURIComponent(companyName)}`;
    
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Chat not found');
    }
    throw new Error('Failed to fetch chat');
  }
  return response.json();
}

async function createChat(data: CreateChatRequest): Promise<Chat> {
  const response = await fetch('/api/admin/chats', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create chat');
  }
  return response.json();
}

async function updateChat(id: string, data: UpdateChatRequest): Promise<Chat> {
  const response = await fetch(`/api/admin/chats/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update chat');
  }
  return response.json();
}

async function deleteChat(id: string): Promise<void> {
  const response = await fetch(`/api/admin/chats/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete chat');
  }
}

// React Query hooks
export function useChats() {
  return useQuery({
    queryKey: queryKeys.chats.lists(),
    queryFn: fetchChats,
  });
}

export function useChatByCompany(companyName: string, userId?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.chats.company(companyName),
    queryFn: () => fetchChatByCompany(companyName, userId),
    enabled: enabled && !!companyName,
  });
}

export function useCreateChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.lists() });
      toast.success('Chat criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar chat');
    },
  });
}

export function useUpdateChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateChatRequest }) =>
      updateChat(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.lists() });
      toast.success('Chat atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar chat');
    },
  });
}

export function useDeleteChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.lists() });
      toast.success('Chat excluído com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao excluir chat');
    },
  });
}
