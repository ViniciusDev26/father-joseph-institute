import { seedInstitution } from './seeds/institution';

type Seeder = () => Promise<void>;
const seeders: Array<Seeder> = [seedInstitution];

async function seed() {
  for (const seeder of seeders) {
    await seeder();
  }

  console.log('Done.');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
