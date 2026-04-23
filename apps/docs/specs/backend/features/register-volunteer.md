# Backend Feature: RegisterVolunteer

## User story

As a person interested in volunteering, I want to register my availability, so that the institute can contact me and I can quickly reach out to them via WhatsApp.

## Dependencies

- **Entities:** [Volunteer](../entities/volunteer.md), [Institution](../entities/institution.md)
- **API specs:** [POST /volunteers](../../api/volunteers.md)

## Acceptance criteria

- [ ] Persists a new volunteer with name, profession, and availability.
- [ ] `availability.days` must have at least one valid English weekday name; returns 400 otherwise.
- [ ] `availability.startTime` and `availability.endTime` must match `HH:MM` format; returns 400 otherwise.
- [ ] `availability.endTime` must be after `availability.startTime`; returns 400 otherwise.
- [ ] Fetches the institution's WhatsApp number after persisting the volunteer.
- [ ] Returns 422 if the institution has no WhatsApp number registered.
- [ ] Builds and returns a `whatsappUrl` with the pre-filled message and the number prefixed with `55`.
- [ ] Returns 201 with the created volunteer data and `whatsappUrl`.

## Edge cases

- Institution not seeded or WhatsApp not set: returns 422.
- `availability.days` contains an invalid weekday (e.g. `segunda`): returns 400.
- `availability.endTime` equal to `availability.startTime`: returns 400.
- `availability.days` is an empty array: returns 400.

## Notes

- The WhatsApp message template: _"Olá! Me chamo {name}, sou {profession} e gostaria de me voluntariar no Instituto Padre José. Tenho disponibilidade às {days joined by ', '} das {startTime} às {endTime}."_
- The volunteer record is always saved before the WhatsApp URL is built — even if the institution has no WhatsApp, the record is persisted.
