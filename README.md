# Controle Financeiro

Monolito de controle financeiro com Next.js, PostgreSQL (Prisma), login com Google (NextAuth.js), TanStack Query, React Hook Form, Zod e shadcn/ui.

## Funcionalidades

- **Login** com email e senha (NextAuth.js)
- **Cadastro** com verificação de email
- **Gastos**: título, descrição, logo (URL), valor, periodicidade (uma vez, mensal, anual)
- **Renda**: salário, benefícios, dinheiro guardado, outros
- **Dashboard**: situação (estável/crítica), saldo restante, resumo
- **Percentual de aviso**: configurável (ex.: 90% = alerta quando restar 10% do orçamento)
- **Alertas**: notificações de limite (preparado para integração com mensageria)
- **Relatórios**: gráficos (gastos por periodicidade, renda por tipo, renda vs gastos)

## Pré-requisitos

- Node 20+
- PostgreSQL
- Conta Google (para OAuth)

## Configuração

1. Clone e instale as dependências:

```bash
yarn install
```

2. Crie o arquivo `.env` na raiz (use `.env.example` como base):

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/my_financial_app?schema=public"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere-um-secret-aleatorio"
```

3. Configure as variáveis de ambiente no `.env.local`:

   - `DATABASE_URL`: String de conexão do PostgreSQL
   - `NEXTAUTH_URL`: URL da aplicação (ex: `http://localhost:3000`)
   - `NEXTAUTH_SECRET`: Secret aleatório (pode gerar com `openssl rand -base64 32`)

4. Crie o banco e aplique o schema:

```bash
yarn db:push
# ou, para usar migrações:
yarn db:migrate
```

5. Inicie o servidor:

```bash
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000). Será redirecionado para o login. Crie uma conta em `/cadastro` e verifique seu email (em desenvolvimento, o link aparece no console do servidor).

## Scripts

- `yarn dev` – servidor de desenvolvimento
- `yarn build` – build de produção
- `yarn start` – servidor de produção
- `yarn db:generate` – gera o Prisma Client
- `yarn db:push` – aplica o schema no banco (sem migrações)
- `yarn db:migrate` – cria/aplica migrações

## Estrutura principal

- `prisma/schema.prisma` – modelos (User, Expense, Income, Alert, UserSettings, NextAuth)
- `src/lib/auth.ts` – configuração NextAuth + Google
- `src/lib/calculations.ts` – cálculos de renda, gastos, saldo e % de uso
- `src/lib/data.ts` – funções de leitura (dashboard, gastos, renda, alertas)
- `src/app/actions/` – server actions (expenses, incomes, settings, alerts)
- `src/app/dashboard` – visão geral e status crítico/estável
- `src/app/gastos` – formulário e lista de gastos
- `src/app/renda` – formulário e lista de rendas
- `src/app/configuracoes` – percentual de aviso de limite
- `src/app/alertas` – lista de alertas
- `src/app/relatorios` – gráficos e métricas (Recharts)

Tudo que foi pedido está implementado e funcional (não apenas visual).
