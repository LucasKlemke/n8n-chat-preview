import { NextRequest, NextResponse } from 'next/server';
import { ChatService } from '@/lib/services/chat.service';

// GET - Buscar informações do chat da empresa para um usuário específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; companyName: string }> }
) {
  try {
    const { userId, companyName } = await params;
    
    if (!userId || !companyName) {
      return NextResponse.json(
        { error: 'ID do usuário e nome da empresa são obrigatórios' },
        { status: 400 }
      );
    }
    
    const decodedCompanyName = decodeURIComponent(companyName);
    
    // Buscar chat específico do usuário
    const chats = await ChatService.getAllChats(userId);
    const chat = chats.find(c => c.companyName === decodedCompanyName);
    
    if (!chat) {
      return NextResponse.json(
        { error: 'Chat não encontrado para esta empresa e usuário' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(chat);
  } catch (error) {
    console.error('Erro ao buscar chat da empresa:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
