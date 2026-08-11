# Logo Library + Cloudflare R2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Biblioteca reutilizável de logos com categorias (upload R2 ou URL), página `/logos` e seletor no formulário de gastos.

**Architecture:** Models `LogoCategory` + `Logo` (híbrido user/system via `userId` nullable). Uploads via S3 API do R2; gastos guardam `logoId` + snapshot `logoUrl`. UI: página de gestão + dialog de seleção compartilhado.

**Tech Stack:** Next.js 16 App Router, Prisma/PostgreSQL, NextAuth, `@aws-sdk/client-s3`, React Hook Form + Zod, shadcn/ui Dialog/Select.

**Spec:** `docs/superpowers/specs/2026-08-10-logo-library-r2-design.md`

---

## File map

| File | Responsibility |
|------|----------------|
| `prisma/schema.prisma` | Models + `Expense.logoId` |
| `src/lib/r2.ts` | Cliente R2 (put/delete) + validação env |
| `src/app/api/logos/upload/route.ts` | Upload multipart autenticado |
| `src/app/actions/logos.ts` | CRUD categorias/logos |
| `src/lib/data.ts` | `getLogoLibrary()` |
| `src/components/logos/logo-picker.tsx` | Dialog seletor + criar rápido |
| `src/components/logos/logo-form.tsx` | Form upload/URL reutilizável |
| `src/app/logos/page.tsx` | Página de gestão |
| `src/app/gastos/expense-form.tsx` | Trocar URL por picker |
| `src/app/gastos/expense-edit-modal.tsx` | Idem |
| `src/app/actions/expenses.ts` | Aceitar `logoId` |
| `src/middleware.ts` | Proteger `/logos` |
| `src/app/dashboard/page.tsx` | Link nav Logos |
| `.env` / docs | Vars R2 (não commitar secrets) |

---

### Task 1: Schema Prisma + sync DB

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `src/lib/data.ts` (tipos de expense se necessário depois)

- [ ] **Step 1: Adicionar enum e models ao schema**

Em `prisma/schema.prisma`, no model `User`, adicionar:

```prisma
  logoCategories LogoCategory[]
  logos          Logo[]
```

No model `Expense`, adicionar:

```prisma
  logoId  String?
  logo    Logo?   @relation(fields: [logoId], references: [id], onDelete: SetNull)
```

No final do schema (antes ou depois dos enums existentes):

```prisma
enum LogoSource {
  UPLOAD
  URL
}

model LogoCategory {
  id        String   @id @default(cuid())
  name      String
  userId    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user  User?  @relation(fields: [userId], references: [id], onDelete: Cascade)
  logos Logo[]

  @@unique([userId, name])
  @@index([userId])
}

model Logo {
  id         String     @id @default(cuid())
  name       String
  categoryId String
  userId     String?
  url        String
  source     LogoSource
  r2Key      String?
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt

  category LogoCategory @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  user     User?        @relation(fields: [userId], references: [id], onDelete: Cascade)
  expenses Expense[]

  @@unique([userId, categoryId, name])
  @@index([userId])
  @@index([categoryId])
}
```

- [ ] **Step 2: Aplicar no banco sem reset**

Run:

```bash
yarn db:push
yarn db:generate
```

Expected: schema sincronizado; sem drop de dados.

> Se `dotenv -e .env.local` falhar (arquivo inexistente), rode com `DATABASE_URL` do `.env` ou ajuste o script para `dotenv -e .env -- prisma db push`.

- [ ] **Step 3: Commit**

```bash
git add prisma/schema.prisma
git commit -m "$(cat <<'EOF'
## O que foi feito
Adiciona models LogoCategory e Logo e logoId em Expense.

## Por que
Base de dados para biblioteca reutilizável de logos.

## Onde revisar
prisma/schema.prisma

## Impacto
- [ ] Nenhum
- [ ] Backend
- [ ] Frontend
- [x] DB
- [ ] Performance
- [ ] Segurança

## Risco / Atenção
Migration via db push; não usar migrate reset.

## Como validar
yarn db:push e conferir tabelas no Postgres.
EOF
)"
```

---

### Task 2: Cliente R2

**Files:**
- Create: `src/lib/r2.ts`
- Modify: documentar vars (comentário no topo do arquivo; usuário preenche `.env`)

- [ ] **Step 1: Instalar SDK**

```bash
yarn add @aws-sdk/client-s3
```

- [ ] **Step 2: Criar `src/lib/r2.ts`**

```typescript
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const ALLOWED_TYPES: Record<string, string> = {
	"image/png": "png",
	"image/jpeg": "jpg",
	"image/webp": "webp",
	"image/svg+xml": "svg",
};

export const MAX_LOGO_BYTES = 2 * 1024 * 1024;

function requireEnv(name: string): string {
	const v = process.env[name]?.trim();
	if (!v) throw new Error(`Configuração R2 incompleta: falta ${name}`);
	return v;
}

function getClient(): S3Client {
	const accountId = requireEnv("R2_ACCOUNT_ID");
	return new S3Client({
		region: "auto",
		endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
			secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
		},
	});
}

export function isAllowedLogoMime(mime: string): boolean {
	return mime in ALLOWED_TYPES;
}

export async function uploadLogoToR2(params: {
	userId: string;
	bytes: Buffer;
	contentType: string;
}): Promise<{ url: string; r2Key: string }> {
	if (!isAllowedLogoMime(params.contentType)) {
		throw new Error("Tipo de arquivo não permitido. Use PNG, JPG, WebP ou SVG.");
	}
	if (params.bytes.byteLength > MAX_LOGO_BYTES) {
		throw new Error("Arquivo maior que 2MB.");
	}

	const ext = ALLOWED_TYPES[params.contentType];
	const r2Key = `logos/${params.userId}/${randomUUID()}.${ext}`;
	const bucket = requireEnv("R2_BUCKET_NAME");
	const publicBase = requireEnv("R2_PUBLIC_URL").replace(/\/$/, "");

	await getClient().send(
		new PutObjectCommand({
			Bucket: bucket,
			Key: r2Key,
			Body: params.bytes,
			ContentType: params.contentType,
		}),
	);

	return { url: `${publicBase}/${r2Key}`, r2Key };
}

export async function deleteLogoFromR2(r2Key: string): Promise<void> {
	const bucket = requireEnv("R2_BUCKET_NAME");
	await getClient().send(
		new DeleteObjectCommand({
			Bucket: bucket,
			Key: r2Key,
		}),
	);
}
```

- [ ] **Step 3: Adicionar placeholders no `.env` (local, sem secrets no git)**

```env
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
```

- [ ] **Step 4: Commit**

```bash
git add package.json yarn.lock src/lib/r2.ts
git commit -m "$(cat <<'EOF'
## O que foi feito
Adiciona cliente Cloudflare R2 para upload/delete de logos.

## Por que
Persistir imagens de logo fora do app.

## Onde revisar
src/lib/r2.ts

## Impacto
- [ ] Nenhum
- [x] Backend
- [ ] Frontend
- [ ] DB
- [ ] Performance
- [x] Segurança

## Risco / Atenção
Requer env R2_* em produção; não commit secrets.

## Como validar
Importar o módulo sem erro de TypeScript (yarn build depois das rotas).
EOF
)"
```

---

### Task 3: API upload + actions de logos

**Files:**
- Create: `src/app/api/logos/upload/route.ts`
- Create: `src/app/actions/logos.ts`
- Modify: `src/lib/data.ts`
- Modify: `src/middleware.ts`

- [ ] **Step 1: Criar rota de upload**

`src/app/api/logos/upload/route.ts`:

```typescript
import { getSession } from "@/lib/auth";
import { MAX_LOGO_BYTES, isAllowedLogoMime, uploadLogoToR2 } from "@/lib/r2";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const session = await getSession();
	if (!session?.user?.id) {
		return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
	}

	try {
		const form = await request.formData();
		const file = form.get("file");
		if (!(file instanceof File)) {
			return NextResponse.json({ error: "Arquivo obrigatório" }, { status: 400 });
		}
		if (!isAllowedLogoMime(file.type)) {
			return NextResponse.json({ error: "Tipo não permitido" }, { status: 400 });
		}
		if (file.size > MAX_LOGO_BYTES) {
			return NextResponse.json({ error: "Arquivo maior que 2MB" }, { status: 400 });
		}

		const bytes = Buffer.from(await file.arrayBuffer());
		const result = await uploadLogoToR2({
			userId: session.user.id,
			bytes,
			contentType: file.type,
		});
		return NextResponse.json(result);
	} catch (e) {
		console.error("[logos/upload]", e);
		const message = e instanceof Error ? e.message : "Erro no upload";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
```

- [ ] **Step 2: Criar server actions**

`src/app/actions/logos.ts`:

```typescript
"use server";

import { getSession } from "@/lib/auth";
import { deleteLogoFromR2 } from "@/lib/r2";
import { prisma } from "@/lib/prisma";
import type { LogoSource } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const categorySchema = z.object({
	name: z.string().trim().min(1, "Nome da categoria é obrigatório").max(80),
});

const logoSchema = z.object({
	name: z.string().trim().min(1, "Nome é obrigatório").max(80),
	categoryId: z.string().min(1),
	source: z.enum(["UPLOAD", "URL"]),
	url: z.string().url("URL inválida"),
	r2Key: z.string().optional().nullable(),
});

function revalidateLogoPaths() {
	revalidatePath("/logos");
	revalidatePath("/gastos");
	revalidatePath("/dashboard");
}

export async function createLogoCategory(name: string) {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	const parsed = categorySchema.safeParse({ name });
	if (!parsed.success) {
		return { error: parsed.error.flatten().fieldErrors.name?.[0] ?? "Dados inválidos" };
	}

	const existing = await prisma.logoCategory.findFirst({
		where: { userId: session.user.id, name: parsed.data.name },
	});
	if (existing) return { error: "Já existe uma categoria com este nome" };

	const category = await prisma.logoCategory.create({
		data: { name: parsed.data.name, userId: session.user.id },
	});
	revalidateLogoPaths();
	return { success: true as const, category };
}

export async function createLogo(input: {
	name: string;
	categoryId: string;
	source: LogoSource;
	url: string;
	r2Key?: string | null;
}) {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	const parsed = logoSchema.safeParse(input);
	if (!parsed.success) {
		return { error: "Dados do logo inválidos", details: parsed.error.flatten().fieldErrors };
	}

	const category = await prisma.logoCategory.findFirst({
		where: {
			id: parsed.data.categoryId,
			OR: [{ userId: session.user.id }, { userId: null }],
		},
	});
	if (!category) return { error: "Categoria não encontrada" };
	if (category.userId === null) {
		return { error: "Não é possível adicionar logos em categoria do sistema" };
	}

	const dup = await prisma.logo.findFirst({
		where: {
			userId: session.user.id,
			categoryId: parsed.data.categoryId,
			name: parsed.data.name,
		},
	});
	if (dup) return { error: "Já existe um logo com este nome nesta categoria" };

	if (parsed.data.source === "UPLOAD" && !parsed.data.r2Key) {
		return { error: "Upload incompleto (r2Key ausente)" };
	}

	const logo = await prisma.logo.create({
		data: {
			name: parsed.data.name,
			categoryId: parsed.data.categoryId,
			userId: session.user.id,
			url: parsed.data.url,
			source: parsed.data.source,
			r2Key: parsed.data.source === "UPLOAD" ? parsed.data.r2Key ?? null : null,
		},
	});
	revalidateLogoPaths();
	return { success: true as const, logo };
}

export async function deleteLogo(id: string) {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	const logo = await prisma.logo.findFirst({
		where: { id, userId: session.user.id },
	});
	if (!logo) return { error: "Logo não encontrado" };

	await prisma.expense.updateMany({
		where: { logoId: id, userId: session.user.id },
		data: { logoId: null },
		// logoUrl permanece como snapshot
	});

	await prisma.logo.delete({ where: { id } });

	if (logo.source === "UPLOAD" && logo.r2Key) {
		try {
			await deleteLogoFromR2(logo.r2Key);
		} catch (e) {
			console.error("[deleteLogo] R2", e);
		}
	}

	revalidateLogoPaths();
	return { success: true as const };
}

export async function deleteLogoCategory(id: string) {
	const session = await getSession();
	if (!session?.user?.id) return { error: "Não autorizado" };

	const category = await prisma.logoCategory.findFirst({
		where: { id, userId: session.user.id },
		include: { _count: { select: { logos: true } } },
	});
	if (!category) return { error: "Categoria não encontrada" };
	if (category._count.logos > 0) {
		return { error: "Remova os logos desta categoria antes de excluí-la" };
	}

	await prisma.logoCategory.delete({ where: { id } });
	revalidateLogoPaths();
	return { success: true as const };
}
```

- [ ] **Step 3: Adicionar `getLogoLibrary` em `src/lib/data.ts`**

```typescript
export async function getLogoLibrary() {
	const session = await getSession();
	if (!session?.user?.id) return [];

	const categories = await prisma.logoCategory.findMany({
		where: {
			OR: [{ userId: session.user.id }, { userId: null }],
		},
		include: {
			logos: {
				where: {
					OR: [{ userId: session.user.id }, { userId: null }],
				},
				orderBy: { name: "asc" },
			},
		},
		orderBy: { name: "asc" },
	});

	return categories.map((c) => ({
		id: c.id,
		name: c.name,
		isSystem: c.userId === null,
		logos: c.logos.map((l) => ({
			id: l.id,
			name: l.name,
			url: l.url,
			source: l.source,
			isSystem: l.userId === null,
		})),
	}));
}
```

- [ ] **Step 4: Proteger `/logos` no middleware**

Em `src/middleware.ts`, incluir `"/logos"` em `protectedPaths` e no `matcher`.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/logos/upload/route.ts src/app/actions/logos.ts src/lib/data.ts src/middleware.ts
git commit -m "$(cat <<'EOF'
## O que foi feito
API de upload R2 e actions de categorias/logos.

## Por que
Backend da biblioteca de logos.

## Onde revisar
src/app/actions/logos.ts, src/app/api/logos/upload/route.ts

## Impacto
- [ ] Nenhum
- [x] Backend
- [ ] Frontend
- [ ] DB
- [ ] Performance
- [x] Segurança

## Risco / Atenção
Upload exige sessão e validação de MIME/tamanho.

## Como validar
Chamar createLogoCategory logado; upload com R2 configurado.
EOF
)"
```

---

### Task 4: Componentes UI (form + picker)

**Files:**
- Create: `src/components/logos/logo-form.tsx`
- Create: `src/components/logos/logo-picker.tsx`

- [ ] **Step 1: Criar `logo-form.tsx`**

Componente client que:
1. Select de categoria existente + input “nova categoria” (chama `createLogoCategory` se necessário).
2. Input nome.
3. Toggle `UPLOAD` | `URL` (dois botões ou tabs simples).
4. Se URL: input url + preview `next/image` ou `<img>`.
5. Se UPLOAD: `<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml">` → `POST /api/logos/upload` → guarda `{url,r2Key}` no state → preview.
6. Submit chama `createLogo` e `onCreated?.(logo)`.

Props:

```typescript
type Props = {
	categories: { id: string; name: string; isSystem: boolean }[];
	onCreated?: (logo: { id: string; name: string; url: string }) => void;
	defaultCategoryId?: string;
};
```

Filtrar categorias do sistema no select de destino de novos logos (`!isSystem`), ou permitir só categorias do usuário; se lista vazia, obrigar criar categoria primeiro.

- [ ] **Step 2: Criar `logo-picker.tsx`**

Dialog com:
- Select filtro de categoria (`all` + cada categoria).
- Grid de logos (botão com Image 48x48 + nome).
- Botões: Remover seleção, Adicionar novo (mostra `LogoForm` inline no dialog), Cancelar.

Props:

```typescript
type Props = {
	library: Awaited<ReturnType<typeof getLogoLibrary>>; // tipar inline se preferir
	value: { logoId: string | null; logoUrl: string | null };
	onChange: (next: { logoId: string | null; logoUrl: string | null }) => void;
};
```

UI fechada: preview + “Escolher logo” / “Trocar” / “Remover”.

- [ ] **Step 3: Commit**

```bash
git add src/components/logos/
git commit -m "$(cat <<'EOF'
## O que foi feito
Componentes LogoForm e LogoPicker.

## Por que
UI reutilizável para cadastro e seleção de logos.

## Onde revisar
src/components/logos/

## Impacto
- [ ] Nenhum
- [ ] Backend
- [x] Frontend
- [ ] DB
- [ ] Performance
- [ ] Segurança

## Risco / Atenção
Preview depende de next/image remotePatterns (já permite **).

## Como validar
Importar nos forms na task seguinte.
EOF
)"
```

---

### Task 5: Página `/logos` + nav

**Files:**
- Create: `src/app/logos/page.tsx`
- Create: `src/app/logos/logos-manager.tsx` (client: delete buttons + form)
- Modify: `src/app/dashboard/page.tsx` (link)
- Modify: `src/app/configuracoes/page.tsx` (link opcional)

- [ ] **Step 1: Server page**

`src/app/logos/page.tsx`: session check, `getLogoLibrary()`, render header + `LogosManager`.

- [ ] **Step 2: Client manager**

Lista por categoria (Card), badge “Sistema” se `isSystem`, botão excluir logo/categoria (só `!isSystem`) chamando actions + `router.refresh()`.

Incluir `LogoForm` no topo (“Novo logo”).

- [ ] **Step 3: Link no dashboard**

Junto aos outros botões:

```tsx
<Button asChild size="sm" variant="outline">
  <Link href="/logos">Logos</Link>
</Button>
```

- [ ] **Step 4: Commit**

```bash
git add src/app/logos/ src/app/dashboard/page.tsx src/app/configuracoes/page.tsx
git commit -m "$(cat <<'EOF'
## O que foi feito
Página /logos e link na navegação.

## Por que
Gestão dedicada da biblioteca de imagens.

## Onde revisar
src/app/logos/page.tsx

## Impacto
- [ ] Nenhum
- [ ] Backend
- [x] Frontend
- [ ] DB
- [ ] Performance
- [ ] Segurança

## Risco / Atenção
Nenhum.

## Como validar
Abrir /logos logado; criar categoria e logo via URL.
EOF
)"
```

---

### Task 6: Integrar picker nos gastos

**Files:**
- Modify: `src/app/actions/expenses.ts`
- Modify: `src/app/gastos/page.tsx`
- Modify: `src/app/gastos/expense-form.tsx`
- Modify: `src/app/gastos/expense-edit-modal.tsx`
- Modify: `src/lib/data.ts` (`getExpensesWithPaymentStatus` incluir `logoId`)
- Modify: `src/app/gastos/expense-table.tsx` (passar `logoId` no tipo)

- [ ] **Step 1: Atualizar actions de expense**

No schema zod, trocar `logoUrl` solto por:

```typescript
logoId: z.string().optional().or(z.literal("")),
```

Em `createExpense` / `updateExpense`:

```typescript
const logoId = (formData.get("logoId") as string) || null;
let logoUrl: string | null = null;
if (logoId) {
  const logo = await prisma.logo.findFirst({
    where: {
      id: logoId,
      OR: [{ userId: session.user.id }, { userId: null }],
    },
  });
  if (!logo) return { error: "Logo inválido" };
  logoUrl = logo.url;
}
// create/update com logoId + logoUrl
```

Remover parse de `logoUrl` do FormData no fluxo da UI (API n8n continua enviando `logoUrl` direto na route de integrations — sem mudança).

- [ ] **Step 2: `expense-form.tsx`**

- Receber `library` como prop.
- State/form fields: `logoId`, `logoUrl` (watch).
- Render `<LogoPicker ... />` no lugar do input URL.
- No submit: `fd.set("logoId", logoId ?? "")`.

- [ ] **Step 3: `expense-edit-modal.tsx`**

Mesmo padrão; incluir `logoId` no tipo do expense.

- [ ] **Step 4: `gastos/page.tsx`**

```typescript
const [expenses, paymentsHistory, library] = await Promise.all([
  getExpensesWithPaymentStatus(),
  getPaymentsHistory(),
  getLogoLibrary(),
]);
// <ExpenseForm library={library} />
// <ExpenseTable expenses={expenses} library={library} /> // se edit modal precisar
```

Passar `library` para a tabela/modal de edição.

- [ ] **Step 5: Commit**

```bash
git add src/app/actions/expenses.ts src/app/gastos/ src/lib/data.ts
git commit -m "$(cat <<'EOF'
## O que foi feito
Seletor de logo nos formulários de gasto e vínculo logoId.

## Por que
Reutilizar logos cadastrados nos gastos.

## Onde revisar
src/app/gastos/expense-form.tsx, src/app/actions/expenses.ts

## Impacto
- [ ] Nenhum
- [x] Backend
- [x] Frontend
- [ ] DB
- [ ] Performance
- [ ] Segurança

## Risco / Atenção
Gastos antigos só com logoUrl continuam exibindo a imagem.

## Como validar
Criar logo, associar a dois gastos, conferir preview na tabela.
EOF
)"
```

---

### Task 7: Verificação final

- [ ] **Step 1: Build**

```bash
yarn build
```

Expected: compile OK.

- [ ] **Step 2: Checklist manual**

1. Configurar `R2_*` no `.env` / Dokploy.
2. `/logos` → criar categoria “Banco” → logo “Nubank” via URL → aparece na lista.
3. (Com R2) upload PNG < 2MB → URL pública abre no browser.
4. Em `/gastos`, escolher logo → salvar → tabela mostra imagem.
5. Reutilizar o mesmo logo em outro gasto.
6. Excluir logo → gastos mantêm `logoUrl` snapshot; `logoId` null.
7. Sem R2: upload mostra erro claro; URL ainda funciona.

- [ ] **Step 3: Commit final se houver ajustes**

Somente se houver fixes de lint/build.

---

## Spec coverage (self-review)

| Spec item | Task |
|-----------|------|
| LogoCategory / Logo / logoId | 1 |
| R2 upload/delete + env | 2, 3 |
| Actions + list library | 3 |
| Página /logos | 5 |
| Picker no gasto create/edit | 4, 6 |
| Permissões user/system | 3 |
| Delete logo mantém logoUrl | 3 |
| n8n logoUrl intacto | 6 (não alterar route integrations) |
| Middleware /logos | 3 |

## Placeholders

Nenhum TBD restante. Credenciais R2 ficam a cargo do ambiente do usuário.
