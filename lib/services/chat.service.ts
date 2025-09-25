import { prisma } from '@/lib/prisma';
import { Chat, CreateChatRequest, UpdateChatRequest } from '@/lib/types';

export class ChatService {
  static async getAllChats(): Promise<Chat[]> {
    try {
      const chats = await prisma.chat.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      return chats;
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw new Error('Failed to fetch chats');
    }
  }

  static async getChatById(id: string): Promise<Chat | null> {
    try {
      const chat = await prisma.chat.findUnique({
        where: { id }
      });
      return chat;
    } catch (error) {
      console.error('Error fetching chat by id:', error);
      throw new Error('Failed to fetch chat');
    }
  }

  static async getChatByCompanyName(companyName: string): Promise<Chat | null> {
    try {
      const chat = await prisma.chat.findFirst({
        where: {
          companyName: {
            equals: companyName,
            mode: 'insensitive'
          }
        }
      });
      return chat;
    } catch (error) {
      console.error('Error fetching chat by company name:', error);
      throw new Error('Failed to fetch chat by company name');
    }
  }

  static async createChat(data: CreateChatRequest): Promise<Chat> {
    try {
      // Check if chat already exists for this company
      const existingChat = await this.getChatByCompanyName(data.companyName);
      if (existingChat) {
        throw new Error('Chat already exists for this company');
      }

      const chat = await prisma.chat.create({
        data: {
          companyName: data.companyName,
          prompt: data.prompt
        }
      });
      return chat;
    } catch (error) {
      console.error('Error creating chat:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create chat');
    }
  }

  static async updateChat(id: string, data: UpdateChatRequest): Promise<Chat> {
    try {
      // Check if chat exists
      const existingChat = await this.getChatById(id);
      if (!existingChat) {
        throw new Error('Chat not found');
      }

      const updatedChat = await prisma.chat.update({
        where: { id },
        data: {
          companyName: data.companyName,
          prompt: data.prompt
        }
      });
      return updatedChat;
    } catch (error) {
      console.error('Error updating chat:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update chat');
    }
  }

  static async deleteChat(id: string): Promise<void> {
    try {
      // Check if chat exists
      const existingChat = await this.getChatById(id);
      if (!existingChat) {
        throw new Error('Chat not found');
      }

      await prisma.chat.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to delete chat');
    }
  }

  static async validateAdminCode(code: string): Promise<boolean> {
    // In a real application, this should be stored in environment variables or database
    const validCode = process.env.ADMIN_CODE || 'admin123';
    return code === validCode;
  }
}
