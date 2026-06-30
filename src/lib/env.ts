// ─────────────────────────────────────────────────────────────────────────────
//  ENV VALIDATION — μία πηγή αλήθειας για τα environment variables.
//  Επικυρώνει τα required env vars στο build time και πετάει καθαρό σφάλμα, αντί
//  να αποτυγχάνει σιωπηλά βαθιά μέσα στο sanity.ts ή με κρυπτικό runtime error.
//
//  Σημείωση: στο Astro τα PUBLIC_* είναι διαθέσιμα μέσω import.meta.env, ενώ σε
//  καθαρά Node περιβάλλοντα (π.χ. scripts) μέσω process.env. Δοκιμάζουμε και τα δύο.
// ─────────────────────────────────────────────────────────────────────────────

function readEnv(key: string): string | undefined {
  return import.meta.env?.[key] ?? process.env[key] ?? undefined;
}

/** Διαβάζει ένα required env var· πετάει αν λείπει. */
export function requireEnv(key: string): string {
  const val = readEnv(key);
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

/** Διαβάζει ένα προαιρετικό env var· γυρίζει undefined αν λείπει. */
export function optionalEnv(key: string): string | undefined {
  return readEnv(key);
}

export const env = {
  sanity: {
    projectId: optionalEnv('PUBLIC_SANITY_PROJECT_ID'),
    dataset: optionalEnv('PUBLIC_SANITY_DATASET') ?? 'production',
    readToken: optionalEnv('SANITY_READ_TOKEN'),
  },
} as const;
