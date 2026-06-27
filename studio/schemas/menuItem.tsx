import React from 'react';
import { defineField, defineType } from 'sanity';
import { TagIcon, CogIcon } from '@sanity/icons';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';
import { TranslateInput } from '../components/TranslateInput';

// Ετικέτες (διατροφικές / marketing) και αλλεργιογόνα — δίγλωσσα.
export const LABELS = [
  { value: 'vegetarian', el: 'Χορτοφαγικό', en: 'Vegetarian' },
  { value: 'vegan', el: 'Vegan', en: 'Vegan' },
  { value: 'spicy', el: 'Πικάντικο', en: 'Spicy' },
  { value: 'gluten-free', el: 'Χωρίς γλουτένη', en: 'Gluten-free' },
  { value: 'new', el: 'Νέο', en: 'New' },
  { value: 'popular', el: 'Δημοφιλές', en: 'Popular' },
  { value: 'signature', el: 'Signature', en: 'Signature' },
];
export const ALLERGENS = [
  { value: 'gluten', el: 'Γλουτένη', en: 'Gluten' },
  { value: 'crustaceans', el: 'Οστρακοειδή', en: 'Crustaceans' },
  { value: 'eggs', el: 'Αυγά', en: 'Eggs' },
  { value: 'fish', el: 'Ψάρι', en: 'Fish' },
  { value: 'peanuts', el: 'Φιστίκια', en: 'Peanuts' },
  { value: 'soy', el: 'Σόγια', en: 'Soy' },
  { value: 'milk', el: 'Γάλα', en: 'Milk' },
  { value: 'nuts', el: 'Ξηροί καρποί', en: 'Nuts' },
  { value: 'celery', el: 'Σέλινο', en: 'Celery' },
  { value: 'mustard', el: 'Μουστάρδα', en: 'Mustard' },
  { value: 'sesame', el: 'Σουσάμι', en: 'Sesame' },
  { value: 'sulphites', el: 'Θειώδη', en: 'Sulphites' },
  { value: 'lupin', el: 'Λούπινο', en: 'Lupin' },
  { value: 'molluscs', el: 'Μαλάκια', en: 'Molluscs' },
];

function StatusDot({ hidden, available }: { hidden?: boolean; available?: boolean }) {
  const color = hidden ? '#5a5550' : available === false ? '#e0a458' : '#c9a96e';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
    </div>
  );
}

export const menuItem = defineType({
  name: 'menuItem',
  title: 'Προϊόν',
  type: 'document',
  icon: TagIcon,
  groups: [
    { name: 'content', title: 'Βασικά', default: true },
    { name: 'pricing', title: 'Τιμές' },
    { name: 'details', title: 'Ετικέτες & Έξτρα' },
    { name: 'settings', title: 'Ρυθμίσεις', icon: CogIcon },
  ],
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'menuItem' }),

    // ── Βασικά ──
    defineField({
      name: 'nameEl',
      title: 'Όνομα (ΕΛ)',
      type: 'string',
      group: 'content',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'nameEn',
      title: 'Name (EN)',
      type: 'string',
      group: 'content',
      components: { input: TranslateInput },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      title: 'Φωτογραφία',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Περιγραφή εικόνας (alt)', type: 'string' }],
      description: 'Προαιρετική φωτογραφία του προϊόντος.',
    }),
    defineField({
      name: 'descEl',
      title: 'Περιγραφή / Υλικά (ΕΛ)',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'descEn',
      title: 'Description / Ingredients (EN)',
      type: 'text',
      rows: 2,
      group: 'content',
      components: { input: TranslateInput },
    }),

    // ── Τιμές ──
    defineField({
      name: 'prices',
      title: 'Τιμές',
      type: 'array',
      group: 'pricing',
      description:
        'Μία τιμή για απλά προϊόντα. Πρόσθεσε παραλλαγές για ποτήρι/μπουκάλι, μεγέθη κ.λπ. — η ετικέτα είναι προαιρετική.',
      of: [
        {
          type: 'object',
          name: 'priceVariant',
          fields: [
            { name: 'labelEl', title: 'Ετικέτα (ΕΛ)', type: 'string' },
            {
              name: 'labelEn',
              title: 'Label (EN)',
              type: 'string',
              components: { input: TranslateInput },
            },
            {
              name: 'amount',
              title: 'Τιμή (€)',
              type: 'number',
              validation: (r: any) => r.required().min(0),
            },
          ],
          preview: {
            select: { l: 'labelEl', a: 'amount' },
            prepare: ({ l, a }: any) => ({
              title: [l, a != null ? `€${a}` : ''].filter(Boolean).join(' — ') || 'Τιμή',
            }),
          },
        },
      ],
    }),
    defineField({
      name: 'priceNote',
      title: 'Σημείωση τιμής',
      type: 'string',
      group: 'pricing',
      description: 'Προαιρετικό (π.χ. «τιμή ημέρας»).',
    }),

    // ── Ετικέτες & Έξτρα ──
    defineField({
      name: 'labels',
      title: 'Ετικέτες',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      options: {
        list: LABELS.map((l) => ({ title: `${l.el} / ${l.en}`, value: l.value })),
        layout: 'grid',
      },
    }),
    defineField({
      name: 'allergens',
      title: 'Αλλεργιογόνα',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
      options: {
        list: ALLERGENS.map((a) => ({ title: `${a.el} / ${a.en}`, value: a.value })),
        layout: 'grid',
      },
    }),
    defineField({
      name: 'extras',
      title: 'Έξτρα / Προσθήκες',
      type: 'array',
      group: 'details',
      description: 'Προαιρετικές προσθήκες με χρέωση (π.χ. +σολομός €2).',
      of: [
        {
          type: 'object',
          name: 'extra',
          fields: [
            {
              name: 'labelEl',
              title: 'Όνομα (ΕΛ)',
              type: 'string',
              validation: (r: any) => r.required(),
            },
            {
              name: 'labelEn',
              title: 'Name (EN)',
              type: 'string',
              components: { input: TranslateInput },
            },
            {
              name: 'surcharge',
              title: 'Χρέωση (€)',
              type: 'number',
              validation: (r: any) => r.min(0),
            },
          ],
          preview: {
            select: { l: 'labelEl', s: 'surcharge' },
            prepare: ({ l, s }: any) => ({
              title: [l, s ? `+€${s}` : ''].filter(Boolean).join('  '),
            }),
          },
        },
      ],
    }),

    // ── Ρυθμίσεις ──
    defineField({
      name: 'category',
      title: 'Κατηγορία',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'settings',
      validation: (r) => r.required(),
      description: 'Σε ποια κατηγορία ανήκει το προϊόν.',
    }),
    defineField({
      name: 'available',
      title: 'Διαθέσιμο',
      type: 'boolean',
      group: 'settings',
      initialValue: true,
      description: 'Ξεμάρκαρε για «εξαντλήθηκε / εκτός εποχής» — μένει στη λίστα, γκριζαρισμένο.',
    }),
    defineField({
      name: 'hidden',
      title: 'Απόκρυψη',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
      description: 'Κρύβει τελείως το προϊόν από το site.',
    }),
  ],
  preview: {
    select: {
      nameEl: 'nameEl',
      media: 'image',
      hidden: 'hidden',
      available: 'available',
      p0: 'prices.0.amount',
      cat: 'category.titleEl',
      labels: 'labels',
    },
    prepare({ nameEl, media, hidden, available, p0, cat, labels }) {
      const price = p0 != null ? `€${p0}` : '';
      const flags = [hidden ? 'κρυφό' : null, available === false ? 'εξαντλήθηκε' : null]
        .filter(Boolean)
        .join(' · ');
      const title =
        [nameEl, price].filter(Boolean).join('   —   ') + (flags ? `   (${flags})` : '');
      const subtitle = [cat, Array.isArray(labels) && labels.length ? labels.join(', ') : null]
        .filter(Boolean)
        .join('   ·   ');
      return {
        title,
        subtitle,
        media: media || <StatusDot hidden={hidden} available={available} />,
      };
    },
  },
});
