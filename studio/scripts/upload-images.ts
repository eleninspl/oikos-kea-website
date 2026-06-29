/**
 * Ανεβάζει local φωτογραφίες menu items στο Sanity και τις συνδέει στα αντίστοιχα documents.
 *
 *   SANITY_WRITE_TOKEN=sk... npx tsx scripts/upload-images.ts
 *
 * Δεν αντικαθιστά εικόνες που ήδη υπάρχουν στο Sanity — μόνο items χωρίς image.
 */
import { createClient } from '@sanity/client';
import { createReadStream } from 'fs';
import { resolve, extname } from 'path';
import { PROJECT_ID, DATASET } from './_env';

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

// Local image file → prefix του nameEn του αντίστοιχου menuItem
const IMAGE_MAP: { file: string; namePrefix: string }[] = [
  { file: 'kani.jpg', namePrefix: 'Kani' },
  { file: 'kyuri.webp', namePrefix: 'Kyuri' },
  { file: 'spicy-maguro.webp', namePrefix: 'Spicy Maguro' },
  { file: 'hamachi-jalapeno.jpg', namePrefix: 'Hamachi' },
  { file: 'vegetarian.webp', namePrefix: 'Vegetarian' },
  { file: 'donburi.webp', namePrefix: 'Chirashi' },
  { file: 'rigatoni-chicken.jpg', namePrefix: 'Chicken Rigatoni' },
];

const IMAGES_DIR = resolve(__dirname, '../../public/images/food');

async function run() {
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error(
      `❌  Λείπει το SANITY_WRITE_TOKEN.\n   Πάρτο από: https://sanity.io/manage/project/${PROJECT_ID} → API → Tokens`,
    );
    process.exit(1);
  }

  // Φέρε όλα τα menuItem documents χωρίς image
  const items = await client.fetch<{ _id: string; nameEn: string }[]>(
    `*[_type == "menuItem" && !defined(image)]{ _id, nameEn }`,
  );
  console.log(`📋  ${items.length} items χωρίς εικόνα στο Sanity`);

  for (const { file, namePrefix } of IMAGE_MAP) {
    const match = items.find((it) =>
      (it.nameEn ?? '').toLowerCase().startsWith(namePrefix.toLowerCase()),
    );

    if (!match) {
      console.log(`⏭️   Παράλειψη ${file} — δεν βρέθηκε item ή ήδη έχει εικόνα`);
      continue;
    }

    const filePath = resolve(IMAGES_DIR, file);
    const ext = extname(file);
    const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';

    console.log(`⬆️   Ανέβασμα ${file}  →  "${match.nameEn}" (${match._id})`);

    const asset = await client.assets.upload('image', createReadStream(filePath), {
      filename: file,
      contentType: mimeType,
    });

    await client
      .patch(match._id)
      .set({ image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } })
      .commit();

    console.log(`✅  Έγινε`);
  }

  console.log('\n🎉  Ολοκληρώθηκε!');
}

run().catch((err) => {
  console.error('❌  Σφάλμα:', err.message);
  process.exit(1);
});
