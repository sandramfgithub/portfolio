import type { SkillBadgeViewModel } from '@/application/portfolio/dto';
import { Badge } from '@/components/ui/badge';
import { InteractivePopover } from '@/components/ui/interactive-popover';
import type { Lang } from '@/i18n/translations';
import { trackBrowserAnalyticsEvent } from '@/infrastructure/analytics/browser';

export function SkillBadge({
  location,
  skill,
  lang,
}: {
  location: 'about' | 'entry-detail' | 'projects';
  skill: SkillBadgeViewModel;
  lang: Lang;
}) {
  return (
    <InteractivePopover
      content={
        <div>
          <div className="flex items-center justify-between">
            <a
              className="font-semibold text-sm underline hover:text-foreground"
              href={skill.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              {skill.name}
            </a>
            {skill.lastVersion && (
              <Badge className="text-[10px]" variant="outline">
                v{skill.lastVersion}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-muted-foreground text-xs">
            {lang === 'es' ? 'Uso reciente' : 'Last used'}: {skill.lastUsedAt}
          </p>
          <p className="mt-2 text-muted-foreground text-sm">{skill.summary}</p>
        </div>
      }
      onOpenChange={(open) => {
        if (!open) {
          return;
        }

        trackBrowserAnalyticsEvent('skill_detail_opened', {
          lang,
          location,
          skillSlug: skill.slug,
        });
      }}
      side="top"
      triggerClassName="cursor-pointer"
    >
      <Badge className="text-[11px]" variant="secondary">
        {skill.name}
      </Badge>
    </InteractivePopover>
  );
}
