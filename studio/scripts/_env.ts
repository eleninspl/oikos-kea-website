// ─────────────────────────────────────────────────────────────────────────────
//  Κοινό περιβάλλον για τα maintenance scripts του studio.
//  Το projectId / dataset διαβάζονται ΑΠΟΚΛΕΙΣΤΙΚΑ από env — κανένα hardcoded id.
//  Αν λείπει το projectId, ρίχνουμε σαφές σφάλμα (fail fast) αντί να τρέξουμε
//  σιωπηλά σε λάθος project.
//
//  Χρήση:  SANITY_STUDIO_PROJECT_ID=xxxx SANITY_WRITE_TOKEN=sk... \
//            npx tsx scripts/<script>.ts
// ─────────────────────────────────────────────────────────────────────────────
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;

if (!projectId) {
  throw new Error(
    'Λείπει το SANITY_STUDIO_PROJECT_ID. Όρισέ το στο studio/.env (δες studio/.env.example) ' +
      'ή πέρνα το inline: SANITY_STUDIO_PROJECT_ID=xxxx npx tsx scripts/<script>.ts',
  );
}

export const PROJECT_ID = projectId;
export const DATASET = process.env.SANITY_STUDIO_DATASET ?? 'production';
