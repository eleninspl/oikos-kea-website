import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  // Υποτομέας *.sanity.studio για το `sanity deploy` — παρακάμπτεται με env (template).
  studioHost: process.env.SANITY_STUDIO_HOST ?? 'oikos-kea',
});
