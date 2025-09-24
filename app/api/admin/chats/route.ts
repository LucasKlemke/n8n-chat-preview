import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Listar todos os chats
export async function GET() {
  try {
    const chats = await prisma.chat.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
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
    const { companyName, prompt } = await request.json();
    
    if (!companyName || !prompt) {
      return NextResponse.json(
        { error: 'Nome da empresa e prompt são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Verificar se já existe um chat para esta empresa
    const existingChat = await prisma.chat.findFirst({
      where: {
        companyName: companyName
      }
    });
    
    if (existingChat) {
      return NextResponse.json(
        { error: 'Já existe um chat para esta empresa' },
        { status: 409 }
      );
    }
    
    const chat = await prisma.chat.create({
      data: {
        companyName,
        prompt
      }
    });
    
    return NextResponse.json(chat, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar chat:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
