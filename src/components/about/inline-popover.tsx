import type {
  AboutListPopoverViewModel,
  AboutMediaPopoverViewModel,
} from '@/application/portfolio/dto';
import {
  InteractivePopover,
  interactivePopoverTriggerClassName,
} from '@/components/ui/interactive-popover';
import { cn } from '@/lib/utils';

export const inlinePopoverTriggerClassName = interactivePopoverTriggerClassName;

type Props = {
  content: AboutListPopoverViewModel | AboutMediaPopoverViewModel;
  trigger: string;
};

export function InlinePopover({ content, trigger }: Props) {
  return (
    <InteractivePopover
      align="start"
      content={
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="font-semibold text-sm">{content.title}</p>
            {'intro' in content && content.intro && (
              <p className="text-muted-foreground text-sm">{content.intro}</p>
            )}
          </div>

          {'items' in content && content.items.length > 0 && (
            <ul className="grid gap-1.5 text-muted-foreground text-sm">
              {content.items.map((item) => (
                <li className="flex gap-3" key={item}>
                  <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          {'body' in content && (
            <div className="space-y-2 text-muted-foreground text-sm">
              {content.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          )}

          {'image' in content && content.image && (
            <figure className="space-y-2">
              <img
                alt={content.image.alt}
                className={cn(
                  'w-full rounded-md border border-border/60',
                  content.image.invertInDarkMode && 'dark:invert'
                )}
                height={content.image.height}
                loading="lazy"
                src={content.image.src}
                width={content.image.width}
              />
              {content.image.caption && (
                <figcaption className="text-muted-foreground text-xs">
                  {content.image.caption}
                </figcaption>
              )}
            </figure>
          )}
        </div>
      }
      contentClassName={content.kind === 'media' ? 'w-72' : undefined}
      side="top"
      triggerClassName={inlinePopoverTriggerClassName}
    >
      {trigger}
    </InteractivePopover>
  );
}
