# API: Auth

> Endpoints para gerenciamento e validação de acesso.

## Base path

`/auth`

## Endpoints

### `POST /auth/validate`

> Valida se as credenciais Basic enviadas no header são corretas de acordo com a configuração do servidor.

**Request:**

| Location | Field           | Type   | Required | Description                              |
|----------|-----------------|--------|----------|------------------------------------------|
| header   | Authorization   | string | yes      | Basic Auth token (`Basic <base64>`)      |

**Response:**

| Status | Description       | Body                                      |
|--------|-------------------|-------------------------------------------|
| 200    | Token válido      | `{ "valid": true }`                       |
| 401    | Token inválido    | `{ "message": "Unauthorized" }`           |

**Business rules:**

- O servidor deve decodificar o valor Base64 do header e comparar com a variável de ambiente `ADMIN_BASIC_AUTH_TOKEN`.
- Se as strings forem idênticas, retorna 200.
- Caso contrário, retorna 401 conforme padrão HTTP para falha de autenticação.
