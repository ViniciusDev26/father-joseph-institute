# Page: Loja Virtual

> Loja com carrinho de compras. O usuário adiciona produtos e finaliza o pedido via WhatsApp.

## Route

`/shop`

## Data sources

| Data | API endpoint | Cache/ISR | Description |
|------|-------------|-----------|-------------|
| Lista de produtos | `GET /products` | no-store | Produtos disponíveis para compra |
| Carrinho atual | `GET /cart/:sessionId` | no-store | Itens do carrinho da sessão atual |

## Sections

1. **Hero** — Tag itálica, título e subtítulo explicando o fluxo de compra via WhatsApp.
2. **Grid de produtos** (client component) — Mesma estrutura do `/products`, porém com botão "Adicionar" em vez de "Comprar". Ao clicar, o produto é adicionado ao carrinho via Server Action.
3. **Botão flutuante do carrinho** — Fixo no canto inferior direito; exibe contagem de itens. Ao clicar, abre o drawer do carrinho.
4. **Drawer do carrinho** — Slide-over pela direita. Lista itens com foto, nome, quantidade e subtotal. Rodapé com total geral e botão "Finalizar via WhatsApp".

## Cart flow

1. Ao visitar `/shop`, o servidor verifica o cookie `cart_session_id`.
2. Se o cookie existe, busca o carrinho aberto via `GET /cart/:sessionId` e passa para o client component como `initialCart`.
3. Ao adicionar item: Server Action `addToCart(productId, quantity)` → cria/lê cookie → `POST /cart/items`.
4. Ao finalizar: Server Action `checkout()` → `POST /cart/checkout` → retorna `whatsappUrl` → abre em nova aba → deleta o cookie.

## States

- **Empty:** Mensagem "Seu carrinho está vazio" dentro do drawer quando não há itens.
- **Empty products:** Mensagem quando não há produtos disponíveis.
- **Optimistic:** Ao adicionar item, o estado do carrinho é atualizado otimisticamente via `useOptimistic` antes da confirmação do servidor.

## Notes

- `sessionId` é um UUID armazenado no cookie `cart_session_id` (maxAge: 30 dias).
- Toda a lógica de API do carrinho ocorre em Server Actions — sem chamadas de API diretas no client.
- O cookie é deletado após o checkout.
- Textos estáticos vêm de `content.json`.
