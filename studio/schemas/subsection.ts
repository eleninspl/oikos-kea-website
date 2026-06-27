import { defineField, defineType } from 'sanity'
import { TranslateInput } from '../components/TranslateInput'
import { menuItem } from './menuItem'

export const subsection = defineType({
  name: 'subsection',
  title: 'Υποκατηγορία',
  type: 'object',
  preview: {
    select: { title: 'titleEl', price: 'sectionPrice', hidden: 'hidden', items: 'items' },
    prepare({ title, price, hidden, items }) {
      const count = (items as any[])?.length ?? 0
      const subtitle = [price, `${count} προϊόντα`].filter(Boolean).join('   ·   ')
      return {
        title: (title ?? '(χωρίς τίτλο)') + (hidden ? '  (κρυφή)' : ''),
        subtitle,
      }
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
      components: { input: TranslateInput },
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
