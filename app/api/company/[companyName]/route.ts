import { NextRequest, NextResponse } from 'next/server';
import { ChatService } from '@/lib/services/chat.service';

// GET - Buscar informações do chat da empresa
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ companyName: string }> }
) {
  try {
    const { companyName } = await params;
    
    if (!companyName) {
      return NextResponse.json(
        { error: 'Nome da empresa é obrigatório' },
        { status: 400 }
      );
    }
    
    const decodedCompanyName = decodeURIComponent(companyName);
    const chat = await ChatService.getChatByCompanyName(decodedCompanyName);
    
    if (!chat) {
      return NextResponse.json(
        { error: 'Chat não encontrado para esta empresa' },
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
