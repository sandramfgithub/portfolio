import type { KeyboardEvent, ReactNode } from 'react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  children: ReactNode;
  className?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
};

export const TerminalChrome = forwardRef<HTMLDivElement, Props>(
  ({ title, children, className, onKeyDown }, ref) => {
    return (
      <div
        aria-label={title}
        className={cn(
          'overflow-hidden rounded-lg border border-border/40 outline-none focus-visible:ring-2 focus-visible:ring-ring',
          className
        )}
        onKeyDown={onKeyDown}
        ref={ref}
        role="application"
        tabIndex={0}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 bg-[oklch(0.16_0_0)] px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-white/50 text-xs">{title}</span>
        </div>

        {/* Body */}
        <div className="bg-[oklch(0.10_0_0)] px-4 py-4 font-mono text-[13px] text-white/90 leading-relaxed sm:px-5">
          {children}
        </div>
      </div>
    );
  }
);

TerminalChrome.displayName = 'TerminalChrome';
