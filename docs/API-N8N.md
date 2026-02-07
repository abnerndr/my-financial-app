# APIs públicas para integração n8n / WhatsApp

Use a **base URL** da sua aplicação (ex: `https://seu-dominio.com`).

## 1. Solicitar código de verificação

Gera um código válido para `/verify` e envia ao usuário via WhatsApp (Evolution API). Se a [Evolution API](https://doc.evolution-api.com) estiver configurada (variáveis `EVOLUTION_*`), a mensagem é enviada automaticamente. Caso contrário, retorna o código para o n8n enviar.

- **URL:** `POST {baseUrl}/api/integrations/whatsapp/request-code`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
  	"phone": "+5511999999999"
  }
  ```
- **Respostas:**
  - `200`: `{ "code": "123456", "expiresInMinutes": 10, "sent": true }` — `sent: true` indica que foi enviado via Evolution API; `false` = o n8n deve enviar
  - `400`: dados inválidos
  - `404`: número não cadastrado na plataforma (usuário precisa cadastrar nas configurações primeiro)

## 2. Verificar telefone via WhatsApp

Quando o usuário envia o código de 6 dígitos pelo WhatsApp, o n8n deve chamar esta API.

- **URL:** `POST {baseUrl}/api/integrations/whatsapp/verify`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
  	"phone": "+5511999999999",
  	"code": "123456"
  }
  ```
- **Respostas:**
  - `200`: `{ "success": true, "message": "Telefone verificado com sucesso." }`
  - `400`: `{ "error": "Código inválido ou expirado. ..." }` ou dados inválidos

## 3. Criar gasto

Mesmos campos usados na plataforma. Autenticação por **chave de API** ou por **telefone verificado**.

- **URL:** `POST {baseUrl}/api/integrations/expenses`
- **Headers:**
  - `Content-Type: application/json`
  - **Opção A:** `X-API-Key: <chave do usuário>` ou `Authorization: Bearer <chave do usuário>`
  - **Opção B:** `X-Phone: +5511999999999` (telefone já verificado na plataforma)
- **Body:**
  ```json
  {
  	"title": "Aluguel",
  	"description": "Opcional",
  	"logoUrl": "",
  	"value": 1500.0,
  	"frequency": "MONTHLY"
  }
  ```
  - **title** (obrigatório): string
  - **description** (opcional): string
  - **logoUrl** (opcional): string URL ou vazio
  - **value** (obrigatório): número positivo (valor em reais)
  - **frequency** (obrigatório): `"ONE_TIME"` | `"MONTHLY"` | `"ANNUAL"`
- **Respostas:**
  - `201`: `{ "success": true, "id": "...", "title": "...", "value": 1500, "frequency": "MONTHLY" }`
  - `400`: dados inválidos (ex: title vazio, value negativo)
  - `401`: falta de X-API-Key/X-Phone ou chave/telefone inválido

## Fluxo sugerido no n8n

1. **Envio do código:** n8n recebe o número (ex: webhook ou formulário) → chama `POST .../whatsapp/request-code` com `{ phone }` → recebe `{ code }` → envia o código ao usuário via WhatsApp.
2. **Verificação:** usuário recebe o código no WhatsApp e envia de volta → n8n recebe a mensagem, extrai remetente (phone) e corpo (code) → chama `POST .../whatsapp/verify` com `{ phone, code }`.
3. **Criar gasto:** ao receber mensagem no WhatsApp com dados do gasto (ex: título, valor, periodicidade), parsear e chamar `POST .../expenses` com header `X-Phone: <remetente>` (ou `X-API-Key` se o usuário configurou a chave no fluxo) e body com os campos acima.
