import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export const popoverWideContentClassName = 'w-80 max-w-[calc(100vw-1.5rem)]';
export const popoverMediaContentClassName =
  'w-[26rem] max-w-[calc(100vw-1.5rem)]';

type PopoverPanelProps = {
  children: ReactNode;
  className?: string;
};

type PopoverPanelHeaderProps = {
  description?: string;
  title: string;
};

type PopoverPanelListProps = {
  items: readonly string[];
};

type PopoverPanelMediaProps = {
  body: readonly string[];
  image: {
    alt: string;
    caption?: string;
    height: number;
    invertInDarkMode?: boolean;
    src: string;
    width: number;
  };
};

export function PopoverPanel({ children, className }: PopoverPanelProps) {
  return <div className={cn('space-y-3', className)}>{children}</div>;
}

export function PopoverPanelHeader({
  description,
  title,
}: PopoverPanelHeaderProps) {
  return (
    <div className="space-y-1">
      <p className="font-semibold text-sm">{title}</p>
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </div>
  );
}

export function PopoverPanelList({ items }: PopoverPanelListProps) {
  return (
    <ul className="grid gap-1.5 text-muted-foreground text-sm">
      {items.map((item) => (
        <li className="flex gap-3" key={item}>
          <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function PopoverPanelMedia({ body, image }: PopoverPanelMediaProps) {
  return (
    <div className="flex items-start gap-3">
      <figure className="w-20 shrink-0 space-y-2">
        <img
          alt={image.alt}
          className={cn(
            'aspect-square w-20 rounded-md border border-border/60 bg-background/60 object-contain p-2',
            image.invertInDarkMode && 'dark:contrast-200 dark:invert'
          )}
          height={image.height}
          loading="lazy"
          src={image.src}
          width={image.width}
        />
        {image.caption && (
          <figcaption className="text-muted-foreground text-xs">
            {image.caption}
          </figcaption>
        )}
      </figure>

      <div className="min-w-0 flex-1 space-y-2 text-muted-foreground text-sm">
        {body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
