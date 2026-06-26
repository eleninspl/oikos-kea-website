import { ui } from './ui';
import type { Lang, UIKeys } from './ui';

export type { Lang };

export const defaultLang: Lang = 'el';

export function getLangFromPath(pathname: string): Lang {
  return pathname.startsWith('/en') ? 'en' : 'el';
}

export function useTranslations(lang: Lang) {
  return function t(key: UIKeys): string {
    return (ui[lang][key] ?? ui[defaultLang][key]) as string;
  };
}

export function getLabel(lang: Lang, el: string, en: string): string {
  return lang === 'el' ? el : en;
}

export function getAlternateUrl(pathname: string, targetLang: Lang): string {
  const isEn = pathname.startsWith('/en');
  if (targetLang === 'en') {
    return isEn ? pathname : '/en' + (pathname === '/' ? '' : pathname);
  }
  return isEn ? pathname.replace(/^\/en/, '') || '/' : pathname;
}
