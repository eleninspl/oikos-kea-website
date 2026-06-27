import { defineField, defineType } from 'sanity';
import { ControlsIcon, CogIcon } from '@sanity/icons';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';
import { TranslateInput } from '../components/TranslateInput';

// Top-level καρτέλα του μενού (All Day, Cocktails, …). Ο ιδιοκτήτης μπορεί να
// προσθέτει/μετονομάζει/αναδιατάσσει (drag & drop) καρτέλες ελεύθερα.
export const menu = defineType({
  name: 'menu',
  title: 'Καρτέλα (Menu)',
  type: 'document',
  icon: ControlsIcon,
  groups: [
    { name: 'basic', title: 'Όνομα', default: true },
    { name: 'settings', title: 'Ρυθμίσεις', icon: CogIcon },
  ],
  preview: {
    select: { title: 'labelEl', en: 'labelEn', hidden: 'hidden' },
    prepare({ title, en, hidden }) {
      return {
        title: hidden ? `${title}  (κρυφή)` : title,
        subtitle: en && en !== title ? en : undefined,
      };
    },
  },
  orderings: [orderRankOrdering],
  fields: [
    // Κρυφό πεδίο που κρατά τη σειρά από το drag & drop
    orderRankField({ type: 'menu' }),
    // Παλιό αριθμητικό πεδίο — κρυμμένο, μένει μόνο για ιστορικούς λόγους
    defineField({
      name: 'order',
      title: 'Σειρά (παλιό)',
      type: 'number',
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: 'labelEl',
      title: 'Όνομα (ΕΛ)',
      type: 'string',
      group: 'basic',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'labelEn',
      title: 'Name (EN)',
      type: 'string',
      group: 'basic',
      components: { input: TranslateInput },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      title: 'Φωτογραφία καρτέλας',
      type: 'image',
      group: 'basic',
      options: { hotspot: true },
      description: 'Εμφανίζεται στο κουμπί της καρτέλας στο μενού. Ανέβασε ή σύρε μια φωτογραφία.',
    }),
    defineField({
      name: 'noteEl',
      title: 'Σημείωση (ΕΛ)',
      type: 'string',
      group: 'basic',
      description:
        'Προαιρετικό κείμενο κάτω από τον τίτλο της καρτέλας (π.χ. «Σερβίρεται 08.30–15.00»).',
    }),
    defineField({
      name: 'noteEn',
      title: 'Note (EN)',
      type: 'string',
      group: 'basic',
      components: { input: TranslateInput },
    }),
    defineField({
      name: 'hidden',
      title: 'Απόκρυψη καρτέλας',
      type: 'boolean',
      group: 'settings',
      description: 'Αν είναι ενεργό, η καρτέλα δεν εμφανίζεται στο site',
      initialValue: false,
    }),
    defineField({
      name: 'key',
      title: 'Κωδικός (τεχνικό)',
      type: 'slug',
      group: 'settings',
      options: { source: 'labelEn', maxLength: 30 },
      description: 'Σταθερό αναγνωριστικό — δημιουργείται αυτόματα. Μην το αλλάζεις.',
      readOnly: ({ value }) => !!value,
      validation: (r) => r.required(),
    }),
  ],
});
