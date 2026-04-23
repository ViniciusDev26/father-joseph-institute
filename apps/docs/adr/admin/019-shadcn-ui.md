# ADR-019: Componentização com shadcn/ui

**Status:** Accepted  
**Date:** 2026-04-23

## Context
Para agilizar o desenvolvimento do painel administrativo sem sacrificar a qualidade visual e a acessibilidade, precisamos de um conjunto de componentes prontos e customizáveis.

## Decision
Utilizar **shadcn/ui** como biblioteca de componentes, baseada em **Radix UI** (acessibilidade) e estilizada com **Tailwind CSS**.

### Justificativas:
1. **Controle:** Diferente de bibliotecas como MUI, o shadcn/ui não é uma dependência que você instala e não tem acesso ao código. Você "copia e cola" os componentes para o seu projeto, permitindo total customização.
2. **Acessibilidade:** Como é baseado no Radix UI, os componentes já possuem suporte nativo a acessibilidade (WAI-ARIA).
3. **Estética:** Alta qualidade visual pronta para uso, facilmente adaptável à paleta de cores do projeto.

## Consequences
- **Prós:** Desenvolvimento rápido, componentes de alta qualidade, total controle sobre o código e acessibilidade garantida.
- **Contras:** Aumenta a quantidade de arquivos (código dos componentes) dentro da pasta `src/components/ui`.
