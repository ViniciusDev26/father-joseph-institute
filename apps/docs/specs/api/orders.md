# API: Orders

> Endpoints para listar pedidos e atualizar seu status. Todos exigem autenticação de admin.

## Caminho base

`/orders`

## Endpoints

### `GET /orders`

> Lista todos os pedidos, mais recentes primeiro.

**Autenticação:** obrigatória (Basic).

**Resposta:**

| Status | Descrição    | Body                                                                                                            |
|--------|--------------|-----------------------------------------------------------------------------------------------------------------|
| 200    | OK           | `{ orders: [{ id, status, total, observations, sessionId, createdAt, items: [{ id, productName, unitPrice, quantity }] }] }` |
| 401    | Não autorizado | `{ message: string }`                                                                                         |

---

### `PATCH /orders/:id/status`

> Atualiza o status de um pedido.

**Autenticação:** obrigatória (Basic).

**Requisição:**

| Local    | Campo  | Tipo                                  | Obrigatório | Descrição          |
|----------|--------|---------------------------------------|-------------|--------------------|
| params   | id     | number                                | sim         | ID do pedido       |
| body     | status | enum(`pending`, `paid`, `delivered`)  | sim         | Novo status        |

**Resposta:**

| Status | Descrição        | Body                                       |
|--------|------------------|--------------------------------------------|
| 200    | Atualizado       | `{ id, status }`                           |
| 400    | Erro de validação| `{ message: string }`                      |
| 401    | Não autorizado   | `{ message: string }`                      |
| 404    | Não encontrado   | `{ message: string }`                      |

---

### `PATCH /orders/:id/observations`

> Atualiza as observações de um pedido.

**Autenticação:** obrigatória (Basic).

**Requisição:**

| Local    | Campo        | Tipo                       | Obrigatório | Descrição                                       |
|----------|--------------|----------------------------|-------------|-------------------------------------------------|
| params   | id           | number                     | sim         | ID do pedido                                    |
| body     | observations | string \| null (max 2000)  | sim         | Texto livre; envie `null` para remover          |

**Resposta:**

| Status | Descrição        | Body                                       |
|--------|------------------|--------------------------------------------|
| 200    | Atualizado       | `{ id, observations }`                     |
| 400    | Erro de validação| `{ message: string }`                      |
| 401    | Não autorizado   | `{ message: string }`                      |
| 404    | Não encontrado   | `{ message: string }`                      |
