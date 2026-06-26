import { defineField, defineType } from 'sanity'
import { menuItem } from './menuItem'

export const subsection = defineType({
  name: 'subsection',
  title: 'Υποκατηγορία',
  type: 'object',
  preview: {
    select: { title: 'titleEl', subtitle: 'sectionPrice' },
    prepare({ title, subtitle }) {
      return { title: title ?? '(χωρίς τίτλο)', subtitle }
    },
  },
  fields: [
    defineField({
      name: 'titleEl',
      title: 'Τίτλος (ΕΛ)',
      type: 'string',
      description: 'Προαιρετικό — μερικές υποκατηγορίες δεν έχουν τίτλο',
    }),
    defineField({
      name: 'titleEn',
      title: 'Title (EN)',
      type: 'string',
    }),
    defineField({
      name: 'sectionPrice',
      title: 'Τιμή Κατηγορίας',
      type: 'string',
      description: 'Κοινή τιμή για όλα τα items (π.χ. €6,50) — εμφανίζεται δίπλα στον τίτλο',
    }),
    defineField({
      name: 'hidden',
      title: 'Κρυφό',
      type: 'boolean',
      description: 'Κρύβει ολόκληρη την υποκατηγορία από το site',
      initialValue: false,
    }),
    defineField({
      name: 'items',
      title: 'Προϊόντα',
      type: 'array',
      of: [{ type: menuItem.name }],
      validation: (r) => r.required().min(1),
    }),
  ],
})
