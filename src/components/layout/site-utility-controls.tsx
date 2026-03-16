import { Moon, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Lang } from '@/i18n/translations';
import {
  getAlternateLang,
  getLocalizedPath,
  getTranslations,
} from '@/i18n/utils';
import { cn } from '@/lib/utils';

const THEME_CHANGE_EVENT = 'portfolio-theme-change';
const noop = () => undefined;

const getThemeSnapshot = (): 'light' | 'dark' => {
  if (typeof document === 'undefined') {
    return 'dark';
  }

  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

const subscribeTheme = (onStoreChange: () => void) => {
  if (typeof window === 'undefined') {
    return noop;
  }

  window.addEventListener('storage', onStoreChange);
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
  };
};

function ThemeToggle({ lang }: { lang: Lang }) {
  const t = getTranslations(lang);
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    () => 'dark'
  );

  const toggle = () => {
    document.documentElement.classList.add('theme-transition');
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    if (nextTheme === 'light') {
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.removeItem('theme');
    }

    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 450);
  };

  const label =
    theme === 'dark' ? t.common.switchToLight : t.common.switchToDark;

  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={label}
        className="theme-toggle icon-btn inline-flex h-8 w-8 items-center justify-center rounded-lg"
        onClick={toggle}
      >
        <span
          aria-hidden="true"
          className="theme-toggle-icon theme-toggle-icon-moon"
        >
          <Moon className="size-4" />
        </span>
        <span
          aria-hidden="true"
          className="theme-toggle-icon theme-toggle-icon-sun"
        >
          <Sun className="size-4" />
        </span>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

type Props = {
  className?: string;
  lang: Lang;
  pathname: string;
};

export function SiteUtilityControls({ className, lang, pathname }: Props) {
  const t = getTranslations(lang);
  const altLang = getAlternateLang(lang);
  const altLabel = altLang.toUpperCase();
  const altPath = getLocalizedPath(pathname, altLang);

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Tooltip>
        <TooltipTrigger
          aria-label={t.common.switchLang}
          className="icon-btn inline-flex h-8 items-center justify-center rounded-lg px-2 font-semibold text-xs"
          render={(props) => (
            <a {...props} href={altPath}>
              {altLabel}
            </a>
          )}
        />
        <TooltipContent>{t.common.switchLang}</TooltipContent>
      </Tooltip>
      <ThemeToggle lang={lang} />
    </div>
  );
}
