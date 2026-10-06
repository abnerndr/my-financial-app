# Page dependency trees

## /gastos (primary design target)
Entry: `src/app/gastos/page.tsx`
Dependencies:
- `src/app/gastos/expense-form.tsx`
  - `src/components/logos/logo-picker.tsx`
  - `src/components/ui/button.tsx`
  - `src/components/ui/currency-input.tsx`
  - `src/components/ui/field.tsx`
  - `src/components/ui/input.tsx`
  - `src/components/ui/select.tsx`
  - `src/components/ui/textarea.tsx`
- `src/app/gastos/expense-table.tsx`
  - `src/app/gastos/expense-edit-modal.tsx`
  - `src/components/ui/badge.tsx`
  - `src/components/ui/button.tsx`
  - `src/components/ui/table.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/progress.tsx`
- `src/lib/expense-visibility.ts` (groupPaymentsByReferenceMonth)
- `src/lib/utils.ts` (formatCurrency, cn)
- `src/app/globals.css`
- `src/app/layout.tsx`

## /dashboard
Entry: `src/app/dashboard/page.tsx`
Dependencies:
- `src/components/ui/badge.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/progress.tsx`
- `src/lib/data.ts` (getDashboardData)
- `src/lib/utils.ts`
