# Instituto Padre José

## Missão

Ajudar moradores de rua, dar visibilidade ao trabalho de artesãs e comercializar os produtos produzidos por elas.

---

## Visão Geral do Projeto

Monorepo composto por 3 projetos dentro da estrutura `apps/`:

| Projeto | Descrição | Tecnologia |
|---------|-----------|------------|
| **site** | Site institucional de apresentação do instituto | Next.js |
| **api** | Backend responsável por cadastros, voluntários, produtos e conteúdo do site | TypeScript + Bun + Fastify |
| **admin** | Plataforma de gestão para customizar o conteúdo do site e gerenciar cadastros | Next.js (a definir) |

> **Prioridade inicial:** o desenvolvimento começa pelo **site**.

---

## Público-Alvo

Pessoas que querem contribuir com a causa — seja por doação, voluntariado ou divulgação.

---

## Projeto 1 — Site (`apps/site`)

Site institucional que apresenta o instituto e serve como porta de entrada para voluntários, doações e exposição do trabalho das artesãs.

Todo o conteúdo do site será consumido da API, permitindo que futuramente o painel administrativo controle os textos e dados exibidos.

### Páginas

| Página | Descrição |
|--------|-----------|
| **Quem Somos** | Apresentação do instituto, sua missão e história |
| **Eventos** | Divulgação de eventos promovidos pelo instituto |
| **Produtos** | Catálogo dos produtos produzidos pelas artesãs |
| **Artesãs** | Perfis e apresentação das artesãs vinculadas ao instituto |
| **Contato** | Informações de contato e localização do instituto |
| **Caixinha Solidária** | Seção de doações via Pix |
| **Voluntariado** | Formulário para cadastro de voluntários |
| **Loja Virtual** | Catálogo com carrinho de compras. O site envia os itens selecionados para a API, que monta a mensagem e retorna a URL de redirect para o WhatsApp (número configurável pela API). Sem checkout/pagamento no site |

---

## Projeto 2 — API (`apps/api`)

Backend que centraliza os dados e regras de negócio.

### Responsabilidades

- Cadastro e gerenciamento de artesãs
- Cadastro e gerenciamento de produtos das artesãs
- Gerenciamento de eventos
- Recebimento de cadastros de voluntários (feitos pelo site)
- Controle do conteúdo dinâmico exibido no site (textos, imagens, etc.)
- Loja virtual: gerenciamento do catálogo, recebimento dos pedidos (itens do carrinho), montagem da mensagem e geração da URL de redirect para WhatsApp (número configurável)

---

## Projeto 3 — Admin (`apps/admin`)

Plataforma de gestão interna para administradores do instituto.

### Responsabilidades

- Visualizar e gerenciar voluntários cadastrados
- Cadastrar e editar artesãs
- Cadastrar e editar produtos
- Gerenciar eventos
- Gerenciar catálogo da loja virtual
- Customizar o conteúdo/texto do site

---

## Ordem de Desenvolvimento

1. **Site** — foco inicial
2. **API** — a definir
3. **Admin** — a definir
