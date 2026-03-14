import type { ComponentProps, ReactNode } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCanHover } from '@/lib/use-can-hover';

export const interactivePopoverTriggerClassName =
  'cursor-pointer underline decoration-dotted decoration-muted-foreground/50 underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50';

type Props = {
  align?: ComponentProps<typeof PopoverContent>['align'];
  children: ReactNode;
  content: ReactNode;
  contentClassName?: string;
  onOpenChange?: ComponentProps<typeof Popover>['onOpenChange'];
  side?: ComponentProps<typeof PopoverContent>['side'];
  triggerClassName?: string;
};

export function InteractivePopover({
  align = 'center',
  children,
  content,
  contentClassName,
  onOpenChange,
  side = 'top',
  triggerClassName = 'cursor-pointer',
}: Props) {
  const canHover = useCanHover();

  return (
    <Popover onOpenChange={onOpenChange}>
      <PopoverTrigger
        closeDelay={canHover ? 100 : undefined}
        delay={canHover ? 120 : undefined}
        openOnHover={canHover}
        render={<button className={triggerClassName} type="button" />}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent align={align} className={contentClassName} side={side}>
        {content}
      </PopoverContent>
    </Popover>
  );
}
