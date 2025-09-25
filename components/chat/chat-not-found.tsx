'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ChatNotFoundProps {
  companyName: string;
}

export function ChatNotFound({ companyName }: ChatNotFoundProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 border-2 border-muted-foreground rounded-full"></div>
          </div>
          <CardTitle className="text-2xl">Chat não encontrado</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Não foi possível encontrar um chat configurado para a empresa &quot;{companyName}&quot;.
          </p>
          <Badge variant="outline" className="text-xs">
            {companyName}
          </Badge>
          <p className="text-sm text-muted-foreground">
            Verifique se o link está correto ou entre em contato com o administrador.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
