import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Lang } from '@/i18n/translations';
import { getTranslations } from '@/i18n/utils';

const STORAGE_KEY = 'analytics-opt-out';

const getInitialValue = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return localStorage.getItem(STORAGE_KEY) === 'true';
};

export function AnalyticsOptOut({ lang }: { lang: Lang }) {
  const t = getTranslations(lang);
  const [optedOut, setOptedOut] = useState(getInitialValue);

  useEffect(() => {
    setOptedOut(getInitialValue());
  }, []);

  const toggle = () => {
    const next = !optedOut;
    localStorage.setItem(STORAGE_KEY, String(next));
    window.__analyticsOptOut = next;
    setOptedOut(next);
    window.location.reload();
  };

  return (
    <Button onClick={toggle} size="sm" variant="outline">
      {optedOut ? t.privacy.optInButton : t.privacy.optOutButton}
    </Button>
  );
}
