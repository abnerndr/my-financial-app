# Exemplo de Uso do DataTable

Este arquivo demonstra como usar o componente DataTable reutilizável em diferentes cenários.

## Como Implementar

### 1. Na página de usuários (já implementado)

Veja `/src/app/(dashboard)/admin/users/page.tsx` para o exemplo completo.

### 2. Para criar uma nova tabela de produtos

```tsx
// src/app/(dashboard)/products/page.tsx
'use client';

import DataTable, { type DataTableProps } from '@/components/common/data-table';
import type { BaseDataItem } from '@/components/common/data-table';

// src/app/(dashboard)/products/page.tsx

interface Product extends BaseDataItem {
	name: string;
	price: number;
	category: string;
	stock: number;
	status: 'In Stock' | 'Out of Stock' | 'Low Stock';
}

export default function ProductsPage() {
	const productActions: DataTableProps<Product>['actions'] = [
		{
			label: 'Edit Product',
			onClick: (product) => console.log('Edit:', product),
		},
		{
			label: 'Delete',
			onClick: (product) => console.log('Delete:', product),
			variant: 'destructive',
		},
	];

	return (
		<div className="container mx-auto py-8">
			<DataTable<Product>
				title="Product Management"
				description="Manage your product inventory"
				fetchData={async () => [
					{
						id: '1',
						name: 'Laptop Pro',
						price: 2999.99,
						category: 'Electronics',
						stock: 15,
						status: 'In Stock',
					},
					// mais produtos...
				]}
				searchableColumns={['name', 'category']}
				filterableColumns={['status', 'category']}
				actions={productActions}
				pageSize={15}
			/>
		</div>
	);
}
```

### 3. Para uma tabela simples sem customizações

```tsx
// src/components/orders/orders-table.tsx
interface Order extends BaseDataItem {
	customerName: string;
	total: number;
	status: 'Pending' | 'Completed' | 'Cancelled';
	createdAt: string;
}

export function OrdersTable({ orders }: { orders: Order[] }) {
	return (
		<DataTable<Order>
			data={orders}
			searchableColumns={['customerName']}
			filterableColumns={['status']}
			enableRowSelection={false}
			pageSize={25}
		/>
	);
}
```

## Vantagens da Implementação

✅ **Reutilizável**: Mesmo componente serve para qualquer tipo de dados  
✅ **Type-Safe**: TypeScript garante tipagem correta  
✅ **Consistente**: Design uniform em toda aplicação  
✅ **Performante**: Otimizado para grandes volumes de dados  
✅ **Acessível**: Suporte completo a acessibilidade  
✅ **Customizável**: Flexível para diferentes necessidades

## Comparação: Antes vs Depois

### Antes (Código duplicado)

```tsx
// Em cada página, você tinha que recriar:
- Estrutura HTML da tabela
- Lógica de paginação
- Sistema de filtros
- Seleção de linhas
- Ordenação
- Menu de ações
- Estados de loading
- Responsividade
```

### Depois (Componente reutilizável)

```tsx
// Agora você só precisa de:
<DataTable<SeuTipo>
	data={seusDados}
	searchableColumns={['campo1', 'campo2']}
	actions={suasAcoes}
/>
```

## Próximos Passos

1. **Implementar em outras páginas**: Aplique o DataTable em outras listagens
2. **Adicionar filtros customizados**: Estenda os filtros conforme necessário
3. **Integrar com APIs**: Use com React Query para cache e sincronização
4. **Personalizar colunas**: Crie colunas específicas para cada caso de uso

## Manutenção

- **Atualizações**: Melhorias no DataTable beneficiam toda a aplicação
- **Bug fixes**: Correções são aplicadas globalmente
- **Novas features**: Funcionalidades adicionadas ficam disponíveis para todos
- **Consistência**: Design system mantido automaticamente
