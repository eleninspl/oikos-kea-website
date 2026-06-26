import { defineField, defineType } from 'sanity'

// Top-level καρτέλα του μενού (All Day, Cocktails, …). Ο ιδιοκτήτης μπορεί να
// προσθέτει/μετονομάζει/αναδιατάσσει καρτέλες ελεύθερα.
export const menu = defineType({
  name: 'menu',
  title: 'Καρτέλα (Menu)',
  type: 'document',
  preview: {
    select: { title: 'labelEl', subtitle: 'key.current', hidden: 'hidden' },
    prepare({ title, subtitle, hidden }) {
      return { title: hidden ? `${title}  (κρυφή)` : title, subtitle }
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
