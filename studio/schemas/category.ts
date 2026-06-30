import { defineField, defineType } from 'sanity';
import { ThLargeIcon, CogIcon } from '@sanity/icons';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';
import { TranslateInput } from '../components/TranslateInput';

export const category = defineType({
  name: 'category',
  title: 'Κατηγορία',
  type: 'document',
  icon: ThLargeIcon,
  groups: [
    { name: 'content', title: 'Βασικά', default: true },
    { name: 'settings', title: 'Ρυθμίσεις', icon: CogIcon },
  ],
  preview: {
    select: { title: 'titleEl', hidden: 'hidden', menuLabel: 'menu.labelEl', media: 'image' },
    prepare({ title, hidden, menuLabel, media }) {
      return {
        title: hidden ? `${title}  (κρυφή)` : title,
        subtitle: menuLabel,
        media,
      };
    },
  },
  orderings: [orderRankOrdering],
  fieldsets: [
    { name: 'titles', title: ' ', options: { columns: 2 } },
    { name: 'notes', title: ' ', options: { columns: 2 } },
  ],
  fields: [
    orderRankField({ type: 'category' }),
    defineField({
      name: 'order',
      title: 'Σειρά (παλιό)',
      type: 'number',
      hidden: true,
      readOnly: true,
    }),

    // ── Βασικά ──
    defineField({
      name: 'titleEl',
      title: 'Όνομα Κατηγορίας (ΕΛ)',
      type: 'string',
      group: 'content',
      fieldset: 'titles',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'titleEn',
      title: 'Category Name (EN)',
      type: 'string',
      group: 'content',
      fieldset: 'titles',
      components: { input: TranslateInput },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'noteEl',
      title: 'Σημείωση (ΕΛ)',
      type: 'string',
      group: 'content',
      fieldset: 'notes',
      description: 'Προαιρετικό κείμενο κάτω από τον τίτλο (π.χ. «όλα τα milkshakes €6,50»).',
    }),
    defineField({
      name: 'noteEn',
      title: 'Note (EN)',
      type: 'string',
      group: 'content',
      fieldset: 'notes',
      components: { input: TranslateInput },
    }),
    defineField({
      name: 'image',
      title: 'Εικόνα κατηγορίας',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      description: 'Προαιρετική — δεν χρειάζεται για τη λειτουργία.',
    }),

    // ── Ρυθμίσεις ──
    defineField({
      name: 'menu',
      title: 'Καρτέλα',
      type: 'reference',
      to: [{ type: 'menu' }],
      group: 'settings',
      validation: (r) => r.required(),
      description: 'Σε ποια καρτέλα του μενού ανήκει αυτή η κατηγορία.',
    }),
    defineField({
      name: 'hidden',
      title: 'Απόκρυψη κατηγορίας',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
      description: 'Αν είναι ενεργό, δεν εμφανίζεται στο site.',
    }),
  ],
});
