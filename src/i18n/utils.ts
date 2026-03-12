import { type Lang, translations } from './translations';

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en') {
    return 'en';
  }
  return 'es';
}

export function getTranslations(lang: Lang) {
  return translations[lang];
}

export function getLocalizedPath(path: string, lang: Lang): string {
  const clean =
    path.replace(/^\/(es|en)(?=\/|$)/, '').replace(/\/$/, '') || '/';
  return clean === '/' ? `/${lang}` : `/${lang}${clean}`;
}

export function getAlternateLang(lang: Lang): Lang {
  return lang === 'es' ? 'en' : 'es';
}
