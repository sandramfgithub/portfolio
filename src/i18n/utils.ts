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
  const clean = path.replace(/^\/en/, '').replace(/\/$/, '') || '/';
  if (lang === 'es') {
    return clean;
  }
  return clean === '/' ? '/en' : `/en${clean}`;
}

export function getAlternateLang(lang: Lang): Lang {
  return lang === 'es' ? 'en' : 'es';
}
