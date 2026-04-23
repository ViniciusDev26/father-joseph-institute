# ADR-021: Mobile First no Painel Administrativo

**Status:** Accepted  
**Date:** 2026-04-23

## Context

O painel administrativo precisa ser utilizável em dispositivos móveis. Gestores do instituto acessam o painel em campo, usando smartphones para cadastrar artesãs, produtos e eventos. A ausência de responsividade impede o uso prático fora de um desktop.

## Decision

Adotar **mobile-first** como estratégia de layout: o CSS base atende ao mobile e breakpoints progressivos (`sm:`, `md:`) adicionam o layout desktop.

### Navegação

| Tela | Mobile | Desktop (`md+`) |
|------|--------|-----------------|
| Sidebar | Oculta — substituída por header fixo + menu overlay | Sidebar lateral fixa (w-60) |
| Header | Fixo no topo com botão hamburger | Oculto |

O menu overlay mobile cobre a tela inteira quando aberto, exibe os mesmos itens de navegação e um botão de fechar. Não depende de componentes externos (sem Sheet do shadcn).

### Listas

Tabelas HTML não são legíveis em telas pequenas. A estratégia é:

- **Mobile:** cards empilhados (`block md:hidden`), cada card exibe os campos principais
- **Desktop:** tabela tradicional (`hidden md:block`)

### Formulários

- Padding adaptado: `p-4 md:p-8`
- `max-w-xl` já funciona bem em mobile (ocupa a tela inteira com padding lateral)
- Botões de ação ocupam largura total em mobile (`w-full sm:w-auto`)

## Consequences

- **Prós:** Usabilidade em campo; sem bibliotecas adicionais; breakpoints do Tailwind são suficientes.
- **Contras:** Duplicação de marcação nas listas (cards + tabela coexistem no DOM, com visibilidade controlada por CSS).
