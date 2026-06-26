import { defineField, defineType } from 'sanity'
import { menuItem } from './menuItem'
import { subsection } from './subsection'

export const category = defineType({
  name: 'category',
  title: 'Κατηγορία',
  type: 'document',
  preview: {
    select: { title: 'titleEl', hidden: 'hidden', m0: 'menus.0.labelEl', m1: 'menus.1.labelEl' },
    prepare({ title, hidden, m0, m1 }) {
      const where = [m0, m1].filter(Boolean).join(', ')
      return {
        title: hidden ? `${title}  (κρυφή)` : title,
        subtitle: where,
      }
    },
  },
  orderings: [
    { title: 'Σειρά', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  fields: [
    defineField({
      name: 'titleEl',
      title: 'Όνομα Κατηγορίας (ΕΛ)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'titleEn',
      title: 'Category Name (EN)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'menus',
      title: 'Εμφανίζεται σε',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'menu' }] }],
      validation: (r) => r.required().min(1),
      description: 'Σε ποια καρτέλα/καρτέλες ανήκει (π.χ. τα κρασιά → All Day + Κουζίνα)',
    }),
    defineField({
      name: 'order',
      title: 'Σειρά',
      type: 'number',
      description: 'Μικρότερος αριθμός = εμφανίζεται πρώτη',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'hidden',
      title: 'Κρυφή κατηγορία',
      type: 'boolean',
      description: 'Αν είναι ενεργό, δεν εμφανίζεται στο site',
      initialValue: false,
    }),
    defineField({
      name: 'items',
      title: 'Προϊόντα',
      type: 'array',
      of: [{ type: menuItem.name }],
      description: 'Τα προϊόντα της κατηγορίας. (Χρησιμοποίησε αυτό Ή τις Υποομάδες, όχι και τα δύο)',
      hidden: ({ parent }) => !!(parent as any)?.subsections?.length,
    }),
    defineField({
      name: 'subsections',
      title: 'Υποομάδες',
      type: 'array',
      of: [{ type: subsection.name }],
      description: 'Για κατηγορίες με υποδιαιρέσεις (π.χ. Milkshakes / Smoothies)',
      hidden: ({ parent }) => !!(parent as any)?.items?.length,
    }),
  ],
  validation: (r) =>
    r.custom((value: any) => {
      const hasItems = value?.items?.length > 0
      const hasSubs = value?.subsections?.length > 0
      if (hasItems && hasSubs) return 'Διάλεξε είτε Προϊόντα είτε Υποομάδες — όχι και τα δύο'
      if (!hasItems && !hasSubs) return 'Πρόσθεσε Προϊόντα ή Υποομάδες'
      return true
    }),
})
