import { buildLegacyTheme } from 'sanity';

// ─────────────────────────────────────────────────────────────────────────────
//  ΠΑΛΕΤΑ STUDIO — κράτα την ΣΥΓΧΡΟΝΙΣΜΕΝΗ με τα BRAND PRIMITIVES του site
//  (src/styles/global.css). Το studio είναι ξεχωριστό package, οπότε οι τιμές
//  αντιγράφονται εδώ· άλλαξέ τες ΜΑΖΙ με του site όταν αλλάζεις την παλέτα.
//
//  Αντιστοιχία ρόλων (site primitive → studio):
//    --brand-ink     #262626  → ink       (σκούρες επιφάνειες / navigation)
//    --brand-cream   #f5f4f1  → cream      (κείμενο & φόντο πάνω σε σκούρο)
//    --brand-accent  #8d8a85  → accent     (γκρι τόνος)
//    --brand-star    #d9a441  → highlight  (χρυσό έμφασης / primary)
//
//  Σημ.: το admin UI κρατά ελαφρώς πιο ζεστές αποχρώσεις από το site (από το
//  Instagram aesthetic) για καλύτερη αναγνωσιμότητα. Κράτα τες ανάλογες.
// ─────────────────────────────────────────────────────────────────────────────
const brand = {
  ink: '#18130f', // ⟷ site --brand-ink
  cream: '#f4ece0', // ⟷ site --brand-cream
  accent: '#8a8175', // ⟷ site --brand-accent
  highlight: '#c9a96e', // ⟷ site --brand-star (χρυσό έμφασης)
  componentBg: '#1f1813', // σκούρα επιφάνεια panel (tuned variant του ink)
};

// Λειτουργικά χρώματα κατάστασης — κοινά για κάθε brand.
const state = {
  success: '#6fcf97',
  warning: '#e0a458',
  danger: '#eb5757',
};

const props = {
  '--black': brand.ink,
  '--white': brand.cream,

  '--gray': brand.accent,
  '--gray-base': brand.accent,

  '--component-bg': brand.componentBg,
  '--component-text-color': brand.cream,

  // Brand
  '--brand-primary': brand.highlight,
  '--brand-primary--inverted': brand.ink,

  // Default buttons
  '--default-button-color': brand.accent,
  '--default-button-primary-color': brand.highlight,
  '--default-button-success-color': state.success,
  '--default-button-warning-color': state.warning,
  '--default-button-danger-color': state.danger,

  // State / focus
  '--state-info-color': brand.highlight,
  '--state-success-color': state.success,
  '--state-warning-color': state.warning,
  '--state-danger-color': state.danger,

  '--main-navigation-color': brand.ink,
  '--main-navigation-color--inverted': brand.cream,

  '--focus-color': brand.highlight,
};

export const oikosTheme = buildLegacyTheme(props);
