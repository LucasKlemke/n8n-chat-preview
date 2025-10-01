import { openai } from '@ai-sdk/openai';
import {
  UIMessage,
  convertToModelMessages,
  generateText,
} from 'ai';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { messages, companyName, userId }: { messages: UIMessage[], companyName?: string, userId?: string } = await req.json();

  let systemPrompt = "Você é um assistente útil e prestativo.";
  let chatId: string | null = null;

  // Se há um nome de empresa, buscar o prompt personalizado
  if (companyName) {
    try {
      const chat = await prisma.chat.findFirst({
        where: {
          companyName: companyName,
          ...(userId && { userId: userId }) // Filtrar por userId se fornecido
        }
      });
      
      if (chat) {
        systemPrompt = chat.prompt;
        chatId = chat.id;
        
        // Salvar a última mensagem do usuário no banco
        const lastUserMessage = messages[messages.length - 1];
        if (lastUserMessage && lastUserMessage.role === 'user') {
          await prisma.message.create({
            data: {
              chatId: chat.id,
              role: 'user',
              content: typeof lastUserMessage.parts[0] === 'object' && 'text' in lastUserMessage.parts[0] 
                ? lastUserMessage.parts[0].text 
                : String(lastUserMessage.parts[0])
            }
          });
        }
      }
    } catch (error) {
      console.error('Erro ao buscar chat da empresa:', error);
    }
  }

  const {text} = await generateText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    messages: convertToModelMessages(messages),
  });

  // Salvar a resposta do assistente no banco
  if (chatId && text) {
    try {
      await prisma.message.create({
        data: {
          chatId: chatId,
          role: 'assistant',
          content: text
        }
      });
    } catch (error) {
      console.error('Erro ao salvar mensagem do assistente:', error);
    }
  }

  return Response.json({
    data: {
      role: 'assistant',
      content: text
    }
  });
}