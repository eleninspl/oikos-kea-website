import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import type { StructureBuilder, StructureResolverContext } from 'sanity/structure'
import { orderableDocumentListDeskItem, orderRankOrdering } from '@sanity/orderable-document-list'
import { HelpCircleIcon, DocumentTextIcon, ControlsIcon, CogIcon } from '@sanity/icons'
import { schemaTypes } from './schemas'
import { oikosTheme } from './theme'
import { Logo } from './components/Logo'
import { HelpGuide } from './components/HelpGuide'

// ─── Sidebar structure ────────────────────────────────────────────────────────
// Ένας ξεκάθαρος κύριος δρόμος («Το Μενού μου»: καρτέλα → κατηγορίες → προϊόντα,
// με drag & drop αναδιάταξη) και ένα τυλιγμένο «Ρυθμίσεις δομής» για τα σπάνια.
const structure = (S: StructureBuilder, context: StructureResolverContext) =>
  S.list()
    .title('Μενού OIKOS')
    .items([
      // Καθημερινή χρήση: διάλεξε καρτέλα → σύρε/άνοιξε τις κατηγορίες της → προϊόντα
      S.listItem()
        .title('Το Μενού μου')
        .icon(DocumentTextIcon)
        .child(
          S.documentTypeList('menu')
            .title('Διάλεξε καρτέλα')
            .defaultOrdering(orderRankOrdering.by)
            .child((menuId) =>
              // Per-menu λίστα κατηγοριών με drag & drop (το .child του orderable deskItem)
              orderableDocumentListDeskItem({
                type: 'category',
                title: 'Κατηγορίες — σύρε για σειρά',
                filter: 'menu._ref == $menuId',
                params: { menuId },
                id: `ordered-categories-${menuId}`,
                S,
                context,
              }).child
            )
        ),
      S.divider(),
      // Σπάνια χρήση — τυλιγμένα σε μία ομάδα ώστε να μην μπερδεύουν
      S.listItem()
        .title('Ρυθμίσεις δομής')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Ρυθμίσεις δομής')
            .items([
              // Drag & drop αναδιάταξη των καρτελών (tabs)
              orderableDocumentListDeskItem({
                type: 'menu',
                title: 'Καρτέλες — σύρε για σειρά',
                icon: ControlsIcon,
                id: 'ordered-menus',
                S,
                context,
              }),
            ])
        ),
      S.divider(),
      S.listItem()
        .title('Οδηγίες Χρήσης')
        .icon(HelpCircleIcon)
        .child(S.component(HelpGuide).title('Οδηγίες Χρήσης')),
    ])

export default defineConfig({
  name: 'oikos-kea',
  title: 'OIKOS Μενού',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',

  theme: oikosTheme,
  studio: {
    components: {
      logo: Logo,
    },
  },

  plugins: [structureTool({ structure })],

  schema: {
    types: schemaTypes,
  },
})
