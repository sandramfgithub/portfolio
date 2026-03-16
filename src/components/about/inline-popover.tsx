import type {
  AboutListPopoverViewModel,
  AboutMediaPopoverViewModel,
} from '@/application/portfolio/dto';
import {
  InteractivePopover,
  interactivePopoverTriggerClassName,
} from '@/components/ui/interactive-popover';
import {
  PopoverPanel,
  PopoverPanelHeader,
  PopoverPanelList,
  PopoverPanelMedia,
  popoverMediaContentClassName,
  popoverWideContentClassName,
} from '@/components/ui/popover-panel';

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
        <PopoverPanel>
          <PopoverPanelHeader
            description={'intro' in content ? content.intro : undefined}
            title={content.title}
          />

          {'items' in content && content.items.length > 0 && (
            <PopoverPanelList items={content.items} />
          )}

          {'body' in content &&
            (content.image ? (
              <PopoverPanelMedia body={content.body} image={content.image} />
            ) : (
              <div className="space-y-2 text-muted-foreground text-sm">
                {content.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ))}
        </PopoverPanel>
      }
      contentClassName={
        content.kind === 'media'
          ? popoverMediaContentClassName
          : popoverWideContentClassName
      }
      side="top"
      triggerClassName={inlinePopoverTriggerClassName}
    >
      {trigger}
    </InteractivePopover>
  );
}
