import { defineField, defineType } from 'sanity'

const TAG_OPTIONS = [
  { title: 'Vegetarian', value: 'vegetarian' },
  { title: 'Vegan', value: 'vegan' },
  { title: 'Spicy', value: 'spicy' },
  { title: 'New', value: 'new' },
  { title: 'Popular', value: 'popular' },
  { title: 'Gluten-Free', value: 'gluten-free' },
]

export const menuItem = defineType({
  name: 'menuItem',
  title: 'Προϊόν',
  type: 'object',
  preview: {
    select: { title: 'nameEl', subtitle: 'price' },
  },
  fields: [
    // ─── Names ────────────────────────────────────────────────────────────────
    defineField({
      name: 'nameEl',
      title: 'Όνομα (ΕΛ)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'nameEn',
      title: 'Name (EN)',
      type: 'string',
      validation: (r) => r.required(),
    }),

    // ─── Descriptions ─────────────────────────────────────────────────────────
    defineField({
      name: 'descEl',
      title: 'Περιγραφή / Υλικά (ΕΛ)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'descEn',
      title: 'Description / Ingredients (EN)',
      type: 'text',
      rows: 2,
    }),

    // ─── Wine info ─────────────────────────────────────────────────────────────
    defineField({
      name: 'infoEl',
      title: 'Πληροφορίες Κρασιού (ΕΛ)',
      type: 'string',
      description: 'Ποικιλία + Κτήμα — μόνο για κρασιά',
    }),
    defineField({
      name: 'infoEn',
      title: 'Wine Info (EN)',
      type: 'string',
      description: 'Variety + Winery — only for wines',
    }),

    // ─── Pricing ──────────────────────────────────────────────────────────────
    defineField({
      name: 'price',
      title: 'Τιμή',
      type: 'string',
      description: 'π.χ. €13  ή  Sashimi €7  ή  €24 (μπουκάλι)',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'priceAlt',
      title: 'Τιμή Β (π.χ. Nigiri)',
      type: 'string',
      description: 'Δεύτερη τιμή — μόνο για Sashimi/Nigiri (π.χ. Nigiri €8)',
    }),
    defineField({
      name: 'glass',
      title: 'Τιμή Ποτηριού',
      type: 'string',
      description: 'Τιμή ποτηριού — μόνο για κρασιά (π.χ. €7)',
    }),

    // ─── Tags ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: TAG_OPTIONS,
        layout: 'grid',
      },
    }),

    // ─── Visibility ───────────────────────────────────────────────────────────
    defineField({
      name: 'hidden',
      title: 'Κρυφό',
      type: 'boolean',
      description: 'Αν είναι ενεργό, δεν εμφανίζεται στο site',
      initialValue: false,
    }),
  ],
})
