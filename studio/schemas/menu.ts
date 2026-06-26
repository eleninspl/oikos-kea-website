import { defineField, defineType } from 'sanity'

// Top-level καρτέλα του μενού (All Day, Cocktails, …). Ο ιδιοκτήτης μπορεί να
// προσθέτει/μετονομάζει/αναδιατάσσει καρτέλες ελεύθερα.
export const menu = defineType({
  name: 'menu',
  title: 'Καρτέλα (Menu)',
  type: 'document',
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
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'labelEn',
      title: 'Name (EN)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'key',
      title: 'Κωδικός',
      type: 'slug',
      options: { source: 'labelEn', maxLength: 30 },
      description: 'Σταθερό αναγνωριστικό — δημιουργείται αυτόματα, μην το αλλάζεις μετά',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Σειρά',
      type: 'number',
      description: 'Μικρότερος αριθμός = πιο αριστερά',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'hidden',
      title: 'Κρυφή καρτέλα',
      type: 'boolean',
      description: 'Αν είναι ενεργό, η καρτέλα δεν εμφανίζεται στο site',
      initialValue: false,
    }),
  ],
})
