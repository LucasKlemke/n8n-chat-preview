'use server';

import { ChatService } from '@/lib/services/chat.service';
import { CreateChatRequest, UpdateChatRequest, ApiResponse, Chat } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getAllChatsAction(): Promise<ApiResponse<Chat[]>> {
  try {
    const chats = await ChatService.getAllChats();
    return { data: chats };
  } catch (error) {
    console.error('Error in getAllChatsAction:', error);
    return { error: error instanceof Error ? error.message : 'Failed to fetch chats' };
  }
}

export async function getChatByCompanyNameAction(companyName: string): Promise<ApiResponse<Chat>> {
  try {
    const chat = await ChatService.getChatByCompanyName(companyName);
    if (!chat) {
      return { error: 'Chat not found' };
    }
    return { data: chat };
  } catch (error) {
    console.error('Error in getChatByCompanyNameAction:', error);
    return { error: error instanceof Error ? error.message : 'Failed to fetch chat' };
  }
}

export async function createChatAction(data: CreateChatRequest): Promise<ApiResponse<Chat>> {
  try {
    const chat = await ChatService.createChat(data);
    revalidatePath('/admin');
    return { data: chat, message: 'Chat created successfully' };
  } catch (error) {
    console.error('Error in createChatAction:', error);
    return { error: error instanceof Error ? error.message : 'Failed to create chat' };
  }
}

export async function updateChatAction(id: string, data: UpdateChatRequest): Promise<ApiResponse<Chat>> {
  try {
    const chat = await ChatService.updateChat(id, data);
    revalidatePath('/admin');
    return { data: chat, message: 'Chat updated successfully' };
  } catch (error) {
    console.error('Error in updateChatAction:', error);
    return { error: error instanceof Error ? error.message : 'Failed to update chat' };
  }
}

export async function deleteChatAction(id: string): Promise<ApiResponse<void>> {
  try {
    await ChatService.deleteChat(id);
    revalidatePath('/admin');
    return { message: 'Chat deleted successfully' };
  } catch (error) {
    console.error('Error in deleteChatAction:', error);
    return { error: error instanceof Error ? error.message : 'Failed to delete chat' };
  }
}

export async function validateAdminCodeAction(code: string): Promise<ApiResponse<boolean>> {
  try {
    const isValid = await ChatService.validateAdminCode(code);
    return { data: isValid };
  } catch (error) {
    console.error('Error in validateAdminCodeAction:', error);
    return { error: 'Failed to validate admin code' };
  }
}
