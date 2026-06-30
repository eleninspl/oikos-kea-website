import { definePlugin } from 'sanity';
import type { LayoutProps } from 'sanity';

const css = `
  /* ── Compact OIKOS Studio ── */

  /* Shrink the huge document preview title */
  [data-testid="document-panel-document-title"] {
    padding-top: 10px !important;
    padding-bottom: 2px !important;
    min-height: unset !important;
  }
  [data-testid="document-panel-document-title"] [data-ui="Heading"] {
    font-size: 1.05rem !important;
    line-height: 1.3 !important;
  }

  /* Tighter gap between form fields in the document panel */
  [data-testid="document-panel-scroller"] [data-ui="Stack"] {
    gap: 10px !important;
  }

  /* Label → input gap inside each FormField */
  [data-ui="FormField"] > [data-ui="Stack"] {
    gap: 3px !important;
  }

  /* Reduce top/bottom padding of the form scroll area */
  [data-testid="document-panel-scroller"] > div:first-child {
    padding-top: 12px !important;
    padding-bottom: 24px !important;
  }

  /* Tighter field-group tabs row (Βασικά | Τιμές | ...) */
  [data-testid="field-group-tabs"] {
    margin-bottom: 4px !important;
  }
  [data-testid="field-group-tabs"] [data-ui="Stack"] {
    gap: 2px !important;
  }

  /* Collapse any extra padding in the form column */
  [data-testid="document-panel-form"] > [data-ui="Box"] {
    padding-top: 8px !important;
    padding-bottom: 8px !important;
  }

  /* Textarea: less height by default */
  [data-ui="TextArea"] {
    min-height: 52px !important;
  }

  /* Sidebar pane list items — slightly tighter */
  [data-ui="PaneContent"] [data-ui="Stack"] {
    gap: 0 !important;
  }
`;

function CompactLayout(props: LayoutProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {props.renderDefault(props)}
    </>
  );
}

export const compactUiPlugin = definePlugin({
  name: 'oikos-compact-ui',
  studio: {
    components: {
      layout: CompactLayout,
    },
  },
});
