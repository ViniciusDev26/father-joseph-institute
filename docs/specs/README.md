# Specs

This directory is the **single source of truth** for what the application should do. Every entity, API endpoint, page, component, and feature must be specified here before any code is written.

## Structure

```
docs/specs/
├── api/                        # Contract — the bridge between back and front
│   └── _template.md
├── backend/
│   ├── entities/               # Data model (database tables)
│   │   └── _template.md
│   └── features/               # Backend features
│       └── _template.md
└── frontend/
    ├── pages/                  # Site pages
    │   └── _template.md
    ├── components/             # Reusable UI components
    │   └── _template.md
    └── features/               # Frontend features
        └── _template.md
```

## How it connects

```
Backend features ──→ API specs ←── Frontend features
       │                                   │
       ▼                                   ▼
  Entity specs                    Page / Component specs
```

- **API specs** are the contract. Backend implements them, frontend consumes them.
- **Backend features** reference entity specs + API specs they implement.
- **Frontend features** reference API specs + page/component specs they use.
- Backend and frontend never reference each other directly — they always go through the API spec.

## Rules

1. **Spec first, code second.** Do not implement anything without a corresponding spec. If a spec doesn't exist, write it and get approval before coding.
2. **Implement only what is specified.** If the spec defines a list endpoint, implement only the list endpoint — not a full CRUD. If the spec defines three fields, implement three fields — not five. Never extrapolate scope.
3. **Specs are append-only in intent.** Do not remove or weaken existing specs without explicit approval. You may add new specs or extend existing ones when requested.
4. **One entity per file, one domain per API file.** Keep specs granular and focused.
5. **Use templates.** Every new spec must follow the corresponding `_template.md`.
6. **Reference ADRs for conventions.** Specs define _what_ to build. ADRs (in `docs/adr/`) define _how_ to build it. Don't repeat ADR content in specs.

## How the AI should use specs

- Before implementing any request, check `docs/specs/` for a matching spec.
- If a spec exists, follow it exactly — field names, types, constraints, endpoints, status codes.
- If a spec does not exist for what was requested, ask the user whether to create one first.
- If the user's request contradicts a spec, flag the conflict and ask for clarification.
- After implementation, the spec remains the reference. Code should match the spec, not the other way around.

## Lifecycle

```
User request → Check spec exists → Write/update spec → Approve → Implement → Verify against spec
```
