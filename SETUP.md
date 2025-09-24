# Configuração do Projeto - My AI App

Este projeto é uma aplicação de chat AI personalizada para empresas, construída com Next.js, Prisma ORM e Supabase PostgreSQL.

## Funcionalidades

- **Sem autenticação**: Acesso direto aos chats
- **Painel administrativo**: Criação de chats personalizados para empresas
- **Prompts personalizados**: Cada empresa tem seu próprio prompt de IA
- **Histórico de mensagens**: Todas as conversas são salvas no banco de dados
- **Links únicos**: Cada empresa acessa via URL com seu nome

## Configuração do Supabase

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Escolha sua organização
5. Configure:
   - **Name**: my-ai-app (ou nome de sua preferência)
   - **Database Password**: Crie uma senha forte
   - **Region**: Escolha a região mais próxima
6. Clique em "Create new project"

### 2. Obter URL de Conexão

1. No dashboard do seu projeto, vá para **Settings** > **Database**
2. Na seção **Connection string**, encontre a **URI**
3. Copie a URI que será similar a:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

### 3. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.local` para `.env`:
   ```bash
   cp .env.local .env
   ```

2. Edite o arquivo `.env` e substitua os valores:
   ```env
   # Supabase Database URL
   DATABASE_URL="postgresql://postgres:[SUA-SENHA]@db.[SEU-PROJECT-REF].supabase.co:5432/postgres?schema=public"

   # OpenAI API Key
   OPENAI_API_KEY="sua_openai_api_key_aqui"

   # Código de administração (você pode alterar)
   ADMIN_CODE="admin123"
   ```

### 4. Executar Migrações do Banco

```bash
# Gerar cliente Prisma
npx prisma generate

# Aplicar migrações
npx prisma db push
```

## Instalação e Execução

### 1. Instalar Dependências

```bash
pnpm install
```

### 2. Executar em Desenvolvimento

```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`

## Estrutura da Aplicação

### Banco de Dados

O projeto usa duas tabelas principais:

- **chats**: Armazena informações das empresas e seus prompts personalizados
- **messages**: Armazena todas as mensagens trocadas nos chats

### Rotas Principais

- `/admin` - Painel de administração (requer código especial)
- `/[companyName]` - Chat específico da empresa
- `/api/chat` - Endpoint para conversas com IA
- `/api/admin/chats` - CRUD de chats para administração
- `/api/company/[companyName]` - Buscar informações da empresa

## Uso da Aplicação

### 1. Acessar Painel Administrativo

1. Vá para `http://localhost:3000/admin`
2. Digite o código de administração (padrão: `admin123`)
3. Crie novos chats para empresas

### 2. Criar Chat para Empresa

1. No painel admin, preencha:
   - **Nome da Empresa**: Nome que aparecerá na URL
   - **Prompt Personalizado**: Instruções específicas para a IA
2. Clique em "Criar Chat"
3. Copie o link gerado para a empresa

### 3. Acessar Chat da Empresa

- A URL será: `http://localhost:3000/[nome-da-empresa]`
- Exemplo: `http://localhost:3000/Empresa%20ABC`

## Estrutura de Arquivos

```
my-ai-app/
├── app/
│   ├── admin/                 # Painel administrativo
│   ├── api/
│   │   ├── chat/             # API de chat com IA
│   │   ├── admin/chats/      # CRUD de chats
│   │   └── company/          # API para buscar empresa
│   └── [companyName]/        # Página do chat da empresa
├── lib/
│   ├── prisma.ts            # Configuração Prisma
│   └── useCompanyChat.ts    # Hook customizado para chat
├── prisma/
│   └── schema.prisma        # Schema do banco de dados
├── .env.local               # Exemplo de variáveis de ambiente
└── .env                     # Variáveis de ambiente (criar)
```

## Desenvolvimento

### Comandos Úteis

```bash
# Ver banco de dados no navegador
npx prisma studio

# Reset do banco (cuidado!)
npx prisma db push --force-reset

# Verificar status do banco
npx prisma db pull
```

## Troubleshooting

### Erro de Conexão com Banco

1. Verifique se a `DATABASE_URL` está correta
2. Confirme se a senha do banco está correta
3. Teste a conexão:
   ```bash
   npx prisma db pull
   ```

### Erro "Table doesn't exist"

Execute as migrações:
```bash
npx prisma db push
```

### OpenAI API não funciona

1. Verifique se `OPENAI_API_KEY` está configurada
2. Confirme se a chave tem créditos disponíveis
3. Teste a chave diretamente na API da OpenAI
