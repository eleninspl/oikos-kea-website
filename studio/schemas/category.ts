import { defineField, defineType } from 'sanity'
import { ThLargeIcon, CogIcon, PackageIcon } from '@sanity/icons'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { menuItem } from './menuItem'
import { subsection } from './subsection'

export const category = defineType({
  name: 'category',
  title: 'Κατηγορία',
  type: 'document',
  icon: ThLargeIcon,
  groups: [
    { name: 'content', title: 'Προϊόντα', icon: PackageIcon, default: true },
    { name: 'settings', title: 'Ρυθμίσεις', icon: CogIcon },
  ],
  preview: {
    select: {
      title: 'titleEl', hidden: 'hidden',
      menuLabel: 'menu.labelEl',
      items: 'items', subs: 'subsections',
    },
    prepare({ title, hidden, menuLabel, items, subs }) {
      const count =
        (items?.length ?? 0) +
        ((subs as any[]) ?? []).reduce((a, s) => a + (s?.items?.length ?? 0), 0)
      const subtitle = [menuLabel, `${count} προϊόντα`].filter(Boolean).join('   ·   ')
      return {
        title: hidden ? `${title}  (κρυφή)` : title,
        subtitle,
      }
    },
  },
  orderings: [orderRankOrdering],
  fields: [
    // Κρυφό πεδίο που κρατά τη σειρά από το drag & drop
    orderRankField({ type: 'category' }),
    // Παλιό αριθμητικό πεδίο — κρυμμένο, μένει μόνο για ιστορικούς λόγους
    defineField({ name: 'order', title: 'Σειρά (παλιό)', type: 'number', hidden: true, readOnly: true }),
    // ── Περιεχόμενο: ό,τι αλλάζει ο ιδιοκτήτης καθημερινά ──
    defineField({
      name: 'titleEl',
      title: 'Όνομα Κατηγορίας (ΕΛ)',
      type: 'string',
      group: 'content',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'titleEn',
      title: 'Category Name (EN)',
      type: 'string',
      group: 'content',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'items',
      title: 'Προϊόντα',
      type: 'array',
      of: [{ type: menuItem.name }],
      group: 'content',
      description: 'Τα προϊόντα της κατηγορίας. Σύρε για αναδιάταξη. (Χρησιμοποίησε αυτό Ή τις Υποομάδες, όχι και τα δύο.)',
      hidden: ({ parent }) => !!(parent as any)?.subsections?.length,
    }),
    defineField({
      name: 'subsections',
      title: 'Υποομάδες',
      type: 'array',
      of: [{ type: subsection.name }],
      group: 'content',
      description: 'Για κατηγορίες με υποδιαιρέσεις (π.χ. Milkshakes / Smoothies)',
      hidden: ({ parent }) => !!(parent as any)?.items?.length,
    }),

    // ── Ρυθμίσεις: σπάνια αλλάζουν ──
    defineField({
      name: 'menu',
      title: 'Καρτέλα',
      type: 'reference',
      to: [{ type: 'menu' }],
      group: 'settings',
      validation: (r) => r.required(),
      description: 'Σε ποια καρτέλα του μενού ανήκει αυτή η κατηγορία',
    }),
    defineField({
      name: 'hidden',
      title: 'Απόκρυψη κατηγορίας',
      type: 'boolean',
      group: 'settings',
      description: 'Αν είναι ενεργό, δεν εμφανίζεται στο site',
      initialValue: false,
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
