import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import type { StructureBuilder } from 'sanity/structure'
import { schemaTypes } from './schemas'
import { oikosTheme } from './theme'
import { Logo } from './components/Logo'
import { HelpGuide } from './components/HelpGuide'

// ─── Sidebar structure ────────────────────────────────────────────────────────
// «Προϊόντα ανά menu»: δυναμικό drill-down — καρτέλα → κατηγορίες της → προϊόντα.
// «Καρτέλες» & «Όλες οι κατηγορίες»: διαχείριση δομής.
const structure = (S: StructureBuilder) =>
  S.list()
    .title('Μενού OIKOS')
    .items([
      S.listItem()
        .title('Οδηγίες Χρήσης')
        .child(S.component(HelpGuide).title('Οδηγίες Χρήσης')),
      S.divider(),
      // Καθημερινή χρήση: διάλεξε καρτέλα → δες τις κατηγορίες της → άνοιξε προϊόντα
      S.listItem()
        .title('Προϊόντα (ανά καρτέλα)')
        .child(
          S.documentTypeList('menu')
            .title('Διάλεξε καρτέλα')
            .defaultOrdering([{ field: 'order', direction: 'asc' }])
            .child((menuId) =>
              S.documentList()
                .title('Κατηγορίες')
                .schemaType('category')
                .filter('_type == "category" && $menuId in menus[]._ref')
                .params({ menuId })
                .defaultOrdering([{ field: 'order', direction: 'asc' }])
            )
        ),
      S.divider(),
      // Διαχείριση δομής
      S.listItem()
        .title('Καρτέλες (Menu)')
        .child(
          S.documentTypeList('menu')
            .title('Καρτέλες')
            .defaultOrdering([{ field: 'order', direction: 'asc' }])
        ),
      S.listItem()
        .title('Όλες οι κατηγορίες')
        .child(
          S.documentTypeList('category')
            .title('Όλες οι κατηγορίες')
            .defaultOrdering([{ field: 'order', direction: 'asc' }])
        ),
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
