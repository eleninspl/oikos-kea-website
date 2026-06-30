import { definePlugin } from 'sanity';
import type { LayoutProps } from 'sanity';

const css = `
  /* ── Compact OIKOS Studio ── */

  /* Hide the "All fields" tab — we have proper groups */
  [data-testid="field-group-tabs"] button:first-of-type {
    display: none !important;
  }

  /* Shrink the large document heading inside the form body */
  [data-testid="document-panel-scroller"] [data-ui="Heading"] {
    font-size: 1.15rem !important;
    line-height: 1.3 !important;
  }

  /* Reduce the "Προϊόν" sub-label above the heading */
  [data-testid="document-panel-scroller"] [data-ui="Text"][data-size="1"] {
    font-size: 0.7rem !important;
    opacity: 0.55 !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
  }

  /* Tighter gap between form fields */
  [data-testid="document-panel-scroller"] [data-ui="Stack"] {
    gap: 10px !important;
  }

  /* Label → input gap inside each FormField */
  [data-ui="FormField"] > [data-ui="Stack"] {
    gap: 3px !important;
  }

  /* Reduce top padding of the form scroll area */
  [data-testid="document-panel-scroller"] > div:first-child {
    padding-top: 10px !important;
    padding-bottom: 24px !important;
  }

  /* Tighter field-group tabs row */
  [data-testid="field-group-tabs"] {
    margin-bottom: 4px !important;
  }
  [data-testid="field-group-tabs"] [data-ui="Stack"] {
    gap: 2px !important;
  }

  /* Textarea: less height by default */
  [data-ui="TextArea"] {
    min-height: 52px !important;
  }

  /* Sidebar pane list items — tighter */
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
