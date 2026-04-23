# Instituto Padre José

Documentação central do projeto **Instituto Padre José**, uma organização sem fins lucrativos dedicada a apoiar pessoas em situação de rua, dar visibilidade ao trabalho de artesãs e comercializar produtos manuais para sustentabilidade da instituição.

## 🎯 O Projeto

O sistema é um monorepo que compreende:
- **Site Institucional:** Vitrine para o trabalho das artesãs, catálogo de produtos com integração para pedidos via WhatsApp e portal para voluntários.
- **API REST:** Backend robusto que centraliza a gestão de produtos, artesãs, eventos e cadastros de voluntariado.
- **Painel Administrativo:** (Em desenvolvimento) Ferramenta interna para gestão de conteúdo e dados do instituto.

---

## 🚀 Guia Rápido

Aqui você encontra os pilares da nossa documentação:

- **[Visão Geral do Produto](./IDEA)**: O "porquê" do projeto, público-alvo e escopo de cada aplicação.
- **[Decisões Arquiteturais (ADRs)](./adr)**: O "como" construímos, registrando escolhas tecnológicas e padrões técnicos.
- **[Especificações (Specs)](./specs)**: O "o que" cada parte do sistema faz, incluindo contratos de API e modelos de dados.

---

## 📂 Organização de Arquivos

- `apps/docs/adr/`: Decisões técnicas e convenções.
- `apps/docs/specs/`: Fonte da verdade para funcionalidades e entidades.
- `apps/docs/IDEA.md`: Contexto de negócio e direção do produto.

## 🛠 Publicação

Este site é gerado automaticamente com **VitePress** a partir desta pasta. Para rodar localmente:
```bash
bunx turbo run dev --filter=docs
```
