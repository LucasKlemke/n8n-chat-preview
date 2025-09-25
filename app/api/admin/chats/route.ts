import { NextRequest, NextResponse } from 'next/server';
import { ChatService } from '@/lib/services/chat.service';
import { CreateChatRequest } from '@/lib/types';

// GET - Listar todos os chats
export async function GET() {
  try {
    const chats = await ChatService.getAllChats();
    return NextResponse.json(chats);
  } catch (error) {
    console.error('Erro ao buscar chats:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar um novo chat
export async function POST(request: NextRequest) {
  try {
    const body: CreateChatRequest = await request.json();
    
    if (!body.companyName || !body.prompt) {
      return NextResponse.json(
        { error: 'Nome da empresa e prompt são obrigatórios' },
        { status: 400 }
      );
    }
    
    const chat = await ChatService.createChat(body);
    return NextResponse.json(chat, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar chat:', error);
    
    if (error instanceof Error && error.message === 'Chat already exists for this company') {
      return NextResponse.json(
        { error: 'Já existe um chat para esta empresa' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
