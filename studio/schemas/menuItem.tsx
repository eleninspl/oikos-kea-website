import React from 'react'
import { defineField, defineType } from 'sanity'

const TAG_OPTIONS = [
  { title: 'Vegetarian', value: 'vegetarian' },
  { title: 'Vegan', value: 'vegan' },
  { title: 'Spicy', value: 'spicy' },
  { title: 'New', value: 'new' },
  { title: 'Popular', value: 'popular' },
  { title: 'Gluten-Free', value: 'gluten-free' },
]

// ── Τελεία κατάστασης για τη λίστα προϊόντων (χρυσή = ορατό, γκρι = κρυφό) ─────
function StatusDot({ hidden }: { hidden?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: hidden ? '#5a5550' : '#c9a96e',
          boxShadow: hidden ? 'none' : '0 0 0 3px rgba(201,169,110,0.18)',
        }}
      />
    </div>
  )
}

export const menuItem = defineType({
  name: 'menuItem',
  title: 'Προϊόν',
  type: 'object',
  // Συμπαγής φόρμα: τα βασικά πάνω, οι λεπτομέρειες σε συμπτυσσόμενες ομάδες
  fieldsets: [
    { name: 'details', title: 'Περιγραφή & Tags', options: { collapsible: true, collapsed: true } },
    { name: 'special', title: 'Ειδικά (κρασί / sushi)', options: { collapsible: true, collapsed: true } },
  ],
  preview: {
    select: {
      nameEl: 'nameEl',
      nameEn: 'nameEn',
      price: 'price',
      priceAlt: 'priceAlt',
      glass: 'glass',
      hidden: 'hidden',
      tags: 'tags',
    },
    prepare({ nameEl, nameEn, price, priceAlt, glass, hidden, tags }) {
      const priceLabel = [price, priceAlt].filter(Boolean).join(' / ')
      const extras: string[] = []
      if (nameEn && nameEn !== nameEl) extras.push(nameEn)
      if (glass) extras.push(`ποτ. ${glass}`)
      if (Array.isArray(tags) && tags.length) extras.push(tags.join(' · '))
      const title = [nameEl, priceLabel].filter(Boolean).join('   —   ')
      return {
        title: hidden ? `${title}   (κρυφό)` : title,
        subtitle: extras.join('   ·   '),
        media: <StatusDot hidden={hidden} />,
      }
    },
  },
  fields: [
    // ── Βασικά (πάντα ορατά) ──
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
    defineField({
      name: 'price',
      title: 'Τιμή',
      type: 'string',
      description: 'π.χ. €13  ή  Sashimi €7  ή  €24 (μπουκάλι)',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'hidden',
      title: 'Κρυφό (δεν εμφανίζεται στο site)',
      type: 'boolean',
      initialValue: false,
    }),

    // ── Περιγραφή & Tags ──
    defineField({
      name: 'descEl',
      title: 'Περιγραφή / Υλικά (ΕΛ)',
      type: 'text',
      rows: 2,
      fieldset: 'details',
    }),
    defineField({
      name: 'descEn',
      title: 'Description / Ingredients (EN)',
      type: 'text',
      rows: 2,
      fieldset: 'details',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: TAG_OPTIONS, layout: 'grid' },
      fieldset: 'details',
    }),

    // ── Ειδικά (κρασί / sushi) ──
    defineField({
      name: 'infoEl',
      title: 'Πληροφορίες Κρασιού (ΕΛ)',
      type: 'string',
      description: 'Ποικιλία + Κτήμα — μόνο για κρασιά',
      fieldset: 'special',
    }),
    defineField({
      name: 'infoEn',
      title: 'Wine Info (EN)',
      type: 'string',
      description: 'Variety + Winery — only for wines',
      fieldset: 'special',
    }),
    defineField({
      name: 'glass',
      title: 'Τιμή Ποτηριού',
      type: 'string',
      description: 'Μόνο για κρασιά (π.χ. €7)',
      fieldset: 'special',
    }),
    defineField({
      name: 'priceAlt',
      title: 'Τιμή Β (π.χ. Nigiri)',
      type: 'string',
      description: 'Δεύτερη τιμή — μόνο για Sashimi/Nigiri (π.χ. Nigiri €8)',
      fieldset: 'special',
    }),
  ],
})
