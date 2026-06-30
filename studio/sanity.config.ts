import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import type { StructureBuilder, StructureResolverContext } from 'sanity/structure';
import { orderableDocumentListDeskItem, orderRankOrdering } from '@sanity/orderable-document-list';
import {
  HelpCircleIcon,
  DocumentTextIcon,
  ControlsIcon,
  ThLargeIcon,
  TagIcon,
} from '@sanity/icons';
import { schemaTypes } from './schemas';
import { oikosTheme } from './theme';
import { Logo } from './components/Logo';
import { HelpGuide } from './components/HelpGuide';
import { compactUiPlugin } from './plugins/compact-ui';

// ─── Sidebar structure ────────────────────────────────────────────────────────
// Κύριος δρόμος «Το Μενού μου»: καρτέλα → κατηγορία → προϊόντα (drag & drop).
// + ξεχωριστά: αναδιάταξη καρτελών/κατηγοριών, καθολική λίστα προϊόντων.
const structure = (S: StructureBuilder, context: StructureResolverContext) =>
  S.list()
    .title('Μενού OIKOS')
    .items([
      // Καθημερινή χρήση: καρτέλα → κατηγορία → προϊόντα (σύρε για σειρά)
      S.listItem()
        .title('Το Μενού μου')
        .icon(DocumentTextIcon)
        .child(
          S.documentTypeList('menu')
            .title('Διάλεξε καρτέλα')
            .defaultOrdering(orderRankOrdering.by)
            .child((menuId) =>
              S.documentList()
                .title('Διάλεξε κατηγορία')
                .schemaType('category')
                .filter('_type == "category" && menu._ref == $menuId')
                .params({ menuId })
                .defaultOrdering(orderRankOrdering.by)
                .child(
                  (catId) =>
                    // Προϊόντα της κατηγορίας με drag & drop (το .child του orderable deskItem)
                    orderableDocumentListDeskItem({
                      type: 'menuItem',
                      title: 'Προϊόντα',
                      filter: 'category._ref == $catId',
                      params: { catId },
                      id: `items-${catId}`,
                      S,
                      context,
                    }).child,
                ),
            ),
        ),
      S.divider(),
      // Αναδιάταξη καρτελών (tabs)
      orderableDocumentListDeskItem({
        type: 'menu',
        title: 'Καρτέλες',
        icon: ControlsIcon,
        id: 'ordered-menus',
        S,
        context,
      }),
      // Αναδιάταξη/επεξεργασία κατηγοριών
      orderableDocumentListDeskItem({
        type: 'category',
        title: 'Κατηγορίες',
        icon: ThLargeIcon,
        id: 'ordered-categories',
        S,
        context,
      }),
      // Καθολική λίστα προϊόντων (αναζήτηση)
      S.listItem()
        .title('Όλα τα προϊόντα')
        .icon(TagIcon)
        .child(S.documentTypeList('menuItem').title('Όλα τα προϊόντα')),
      S.divider(),
      S.listItem()
        .title('Οδηγίες Χρήσης')
        .icon(HelpCircleIcon)
        .child(S.component(HelpGuide).title('Οδηγίες Χρήσης')),
    ]);

// projectId ΑΠΟΚΛΕΙΣΤΙΚΑ από env — σαφές σφάλμα αν λείπει (αντί για σιωπηλή αποτυχία).
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
if (!projectId) {
  throw new Error(
    'Λείπει το SANITY_STUDIO_PROJECT_ID. Όρισέ το στο studio/.env (δες studio/.env.example).',
  );
}

export default defineConfig({
  name: 'oikos-kea',
  title: 'OIKOS Μενού',

  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',

  theme: oikosTheme,
  studio: {
    components: {
      logo: Logo,
    },
  },

  plugins: [structureTool({ structure }), compactUiPlugin()],

  schema: {
    types: schemaTypes,
  },
});
