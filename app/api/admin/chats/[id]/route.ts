import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE - Excluir um chat específico
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do chat é obrigatório' },
        { status: 400 }
      );
    }
    
    // Verificar se o chat existe
    const existingChat = await prisma.chat.findUnique({
      where: { id }
    });
    
    if (!existingChat) {
      return NextResponse.json(
        { error: 'Chat não encontrado' },
        { status: 404 }
      );
    }
    
    // Excluir o chat (as mensagens são excluídas automaticamente por causa do onDelete: Cascade)
    await prisma.chat.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Chat excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir chat:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar um chat específico
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { companyName, prompt } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do chat é obrigatório' },
        { status: 400 }
      );
    }
    
    if (!companyName || !prompt) {
      return NextResponse.json(
        { error: 'Nome da empresa e prompt são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Verificar se o chat existe
    const existingChat = await prisma.chat.findUnique({
      where: { id }
    });
    
    if (!existingChat) {
      return NextResponse.json(
        { error: 'Chat não encontrado' },
        { status: 404 }
      );
    }
    
    const updatedChat = await prisma.chat.update({
      where: { id },
      data: {
        companyName,
        prompt
      }
    });
    
    return NextResponse.json(updatedChat);
  } catch (error) {
    console.error('Erro ao atualizar chat:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
