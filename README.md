<div align="center">
  <img alt="Feedback AI Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" width="1200" height="475" />
</div>

# Feedback AI Assistant

O **Feedback AI Assistant** é uma aplicação inovadora projetada para ajudar líderes, gestores e colegas de equipe a criar feedbacks construtivos e impactantes, utilizando o poder da Inteligência Artificial. Com esta ferramenta, você pode transformar notas brutas e observações em feedbacks bem estruturados, seguindo modelos consagrados de gestão e comunicação.

## ✨ Principais Funcionalidades

- **Autenticação Segura**: Login e cadastro de usuários para garantir a privacidade dos seus dados.
- **Múltiplos Modelos de Feedback**: Escolha entre diferentes modelos de feedback, como "Situação, Comportamento, Impacto" (SCI) e "Pendrive", para adaptar a mensagem ao contexto.
- **Geração de Feedback com IA**: Utiliza a API do Gemini para gerar textos de feedback baseados em suas notas.
- **Histórico de Feedbacks**: Salve e acesse todos os feedbacks gerados anteriormente.
- **Design Responsivo**: Interface adaptável para uma ótima experiência em desktops e dispositivos móveis.

## 🚀 Como Funciona

1. **Escolha um Modelo**: Selecione um dos modelos de feedback disponíveis.
2. **Forneça o Contexto**: Preencha os campos com suas observações e notas sobre a situação.
3. **Gere o Feedback**: A IA irá processar suas notas e gerar um texto de feedback coeso, profissional e alinhado ao modelo escolhido.
4. **Salve e Utilize**: Revise o texto gerado, faça ajustes se necessário e salve o feedback para consultas futuras.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: [React](https://react.dev/) com [Vite](https://vitejs.dev/)
- **Backend e Autenticação**: [Supabase](https://supabase.io/)
- **Geração de Texto com IA**: [Google Gemini](https://ai.google.dev/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Ícones**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## 🔧 Guia de Instalação e Configuração Local

Siga os passos abaixo para executar o projeto em seu ambiente de desenvolvimento.

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 22.x ou superior)
- [npm](https://www.npmjs.com/) (geralmente instalado com o Node.js)

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/feedback-ai-assistant.git
cd feedback-ai-assistant
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Você precisará de chaves de API do Supabase e do Google Gemini.

#### a. Configuração do Supabase

1. Crie um novo projeto no [Supabase](https://supabase.io/).
2. No seu projeto, vá para **Project Settings** > **API**.
3. Copie a **Project URL** e a **`anon` public key**.

#### b. Configuração do Google Gemini

1. Acesse o [Google AI Studio](https://aistudio.google.com/).
2. Crie uma nova chave de API (**API key**).

#### c. Crie o Arquivo `.env.local`

Na raiz do projeto, crie um arquivo chamado `.env.local` e adicione as seguintes variáveis:

```env
VITE_SUPABASE_URL="SUA_PROJECT_URL_DO_SUPABASE"
VITE_SUPABASE_ANON_KEY="SUA_ANON_PUBLIC_KEY_DO_SUPABASE"
VITE_GEMINI_API_KEY="SUA_API_KEY_DO_GEMINI"
```

### 4. Configure o Banco de Dados no Supabase

Para que a aplicação funcione corretamente, você precisa criar a tabela `feedbacks` no seu banco de dados Supabase.

1. No painel do seu projeto Supabase, vá para o **SQL Editor**.
2. Clique em **New query**.
3. Copie e execute o seguinte script SQL:

```sql
CREATE TABLE feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    colleague_name TEXT NOT NULL,
    relation TEXT NOT NULL,
    model TEXT NOT NULL,
    model_data JSONB NOT NULL,
    generated_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Habilita a RLS (Row Level Security)
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários leiam seus próprios feedbacks
CREATE POLICY "Allow users to read their own feedbacks"
ON feedbacks
FOR SELECT
USING (auth.uid() = user_id);

-- Política para permitir que usuários insiram seus próprios feedbacks
CREATE POLICY "Allow users to insert their own feedbacks"
ON feedbacks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política para permitir que usuários atualizem seus próprios feedbacks
CREATE POLICY "Allow users to update their own feedbacks"
ON feedbacks
FOR UPDATE
USING (auth.uid() = user_id);
```

### 5. Execute a Aplicação

Agora você está pronto para iniciar o servidor de desenvolvimento.

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

## 📂 Estrutura do Projeto

```
/
├── public/               # Arquivos estáticos
├── src/
│   ├── components/       # Componentes React reutilizáveis
│   ├── services/         # Módulos de serviço (auth, api, etc.)
│   ├── App.tsx           # Componente principal da aplicação
│   ├── index.css         # Estilos globais
│   ├── main.tsx          # Ponto de entrada da aplicação
│   └── types.ts          # Definições de tipos TypeScript
├── .env.local.example    # Exemplo de arquivo de variáveis de ambiente
├── package.json          # Dependências e scripts do projeto
└── README.md             # Este arquivo
```
</div>
