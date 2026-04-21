import { db } from '../connection';
import { institutions } from '../schema';

export async function seedInstitution() {
  console.log('Seeding institution...');

  await db
    .insert(institutions)
    .values([
      {
        name: 'Instituto Padre José',
        slug: 'instituto-padre-jose',
        instagram: null,
        whatsapp: null,
        pixKey: null,
      },
    ])
    .onConflictDoNothing({ target: institutions.slug });
}
