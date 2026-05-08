# Page: AssistedPeople (Admin)

> Admin CRUD for managing assisted homeless people. Lives in the admin app (`apps/admin`) and is protected by the existing auth flow.

## Routes

| Path                          | Component             | Description                          |
|-------------------------------|-----------------------|--------------------------------------|
| `/assisted-people`            | `AssistedPersonList`  | List of all non-deleted records      |
| `/assisted-people/new`        | `AssistedPersonCreate`| Form to register a new record        |
| `/assisted-people/:id/edit`   | `AssistedPersonEdit`  | Form to edit an existing record      |

## Data sources

| Data                 | API endpoint                          | Description                          |
|----------------------|---------------------------------------|--------------------------------------|
| List + count         | `GET /assisted-people`                | Used by list page                    |
| Single record        | `GET /assisted-people/:id`            | Used by edit page                    |
| Create               | `POST /assisted-people`               | Used by create form                  |
| Update               | `PATCH /assisted-people/:id`          | Used by edit form                    |
| Soft delete          | `DELETE /assisted-people/:id`         | Triggered from list                  |

## Sections

### List page

1. **Header** — Title "Moradores de rua", subtitle "Gerencie os moradores assistidos pelo instituto", and a "Novo morador" button linking to the create page. Shows the total count next to the title.
2. **List/table** — Mobile: card per record with name, description and inline "Editar"/"Excluir" actions. Desktop: table with columns Nome, Descrição, Ações (Editar, Excluir).
3. **Empty state** — "Nenhum morador cadastrado." centered, plus the same "Novo morador" link.

### Create / Edit pages

1. **Back link** — "← Voltar para moradores" linking to `/assisted-people`.
2. **Form** — Fields: `name` (text, required, max 255), `description` (textarea, optional). Submit button "Salvar"; cancel link "Cancelar". The edit page pre-fills the form from `GET /assisted-people/:id`.

## States

- **Loading:** show "Carregando..." text while fetching.
- **Empty:** list page shows the empty-state copy above.
- **Error:** show a single red error line at the top of the form/list.
- **Delete confirm:** browser-native `confirm("Tem certeza...")` is sufficient for this iteration.

## Notes

- Follows the same visual conventions as the existing artisans page (mobile cards + desktop table, FadeIn wrappers).
- UI text in pt-BR, code in English per project conventions.
