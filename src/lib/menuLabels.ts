// Δίγλωσσες αντιστοιχίες ετικετών/αλλεργιογόνων (mirror του studio schema) +
// μορφοποίηση τιμής στο house format (€X / €X,XX).
import type { Lang } from '../i18n/utils';

export const LABEL_MAP: Record<string, { el: string; en: string }> = {
  vegetarian: { el: 'Χορτοφαγικό', en: 'Vegetarian' },
  vegan: { el: 'Vegan', en: 'Vegan' },
  spicy: { el: 'Πικάντικο', en: 'Spicy' },
  'gluten-free': { el: 'Χωρίς γλουτένη', en: 'Gluten-free' },
  new: { el: 'Νέο', en: 'New' },
  popular: { el: 'Δημοφιλές', en: 'Popular' },
  signature: { el: 'Signature', en: 'Signature' },
};

export const ALLERGEN_MAP: Record<string, { el: string; en: string }> = {
  gluten: { el: 'Γλουτένη', en: 'Gluten' },
  crustaceans: { el: 'Οστρακοειδή', en: 'Crustaceans' },
  eggs: { el: 'Αυγά', en: 'Eggs' },
  fish: { el: 'Ψάρι', en: 'Fish' },
  peanuts: { el: 'Φιστίκια', en: 'Peanuts' },
  soy: { el: 'Σόγια', en: 'Soy' },
  milk: { el: 'Γάλα', en: 'Milk' },
  nuts: { el: 'Ξηροί καρποί', en: 'Nuts' },
  celery: { el: 'Σέλινο', en: 'Celery' },
  mustard: { el: 'Μουστάρδα', en: 'Mustard' },
  sesame: { el: 'Σουσάμι', en: 'Sesame' },
  sulphites: { el: 'Θειώδη', en: 'Sulphites' },
  lupin: { el: 'Λούπινο', en: 'Lupin' },
  molluscs: { el: 'Μαλάκια', en: 'Molluscs' },
};

export const labelText = (v: string, lang: Lang) => LABEL_MAP[v]?.[lang] ?? v;
export const allergenText = (v: string, lang: Lang) => ALLERGEN_MAP[v]?.[lang] ?? v;

export function formatPrice(n: number): string {
  const eur = Math.trunc(n);
  const cents = Math.round((n - eur) * 100);
  return cents === 0 ? `€${eur}` : `€${eur},${String(cents).padStart(2, '0')}`;
}
