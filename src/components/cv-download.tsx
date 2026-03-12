import { Check, Download, Loader2 } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cvData } from '@/data/cv';
import { socialLinks } from '@/data/site';
import type { Lang } from '@/i18n/translations';
import { getTranslations } from '@/i18n/utils';

function getContact() {
  const contact: { github?: string; linkedin?: string; email?: string } = {};
  for (const link of socialLinks) {
    if (link.label === 'GitHub') {
      contact.github = link.href;
    }
    if (link.label === 'LinkedIn') {
      contact.linkedin = link.href;
    }
    if (link.label === 'Email') {
      contact.email = link.href.replace('mailto:', '');
    }
  }
  return contact;
}

export function CvDownload({ lang = 'es' }: { lang?: Lang }) {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const t = getTranslations(lang);
  const data = cvData[lang];

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

      const sectionLabels =
        lang === 'en'
          ? {
              profile: 'Professional Profile',
              experience: 'Experience',
              stack: 'Technical Stack',
              languages: 'Languages',
            }
          : {
              profile: 'Perfil profesional',
              experience: 'Experiencia',
              stack: 'Stack técnico',
              languages: 'Idiomas',
            };

      const blob = await pdf(
        <CvPdfDocument
          contact={getContact()}
          experience={data.experience}
          languages={data.languages}
          profile={data.profile}
          sectionLabels={sectionLabels}
          stack={data.skills}
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

      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      console.error('Error generating PDF:', err);
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
