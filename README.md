# Controle Financeiro

Aplicação full-stack para organizar renda, gastos recorrentes e o saldo do mês — no navegador, como PWA ou pelo WhatsApp, com o assistente **Chedar**.

[![Next.js](https://img.shields.io/badge/Next.js_16-black?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**Demo:** [finance.abnerndr.com](https://finance.abnerndr.com)

![Dashboard do Controle Financeiro — situação estável, renda, gastos e contas pagas no mês](public/screenshots/dashboard.png)

---

## O problema

Planilhas e apps genéricos não acompanham o ritmo de quem paga contas no Brasil: aluguel mensal, IPVA anual, um gasto avulso e a pergunta “ainda dá para gastar este mês?”. O Controle Financeiro responde isso com um dashboard de situação (estável ou crítica), histórico de pagamentos por mês e lembretes no WhatsApp no dia anterior ao vencimento.

## O que a aplicação faz

- **Dashboard** — renda mensal, reserva, gastos previstos, valor já pago no mês, saldo restante e barra de uso do orçamento
- **Gastos** — título, valor, logo, periodicidade (única, mensal, anual) e vencimento; marcar pago por mês de referência
- **Renda** — salário, benefícios, dinheiro guardado e outros
- **Alertas** — limite configurável (ex.: 90% = crítico quando restam 10%); notificações por e-mail e WhatsApp
- **Relatórios** — gráficos de gastos por periodicidade, renda por tipo e renda vs. gastos (Recharts)
- **Biblioteca de logos** — categorias e upload para Cloudflare R2, reutilizados nos gastos
- **Chedar no WhatsApp** — cadastro de despesas por texto (e fluxo de áudio via n8n), com APIs públicas autenticadas por chave ou telefone verificado
- **PWA** — instalável no celular, com manifesto e toast de instalação

## Stack

| Camada | Tecnologia |
| --- | --- |
| App | Next.js 16 (App Router), React 19, TypeScript |
| UI | Tailwind CSS 4, shadcn/ui, Radix, Lucide |
| Formulários e dados no client | React Hook Form, Zod, TanStack Query |
| Auth | NextAuth.js (OTP e-mail/WhatsApp, senha, Google OAuth opcional) |
| Banco | PostgreSQL + Prisma (`Decimal` para valores monetários) |
| E-mail | SendGrid |
| WhatsApp | Evolution API + webhooks pensados para n8n |
| Storage | Cloudflare R2 (S3-compatible) |
| Jobs | Cron autenticado (`/api/cron/expense-reminders`) |

## Arquitetura

```mermaid
flowchart LR
  subgraph clients [Clientes]
    Web[Web / PWA]
    WA[WhatsApp + Chedar]
  end

  subgraph app [Next.js]
    RSC[Pages RSC + Server Actions]
    API[APIs públicas / cron]
    Auth[NextAuth + OTP]
  end

  subgraph data [Dados]
    PG[(PostgreSQL)]
    R2[Cloudflare R2]
  end

  subgraph integrations [Integrações]
    SG[SendGrid]
    Evo[Evolution API]
    N8N[n8n]
  end

  Web --> RSC
  Web --> Auth
  WA --> N8N --> API
  RSC --> PG
  API --> PG
  RSC --> R2
  Auth --> SG
  Auth --> Evo
  API --> Evo
```

Rotas autenticadas (`/dashboard`, `/gastos`, `/renda`, `/alertas`, `/relatorios`, `/configuracoes`, `/logos`) passam pelo middleware do NextAuth. Mutações de domínio usam Server Actions; o client só orquestra formulário e cache (TanStack Query). Integrações externas não entram no browser: WhatsApp, e-mail e upload ficam no servidor.

## Decisões que importam no código

- **Dinheiro como `Decimal` no Prisma**, não `float` — evita erro de ponto flutuante em saldo e percentual de uso
- **Pagamento é um fato por mês** (`ExpensePayment` unique em `expenseId + referenceMonth`) — gasto mensal pode ser pago, desmarcado e consultado no histórico sem duplicar a despesa
- **OTP como caminho principal de login** — e-mail (SendGrid) ou WhatsApp (Evolution API); Google entra só se as credenciais OAuth existirem
- **APIs de integração com dois modos de auth** — `X-API-Key` / Bearer ou `X-Phone` já verificado, para o n8n criar gastos a partir do WhatsApp
- **Cron com segredo** — lembrete no dia anterior ao vencimento, só para quem verificou o telefone e ativou WhatsApp
- **Datas de vencimento como date-only em UTC** — mensal usa o dia do mês; anual usa dia+mês; única vez usa a data exata

## Como rodar localmente

Pré-requisitos: **Node 22** e **PostgreSQL**.

```bash
yarn install
```

Crie `.env` na raiz (não commite esse arquivo):

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/my_financial_app?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere-com: openssl rand -base64 32"

# Opcional — OTP por e-mail
SENDGRID_API_KEY=
SENDGRID_FROM=
SENDGRID_FROM_NAME=

# Opcional — Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Opcional — WhatsApp (Evolution API)
EVOLUTION_API_URL=
EVOLUTION_API_KEY=
EVOLUTION_INSTANCE=

# Opcional — upload de logos
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

# Opcional — cron de lembretes
CRON_SECRET=
```

```bash
yarn db:push    # ou yarn db:migrate
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000). Cadastro em `/cadastro` (OTP por e-mail ou WhatsApp). Sem SendGrid/Evolution configurados, o fluxo de código depende do que estiver disponível no ambiente.

APIs do Chedar / n8n: ver [`docs/API-N8N.md`](docs/API-N8N.md).

## Scripts

| Comando | Função |
| --- | --- |
| `yarn dev` | servidor de desenvolvimento |
| `yarn build` | Prisma generate + build de produção |
| `yarn start` | servidor de produção |
| `yarn db:generate` | gera o Prisma Client |
| `yarn db:push` | aplica o schema no banco |
| `yarn db:migrate` | cria e aplica migrações |

## Onde olhar no código

| Caminho | Papel |
| --- | --- |
| `prisma/schema.prisma` | User, Expense, ExpensePayment, Income, Alert, logos, settings |
| `src/lib/auth.ts` | NextAuth: OTP, credentials, Google |
| `src/lib/calculations.ts` | renda, gasto mensal efetivo, saldo, % de uso |
| `src/lib/data.ts` | leituras do dashboard, gastos, pagamentos |
| `src/app/actions/` | Server Actions (gastos, renda, settings, logos) |
| `src/app/api/integrations/` | APIs públicas para n8n / WhatsApp |
| `src/app/api/cron/expense-reminders/` | lembretes de vencimento |
| `src/lib/r2.ts` | upload e delete na R2 |
| `src/middleware.ts` | proteção de rotas |

---

Projeto pessoal de portfólio. Stack e produto reais, em produção em [finance.abnerndr.com](https://finance.abnerndr.com).
