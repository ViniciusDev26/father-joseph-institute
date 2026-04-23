# Specs

This directory is the **single source of truth** for what the application should do. Every entity, API endpoint, page, component, and feature must be specified here before any code is written.

## Index

### API (Contracts)

- [Artisans](./api/artisans.md)
- [Auth](./api/auth.md)
- [Cart](./api/cart.md)
- [Events](./api/events.md)
- [Institution](./api/institution.md)
- [Products](./api/products.md)
- [Volunteers](./api/volunteers.md)

### Backend: Entities

- [Artisan](./backend/entities/artisan.md)
- [Cart](./backend/entities/cart.md)
- [CartItem](./backend/entities/cart-item.md)
- [Event](./backend/entities/event.md)
- [EventPhoto](./backend/entities/event-photo.md)
- [Institution](./backend/entities/institution.md)
- [Product](./backend/entities/product.md)
- [ProductPhoto](./backend/entities/product-photo.md)
- [Volunteer](./backend/entities/volunteer.md)

### Backend: Features

- [Add to Cart](./backend/features/add-to-cart.md)
- [Checkout](./backend/features/checkout.md)
- [Create Artisan](./backend/features/create-artisan.md)
- [Create Event](./backend/features/create-event.md)
- [Create Product](./backend/features/create-product.md)
- [Get Cart](./backend/features/get-cart.md)
- [Get Institution](./backend/features/get-institution.md)
- [List Artisans](./backend/features/list-artisans.md)
- [List Events](./backend/features/list-events.md)
- [List Products](./backend/features/list-products.md)
- [Register Volunteer](./backend/features/register-volunteer.md)
- [Update Institution](./backend/features/update-institution.md)
- [Validate Auth](./backend/features/validate-auth.md)

## Structure

```
apps/docs/specs/
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
6. **Reference ADRs for conventions.** Specs define _what_ to build. ADRs (in `apps/docs/adr/`) define _how_ to build it. Don't repeat ADR content in specs.
