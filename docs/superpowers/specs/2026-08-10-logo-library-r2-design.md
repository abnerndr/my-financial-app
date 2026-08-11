# Design: Biblioteca de logos (categorias + R2)

**Data:** 2026-08-10  
**Status:** Aprovado em conversa — aguardando revisão do spec

## Objetivo

Permitir que o usuário associe imagens a gastos de duas formas (upload ou URL), reutilize logos, organize por categoria (ex.: Banco, Médico) com nome (ex.: Nubank, Walmart), e armazene uploads no Cloudflare R2.

## Decisões já tomadas

| Tema | Escolha |
|------|---------|
| Escopo de propriedade | Híbrido: logos/categorias do usuário + futuros padrões do sistema (`userId = null`) |
| Gestão | Página dedicada **e** seletor no formulário de gasto |
| Logos do sistema agora | Começa vazio; pacote padrão pode ser adicionado depois |
| Abordagem técnica | Biblioteca com FK (`logoId`) + `logoUrl` denormalizado no gasto |

## Modelo de dados

### `LogoCategory`

| Campo | Tipo | Notas |
|-------|------|--------|
| `id` | cuid | PK |
| `name` | string | Ex.: Banco, Médico |
| `userId` | string? | `null` = categoria do sistema |
| `createdAt` | DateTime | |
| `updatedAt` | DateTime | |

- Unique: `(userId, name)` via `@@unique([userId, name])`. Em PostgreSQL, `NULL` não colide com `NULL`, então várias categorias de sistema com nomes diferentes (e o mesmo nome em usuários distintos) funcionam; o app ainda valida unicidade de nome **por usuário** na action.
- Relação: `user` opcional; `logos Logo[]`.

### `Logo`

| Campo | Tipo | Notas |
|-------|------|--------|
| `id` | cuid | PK |
| `name` | string | Ex.: Nubank |
| `categoryId` | string | FK → LogoCategory |
| `userId` | string? | `null` = logo do sistema |
| `url` | string | URL pública R2 ou URL externa |
| `source` | enum `UPLOAD` \| `URL` | |
| `r2Key` | string? | Chave no bucket (só UPLOAD); útil para delete |
| `createdAt` / `updatedAt` | DateTime | |

- Unique sugerido: `(userId, categoryId, name)`.
- Usuário só edita/exclui onde `userId === session.user.id`.
- Logos/categorias do sistema: somente leitura na UI.

### `Expense` (alteração)

- Manter `logoUrl String?` (compatível com API n8n e renderização atual).
- Adicionar `logoId String?` FK opcional → `Logo`.
- Ao selecionar da biblioteca: setar `logoId` + copiar `logo.url` → `logoUrl`.
- Ao remover associação: `logoId = null`, `logoUrl = null` (ou manter URL solta se fluxo “só URL” no gasto — **não** no MVP; URL só via cadastro de Logo).

### `User`

- Relações: `logoCategories LogoCategory[]`, `logos Logo[]`.

## Storage (Cloudflare R2)

### Env vars

```
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=   # ex.: https://cdn.exemplo.com ou https://pub-xxx.r2.dev
```

Endpoint S3: `https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com`

### Upload

- Cliente: `@aws-sdk/client-s3` (`PutObject`).
- Key: `logos/{userId}/{uuid}.{ext}`.
- Tipos: `image/png`, `image/jpeg`, `image/webp`, `image/svg+xml`.
- Tamanho máx.: 2 MB.
- Resposta: URL pública `{R2_PUBLIC_URL}/{key}`.

### Delete

- Ao excluir Logo com `source = UPLOAD` e `r2Key`: tentar `DeleteObject` (falha de R2 não bloqueia delete do registro, só loga).

## APIs e server actions

### Actions / rotas autenticadas

| Ação | Descrição |
|------|-----------|
| `listLogoLibrary` | Categorias (próprias + sistema) com logos |
| `createLogoCategory` | Nome; `userId` = sessão |
| `createLogo` | categoryId, name, source; se URL → salva; se UPLOAD → espera `url`/`r2Key` já obtidos |
| `updateLogo` / `deleteLogo` | Só dono |
| `POST /api/logos/upload` | Multipart → R2 → `{ url, r2Key }` |

### Gasto

- `createExpense` / `updateExpense`: aceitar `logoId` opcional; se presente, validar acesso (próprio ou sistema) e preencher `logoUrl` a partir do logo.

### Integração n8n

- Sem mudança obrigatória: continua `logoUrl` string. `logoId` fora do escopo da API pública neste ciclo.

## UI

### Página `/logos`

- Nav no dashboard/configurações.
- Agrupamento por categoria.
- CTA “Novo logo” e “Nova categoria”.
- Form de logo: select categoria (ou criar inline) → nome → toggle Upload \| URL → preview → salvar.
- Sistema: badge “Sistema”, sem editar/excluir.

### Formulário de gasto (criar + editar)

- Substituir input URL puro por:
  - Preview do logo selecionado.
  - Botão “Escolher logo” → dialog: filtro por categoria + grid.
  - “Adicionar novo” no dialog → mesmo form da biblioteca; ao salvar, seleciona.
  - “Remover logo”.

## Permissões e regras

1. Listagem: `userId = session.id OR userId = null`.
2. Mutação: apenas `userId = session.id`.
3. Excluir categoria: só se for do usuário; bloquear se houver logos (ou cascade nos logos do usuário — **preferência:** impedir delete se houver logos e pedir exclusão dos logos antes).
4. Excluir logo: ok se gasto aponta para ele — setar `Expense.logoId = null` e **manter** `logoUrl` (snapshot) para o gasto não perder a imagem na UI.

## Fora de escopo (este ciclo)

- Seed/pacote padrão de logos.
- Admin UI para logos de sistema.
- Otimização/redimensionamento de imagem.
- CDN custom além de `R2_PUBLIC_URL`.
- Compartilhar logo de um usuário com outro.

## Critérios de sucesso

- [ ] Usuário cria categoria e logo via upload R2.
- [ ] Usuário cria logo via URL externa.
- [ ] Logo reaparece no seletor e pode ser reutilizado em vários gastos.
- [ ] Página `/logos` lista e permite excluir os próprios.
- [ ] Gasto mostra preview; n8n com `logoUrl` continua funcionando.
- [ ] Sem credenciais R2, upload falha com erro claro; fluxo URL ainda funciona.

## Riscos

| Risco | Mitigação |
|-------|-----------|
| Bucket/URL pública mal configurada | Documentar env + mensagem de erro no upload |
| Orphans no R2 | Guardar `r2Key` e deletar no exclude |
| Drift de migration no banco remoto | Preferir `db push` ou migration nova sem reset (baseline já existente) |
