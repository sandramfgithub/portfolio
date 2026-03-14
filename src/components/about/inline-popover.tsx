import type {
  AboutListPopoverViewModel,
  AboutMediaPopoverViewModel,
} from '@/application/portfolio/dto';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export const inlinePopoverTriggerClassName =
  'cursor-pointer underline decoration-dotted decoration-muted-foreground/50 underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50';

type Props = {
  content: AboutListPopoverViewModel | AboutMediaPopoverViewModel;
  trigger: string;
};

export function InlinePopover({ content, trigger }: Props) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button className={inlinePopoverTriggerClassName} type="button" />
        }
      >
        {trigger}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={content.kind === 'media' ? 'w-72' : undefined}
        side="top"
      >
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
                className="w-full rounded-md border border-border/60"
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
      </PopoverContent>
    </Popover>
  );
}
