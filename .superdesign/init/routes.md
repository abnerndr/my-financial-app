# Routes (Next.js App Router)

| Path | File | Summary |
|------|------|---------|
| `/` | `src/app/page.tsx` | Landing / auth entry |
| `/login` | `src/app/login/page.tsx` | OTP login |
| `/cadastro` | `src/app/cadastro/page.tsx` | Sign up |
| `/dashboard` | `src/app/dashboard/page.tsx` | Financial overview, paid this month, navigation cards |
| `/gastos` | `src/app/gastos/page.tsx` | Expenses: form, active list, payment history |
| `/renda` | `src/app/renda/page.tsx` | Income management |
| `/alertas` | `src/app/alertas/page.tsx` | Alerts history |
| `/relatorios` | `src/app/relatorios/page.tsx` | Charts and metrics |
| `/configuracoes` | `src/app/configuracoes/page.tsx` | Settings, WhatsApp |
| `/logos` | `src/app/logos/page.tsx` | Logo library |
| `/signout` | `src/app/signout/page.tsx` | Sign out confirm |

Auth middleware protects dashboard routes.
