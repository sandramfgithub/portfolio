import { Fragment } from 'react';
import type {
  AboutParagraphViewModel,
  AboutPopoverRegistryViewModel,
} from '@/application/portfolio/dto';
import { AgeInlinePopover } from '@/components/about/age-inline-popover';
import { InlinePopover } from '@/components/about/inline-popover';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  paragraphs: readonly AboutParagraphViewModel[];
  popovers: AboutPopoverRegistryViewModel;
};

export function AboutRichText({ className, paragraphs, popovers }: Props) {
  return (
    <div className={cn('space-y-4', className)}>
      {paragraphs.map((paragraph, paragraphIndex) => (
        <p key={paragraphIndex}>
          {paragraph.nodes.map((node, nodeIndex) => {
            if (node.type === 'text') {
              return <Fragment key={nodeIndex}>{node.value}</Fragment>;
            }

            if (node.type === 'strong') {
              return (
                <strong
                  className="font-semibold text-foreground"
                  key={nodeIndex}
                >
                  {node.value}
                </strong>
              );
            }

            if (node.key === 'age') {
              return (
                <AgeInlinePopover content={popovers.age} key={nodeIndex} />
              );
            }

            const popover = popovers[node.key];
            return (
              <InlinePopover
                content={popover}
                key={nodeIndex}
                trigger={node.trigger ?? ''}
              />
            );
          })}
        </p>
      ))}
    </div>
  );
}
