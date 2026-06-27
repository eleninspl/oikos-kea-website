import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import type { StructureBuilder } from 'sanity/structure'
import { HelpCircleIcon, DocumentTextIcon, ControlsIcon, ThLargeIcon, CogIcon } from '@sanity/icons'
import { schemaTypes } from './schemas'
import { oikosTheme } from './theme'
import { Logo } from './components/Logo'
import { HelpGuide } from './components/HelpGuide'

const byOrder = [{ field: 'order', direction: 'asc' as const }]

// ─── Sidebar structure ────────────────────────────────────────────────────────
// Ένας ξεκάθαρος κύριος δρόμος («Το Μενού μου»: καρτέλα → κατηγορίες → προϊόντα)
// και ένα τυλιγμένο «Ρυθμίσεις δομής» για τα σπάνια.
const structure = (S: StructureBuilder) =>
  S.list()
    .title('Μενού OIKOS')
    .items([
      // Καθημερινή χρήση: διάλεξε καρτέλα → δες τις κατηγορίες της → άνοιξε προϊόντα
      S.listItem()
        .title('Το Μενού μου')
        .icon(DocumentTextIcon)
        .child(
          S.documentTypeList('menu')
            .title('Διάλεξε καρτέλα')
            .defaultOrdering(byOrder)
            .child((menuId) =>
              S.documentList()
                .title('Κατηγορίες')
                .schemaType('category')
                .filter('_type == "category" && (menu._ref == $menuId || $menuId in menus[]._ref)')
                .params({ menuId })
                .defaultOrdering(byOrder)
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
              S.listItem()
                .title('Καρτέλες (Menu)')
                .icon(ControlsIcon)
                .child(S.documentTypeList('menu').title('Καρτέλες').defaultOrdering(byOrder)),
              S.listItem()
                .title('Όλες οι κατηγορίες')
                .icon(ThLargeIcon)
                .child(S.documentTypeList('category').title('Όλες οι κατηγορίες').defaultOrdering(byOrder)),
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
