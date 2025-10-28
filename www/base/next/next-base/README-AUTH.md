# Next.js Authentication System

Sistema completo de autenticação para Next.js com TypeScript, incluindo integração com backend NestJS.

## 🚀 Funcionalidades

### Autenticação

- ✅ Login com email/senha
- ✅ Registro de usuário
- ✅ Login com Google OAuth
- ✅ Magic Link (login sem senha)
- ✅ Recuperação de senha
- ✅ Verificação de email

### Segurança

- ✅ JWT Access Token + Refresh Token
- ✅ Interceptors automáticos para requisições
- ✅ Refresh automático de tokens
- ✅ Middleware de autenticação para rotas
- ✅ Cookies seguros para tokens

### Autorização

- ✅ Sistema de Roles (papéis)
- ✅ Sistema de Permissions (permissões)
- ✅ Componentes protegidos
- ✅ Rotas protegidas
- ✅ Validação de permissões em tempo real

### UI/UX

- ✅ Formulários com validação (React Hook Form + Zod)
- ✅ Interface moderna com shadcn/ui
- ✅ Estados de loading e erro
- ✅ Feedback visual para usuário
- ✅ Responsivo e acessível

### Estado e Cache

- ✅ Gerenciamento de estado com Zustand
- ✅ Cache inteligente com TanStack Query
- ✅ Persistência de dados
- ✅ Sincronização automática

## 📦 Dependências Principais

```json
{
	"dependencies": {
		"next": "15.5.4",
		"react": "19.1.0",
		"react-hook-form": "^7.63.0",
		"zod": "^4.1.11",
		"@hookform/resolvers": "^5.2.2",
		"zustand": "5.0.8",
		"@tanstack/react-query": "latest",
		"@tanstack/react-query-devtools": "latest",
		"axios": "^1.12.2",
		"js-cookie": "latest",
		"@types/js-cookie": "latest",
		"better-auth": "1.3.18"
	}
}
```

## 🛠️ Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Configure as variáveis:

```env
# URL do backend NestJS
NEXT_PUBLIC_API_URL=http://localhost:3001

# Google OAuth Client ID (opcional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 2. Instalação

```bash
pnpm install
```

### 3. Executar

```bash
pnpm dev
```

## 📁 Estrutura do Projeto

```
src/
├── app/                          # App Router do Next.js
│   ├── auth/                     # Páginas de autenticação
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── magic-link/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   ├── dashboard/page.tsx        # Exemplo de página protegida
│   └── page.tsx                  # Página inicial
├── components/
│   ├── auth/                     # Componentes de autenticação
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   ├── magic-link-form.tsx
│   │   ├── forgot-password-form.tsx
│   │   ├── reset-password-form.tsx
│   │   ├── google-login.tsx
│   │   ├── protected-route.tsx   # Componente de proteção
│   │   └── auth-initializer.tsx
│   └── ui/                       # Componentes shadcn/ui
├── lib/
│   ├── api/
│   │   └── auth.ts              # Cliente API de autenticação
│   ├── stores/
│   │   └── auth.ts              # Store Zustand
│   ├── permissions.ts           # Sistema de permissões
│   └── utils/
├── hooks/
│   └── use-auth-query.ts        # Hooks TanStack Query
├── providers/
│   ├── index.tsx                # Provider principal
│   ├── query-provider.tsx       # Provider TanStack Query
│   └── theme-provider.tsx       # Provider de tema
├── types/
│   ├── auth.ts                  # Types de autenticação
│   └── api.ts                   # Types da API
└── middleware.ts                # Middleware de autenticação
```

## 🔐 Sistema de Autenticação

### Fluxo de Login

1. **Login com Email/Senha**

   ```typescript
   const { login } = useAuthStore();
   await login(email, password);
   ```

2. **Login com Google**

   ```typescript
   const { loginWithGoogle } = useAuthStore();
   await loginWithGoogle(googleCredential);
   ```

3. **Magic Link**
   ```typescript
   const { sendMagicLink, verifyMagicLink } = useAuthStore();
   await sendMagicLink(email);
   await verifyMagicLink(token);
   ```

### Gerenciamento de Tokens

O sistema gerencia automaticamente:

- Armazenamento seguro em cookies
- Renovação automática de tokens
- Interceptors para requisições HTTP
- Limpeza automática em caso de logout

### Sistema de Permissões

```typescript
import { PERMISSIONS, ROLES, usePermissions } from '@/lib/permissions';

const permissions = usePermissions(user);

// Verificar role
if (permissions.hasRole(ROLES.ADMIN)) {
	// Usuário é admin
}

// Verificar permissão específica
if (permissions.hasPermission('users', 'read')) {
	// Usuário pode ler usuários
}

// Verificar se é dono do recurso
if (permissions.canAccess('posts', 'edit', postUserId)) {
	// Usuário pode editar o post
}
```

## 🛡️ Proteção de Rotas e Componentes

### Proteção de Páginas

```typescript
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function AdminPage() {
	return (
		<ProtectedRoute roles={["admin"]} permissions={[{ resource: "admin", action: "view" }]} redirectTo="/dashboard">
			<AdminContent />
		</ProtectedRoute>
	);
}
```

### Proteção de Componentes

```typescript
import { ProtectedComponent } from "@/components/auth/protected-route";

function MyComponent() {
	return (
		<div>
			<ProtectedComponent permissions={[{ resource: "users", action: "delete" }]} fallback={<div>Sem permissão</div>}>
				<DeleteUserButton />
			</ProtectedComponent>
		</div>
	);
}
```

### Hooks de Autenticação

```typescript
import { useAuth, useHasPermission, useHasRole } from "@/components/auth/protected-route";

function MyComponent() {
	const { user, isAuthenticated, logout } = useAuth();
	const canEditUsers = useHasPermission("users", "edit");
	const isAdmin = useHasRole("admin");

	if (!isAuthenticated) return <LoginForm />;

	return (
		<div>
			<h1>Bem-vindo, {user?.name}!</h1>
			{canEditUsers && <EditUsersButton />}
			{isAdmin && <AdminPanel />}
			<button onClick={logout}>Sair</button>
		</div>
	);
}
```

## 🔄 Integração com Backend

### Configuração da API

O cliente de API está configurado em `src/lib/api/auth.ts` com:

- Base URL configurável via env
- Interceptors automáticos
- Tratamento de erros
- Renovação automática de tokens

### Endpoints Esperados

O frontend espera que o backend (NestJS) tenha os seguintes endpoints:

```
POST /api/auth/login              # Login com email/senha
POST /api/auth/register           # Registro de usuário
POST /api/auth/google             # Login com Google
POST /api/auth/magic-link         # Enviar magic link
POST /api/auth/magic-link/verify  # Verificar magic link
POST /api/auth/reset-password     # Solicitar reset de senha
POST /api/auth/reset-password/confirm # Confirmar reset de senha
POST /api/auth/verify-email       # Verificar email
POST /api/auth/refresh            # Renovar tokens
POST /api/auth/logout             # Logout
GET  /api/auth/profile            # Obter perfil do usuário
```

### Formato de Resposta

```typescript
interface ApiResponse<T> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
	statusCode: number;
}
```

## 🎨 Customização

### Temas

O sistema usa shadcn/ui com suporte a temas claro/escuro automático.

### Estilos

Personalize os componentes editando os arquivos em `src/components/ui/`.

### Permissões

Adicione novas permissões em `src/lib/permissions.ts`:

```typescript
export const PERMISSIONS = {
	// Suas permissões personalizadas
	CUSTOM: {
		VIEW: { resource: 'custom', action: 'view' },
		EDIT: { resource: 'custom', action: 'edit' },
	},
} as const;
```

## 📚 Exemplos de Uso

### Formulário com Validação

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

function LoginForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(schema),
	});

	const onSubmit = async (data) => {
		// Lógica de login
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<input {...register("email")} />
			{errors.email && <span>{errors.email.message}</span>}
			{/* ... */}
		</form>
	);
}
```

### Query com Permissão

```typescript
import { usePermissionQuery } from "@/hooks/use-auth-query";

function UsersList() {
	const { data: users, isLoading } = usePermissionQuery(["users"], () => fetchUsers(), { resource: "users", action: "read" });

	if (isLoading) return <div>Carregando...</div>;

	return (
		<div>
			{users?.map((user) => (
				<UserCard key={user.id} user={user} />
			))}
		</div>
	);
}
```

## 🤝 Integração com Backend NestJS

Este frontend foi projetado para trabalhar em conjunto com um backend NestJS. Para uma integração completa, certifique-se de que seu backend:

1. Implementa todos os endpoints listados acima
2. Usa JWT com access/refresh tokens
3. Implementa sistema de roles/permissions
4. Retorna dados no formato esperado
5. Configura CORS adequadamente

## 📝 Notas de Desenvolvimento

### TypeScript

Todo o código usa TypeScript com tipagem estrita. Tipos estão organizados em `src/types/`.

### Validação

Formulários usam Zod para validação client-side e server-side consistency.

### Estado Global

Zustand gerencia o estado de autenticação com persistência automática.

### Cache

TanStack Query gerencia cache de dados com invalidação inteligente.

### Middleware

O middleware Next.js protege rotas automaticamente baseado em autenticação.

## 🔧 Desenvolvimento

Para adicionar novos recursos:

1. **Nova tela de auth**: Crie em `src/app/auth/`
2. **Novo formulário**: Use o padrão existente com React Hook Form + Zod
3. **Nova permissão**: Adicione em `src/lib/permissions.ts`
4. **Nova API**: Extend `src/lib/api/auth.ts`
5. **Novo hook**: Use padrão em `src/hooks/`

## 🚀 Deploy

Para deploy em produção:

1. Configure variáveis de ambiente de produção
2. Atualize `NEXT_PUBLIC_API_URL` para URL do backend
3. Configure Google OAuth se usando
4. Build e deploy normalmente

```bash
pnpm build
pnpm start
```

## 📄 Licença

Este projeto é um template/base para desenvolvimento. Use livremente em seus projetos.
