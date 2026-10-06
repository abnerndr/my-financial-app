# Controle Financeiro — Design System

## Product
Personal finance tracker for Brazil: monthly/annual/one-time expenses, income, WhatsApp reminders, budget limit alerts. Primary job: answer “ainda dá para gastar este mês?” with clear paid-vs-planned progress and a scannable payment history.

## Visual language
- **Style:** clean utility UI (shadcn), light mode, lots of white space between major sections but dense data rows where lists grow long
- **Fonts:** Geist Sans (UI), Geist Mono (optional numeric)
- **Primary:** Emerald 600 (`oklch(0.623 0.188 153.5)` / `#059669`)
- **Surfaces:** white cards, `rounded-xl`, subtle `border-border`, light shadow
- **Text:** near-black foreground; muted gray for secondary (`oklch(0.556 0 0)`)
- **Badges:** secondary gray for frequency; emerald tint for paid/success
- **Radius:** `--radius: 0.625rem`
- **Do not invent:** purple gradients, serif display fonts, dark neo-glass, emoji icons as brand

## Layout patterns
- Page: `max-w-7xl` container, back link + title header, stacked Cards with `space-y-8`
- Card header `p-6`, content `p-6 pt-0`
- Data density: tables/lists should prefer compact rows over large bordered cards when item count is high (20+)

## /gastos — payment history (design focus)
Current pain: each payment is a full bordered row with large gaps → hard to scan 24+ items.
Goals for redesign:
1. Higher information density (compact rows / table-like)
2. Clear month hierarchy (sticky or strong month headers + totals)
3. Faster scan: title | frequency | value | date aligned in columns
4. Optional collapse of past months; current month expanded by default
5. Keep emerald/shadcn tokens — improve structure, not rebrand

## Motion
Minimal: soft transitions only; no decorative motion required for history.
