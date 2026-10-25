# 日本語 Journey

Aplicativo web para aprendizado de japonês com sistema de gamificação, flashcards e revisão espaçada.

## Stack Técnica

- **Frontend:** Next.js 16 + React 19 + Tailwind CSS 4 + Framer Motion
- **Backend:** API Routes (Next.js) + Prisma ORM
- **Banco:** SQLite (desenvolvimento) / PostgreSQL (produção)
- **Estado:** Zustand com persistência
- **Autenticação:** JWT (jose) + bcryptjs + cookies httpOnly
- **Testes:** Vitest + React Testing Library
- **Validação:** Zod

## Funcionalidades

- **Hiragana/Katakana/Kanji** — Aprendizado interativo com áudio
- **Vocabulário** — Mais de 3500 palavras organizadas por categoria
- **Gramática** — Padrões gramaticais com exemplos
- **Flashcards** — Sistema SM-2 de revisão espaçada
- **Conversação** — Prática com reconhecimento de fala
- **Gamificação** — XP, níveis, moedas, streaks e conquistas
- **Calendário** — Acompanhamento de dias de estudo
- **Tema** — Light/Dark com persistência
- **JLPT Prep** — Questões organizadas por nível (N5-N1)
- **Boss Battle** — Desafio gamificado com fases progressivas
- **Survival Mode** — Quiz contra o tempo
- **Kanji DNA** — Explorador de kanji com radicais
- **Japanese Radar** — Radar de habilidades
- **Shadow Sensei** — Detector de fraquezas
- **Error Notebook** — Caderno de erros

## Instalação

```bash
  Clonar o repositório
git clone <url>
cd nihongo-app

  Instalar dependências
npm install

  Configurar variáveis de ambiente
cp .env.example .env

  Gerar banco de dados
npx prisma db push

  Criar usuário admin
npm run db:seed

  Iniciar desenvolvimento
npm run dev
```

## Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `DATABASE_URL` | URL do banco de dados (SQLite ou PostgreSQL) | Sim |
| `JWT_SECRET` | Chave secreta para JWT | Sim |
| `ADMIN_NAME` | Nome do admin (seed) | Não |
| `ADMIN_PASSWORD` | Senha do admin (seed) | Não |
| `EMAIL_USER` | Email para envio | Não |
| `EMAIL_PASS` | Senha de app Gmail | Não |

### Configurando PostgreSQL (Produção)

1. Crie um banco PostgreSQL
2. Atualize o `DATABASE_URL` no `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/nihongo_journey?schema=public"
   ```
3. Altere o `provider` no `prisma/schema.prisma` de `sqlite` para `postgresql`
4. Execute as migrations:
   ```bash
   npx prisma db push
   ```

## Comandos

```bash
npm run dev            Iniciar servidor de desenvolvimento
npm run build          Build de produção
npm run start          Iniciar servidor de produção
npm run lint           Verificar código
npm run test           Rodar testes
npm run test:watch     Rodar testes em watch mode
npm run db:seed        Criar admin user
npm run db:push        Sincronizar banco com schema
npm run db:reset       Resetar banco de dados
```

## Testes

O projeto possui testes unitários para os módulos centrais:

```bash
npm run test          Rodar todos os testes
npm run test:watch    Modo watch (desenvolvimento)
```

### Cobertura de Testes

- `sm2.test.ts` — Algoritmo de revisão espaçada SM-2
- `performance.test.ts` — Sistema de registro de performance e erros
- `mastery.test.ts` — Cálculo de nível de maestria
- `shadow-sensei.test.ts` — Detector de fraquezas
- `utils.test.ts` — Utilitários gerais
- `romaji.test.ts` — Conversão romaji

### Adicionando Testes

Para rodar testes individualmente:
```bash
npx vitest run src/lib/sm2.test.ts
```

## Estrutura do Projeto

```
src/
├── app/
│   ├── (app)/            Rotas autenticadas
│   │   ├── dashboard/
│   │   ├── hiragana/
│   │   ├── katakana/
│   │   ├── kanji/
│   │   ├── vocabulary/
│   │   ├── grammar/
│   │   ├── flashcards/
│   │   ├── conversation/
│   │   ├── jlpt/
│   │   ├── boss-battle/
│   │   ├── survival/
│   │   ├── daily-capsule/
│   │   ├── error-notebook/
│   │   ├── kanji-dna/
│   │   ├── japanese-radar/
│   │   ├── anime/
│   │   ├── practice/
│   │   └── settings/
│   ├── api/              API Routes
│   │   ├── auth/
│   │   ├── content/
│   │   ├── progress/
│   │   ├── gamification/
│   │   └── ai/
│   ├── layout.tsx        Root layout
│   └── page.tsx          Login/Register
├── components/           Componentes React
├── data/                ;;; Dados estáticos
│   ├── hiragana.ts
│   ├── katakana.ts
│   ├── kanji.ts
│   ├── vocabulary.ts
│   ├── grammar.ts
│   ├── conversations.ts
│   └── jlpt-questions.ts   Questões JLPT extraídas
├── lib/                  Utilitários
│   ├── auth.ts           Autenticação JWT
│   ├── prisma.ts         Cliente Prisma
│   ├── speech.ts         Speech Synthesis/Recognition
│   ├── sm2.ts            Algoritmo revisão espaçada
│   ├── validations.ts    Schemas Zod
│   ├── utils.ts          Utilitários gerais
│   ├── performance.ts    Sistema de performance
│   ├── mastery.ts        Cálculo de maestria
│   ├── shadow-sensei.ts  Detector de fraquezas
│   ├── journey-engine.ts  Motor de recomendações
│   └── ...               Outros módulos de IA
├── store/                Zustand store
└── types/                TypeScript types
```

## Licença

MIT