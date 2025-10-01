import { NextRequest, NextResponse } from 'next/server';
import { ChatService } from '@/lib/services/chat.service';
import { UpdateChatRequest } from '@/lib/types';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// DELETE - Excluir um chat específico
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do chat é obrigatório' },
        { status: 400 }
      );
    }

    // Verify that the chat belongs to the authenticated user
    const chat = await ChatService.getChatById(id);
    if (!chat || chat.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Chat não encontrado ou não autorizado' },
        { status: 404 }
      );
    }
    
    await ChatService.deleteChat(id);
    return NextResponse.json({ message: 'Chat excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir chat:', error);
    
    if (error instanceof Error && error.message === 'Chat not found') {
      return NextResponse.json(
        { error: 'Chat não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar um chat específico
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body: UpdateChatRequest = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do chat é obrigatório' },
        { status: 400 }
      );
    }

    // Verify that the chat belongs to the authenticated user
    const chat = await ChatService.getChatById(id);
    if (!chat || chat.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Chat não encontrado ou não autorizado' },
        { status: 404 }
      );
    }
    
    if (!body.companyName || !body.prompt) {
      return NextResponse.json(
        { error: 'Nome da empresa e prompt são obrigatórios' },
        { status: 400 }
      );
    }
    
    const updatedChat = await ChatService.updateChat(id, body);
    return NextResponse.json(updatedChat);
  } catch (error) {
    console.error('Erro ao atualizar chat:', error);
    
    if (error instanceof Error && error.message === 'Chat not found') {
      return NextResponse.json(
        { error: 'Chat não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
