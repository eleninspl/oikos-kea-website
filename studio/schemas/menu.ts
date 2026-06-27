import { defineField, defineType } from 'sanity'
import { ControlsIcon, CogIcon } from '@sanity/icons'

// Top-level καρτέλα του μενού (All Day, Cocktails, …). Ο ιδιοκτήτης μπορεί να
// προσθέτει/μετονομάζει/αναδιατάσσει καρτέλες ελεύθερα.
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
    select: { title: 'labelEl', en: 'labelEn', order: 'order', hidden: 'hidden' },
    prepare({ title, en, order, hidden }) {
      const parts = [order != null ? `Σειρά ${order}` : null, en && en !== title ? en : null]
      return {
        title: hidden ? `${title}  (κρυφή)` : title,
        subtitle: parts.filter(Boolean).join('   ·   '),
      }
    },
  },
  orderings: [
    { title: 'Σειρά', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  fields: [
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
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Σειρά εμφάνισης',
      type: 'number',
      group: 'settings',
      description: 'Μικρότερος αριθμός = πιο αριστερά στο site',
      validation: (r) => r.required(),
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
})
