import { buildLegacyTheme } from 'sanity';

// Χρώματα OIKOS (από το Instagram aesthetic)
const props = {
  '--black': '#18130f',
  '--white': '#f4ece0',

  '--gray': '#8a8175',
  '--gray-base': '#8a8175',

  '--component-bg': '#1f1813',
  '--component-text-color': '#f4ece0',

  // Brand
  '--brand-primary': '#c9a96e',
  '--brand-primary--inverted': '#18130f',

  // Default buttons
  '--default-button-color': '#8a8175',
  '--default-button-primary-color': '#c9a96e',
  '--default-button-success-color': '#6fcf97',
  '--default-button-warning-color': '#e0a458',
  '--default-button-danger-color': '#eb5757',

  // State / focus
  '--state-info-color': '#c9a96e',
  '--state-success-color': '#6fcf97',
  '--state-warning-color': '#e0a458',
  '--state-danger-color': '#eb5757',

  '--main-navigation-color': '#18130f',
  '--main-navigation-color--inverted': '#f4ece0',

  '--focus-color': '#c9a96e',
};

export const oikosTheme = buildLegacyTheme(props);
