import { Check, Download, Loader2 } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import type { CvViewModel } from '@/application/cv/dto';
import { Button } from '@/components/ui/button';
import type { Lang } from '@/i18n/translations';
import { getTranslations } from '@/i18n/utils';
import { trackBrowserAnalyticsEvent } from '@/infrastructure/analytics/browser';

export function CvDownload({
  cv,
  lang = 'es',
  location = 'about',
}: {
  cv: CvViewModel;
  lang?: Lang;
  location?: 'about' | 'cv-preview';
}) {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const t = getTranslations(lang);

  let statusIcon: ReactNode = <Download data-icon="inline-start" />;
  let statusLabel: string = t.about.downloadCv;

  if (status === 'loading') {
    statusIcon = <Loader2 className="animate-spin" data-icon="inline-start" />;
    statusLabel = t.about.downloading;
  } else if (status === 'success') {
    statusIcon = <Check data-icon="inline-start" />;
    statusLabel = t.about.downloaded;
  }

  async function handleDownload() {
    if (status === 'loading') {
      return;
    }
    setStatus('loading');
    trackBrowserAnalyticsEvent('cv_download_started', {
      lang,
      location,
    });
    try {
      const load = async (
        attempt = 0
      ): Promise<
        [typeof import('@react-pdf/renderer'), typeof import('./cv-pdf')]
      > => {
        try {
          return await Promise.all([
            import('@react-pdf/renderer'),
            import('./cv-pdf'),
          ]);
        } catch {
          if (attempt < 2) {
            return load(attempt + 1);
          }
          throw new Error('Failed to load PDF modules');
        }
      };
      const [{ pdf }, { CvPdfDocument }] = await load();

      const sectionLabels = {
        certifications: t.cv.certifications,
        education: t.cv.education,
        experience: t.cv.experience,
        languages: t.cv.languages,
        profile: t.cv.profile,
        stack: t.cv.stack,
      };

      const blob = await pdf(
        <CvPdfDocument
          certifications={cv.certifications}
          contact={cv.contacts}
          education={cv.education}
          experience={cv.experience}
          languages={cv.languages}
          profile={cv.profile}
          sectionLabels={sectionLabels}
          stack={cv.skillNames}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Sandra_Martinez_Fernandez_CV.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      trackBrowserAnalyticsEvent('cv_download_succeeded', {
        lang,
        location,
      });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      console.error('Error generating PDF:', err);
      trackBrowserAnalyticsEvent('cv_download_failed', {
        lang,
        location,
      });
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  }

  return (
    <div>
      <Button
        disabled={status === 'loading'}
        onClick={handleDownload}
        size="lg"
      >
        {statusIcon}
        {statusLabel}
      </Button>
      {status === 'error' && (
        <p
          className="mt-2 text-destructive text-sm"
          style={{
            animation: 'fade-in 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        >
          {t.about.downloadError}
        </p>
      )}
    </div>
  );
}
