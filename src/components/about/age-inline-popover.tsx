import { PartyPopper } from 'lucide-react';
import {
  getAgeFromBirthDate,
  isBirthday,
} from '@/application/portfolio/about-age';
import type { AboutAgePopoverViewModel } from '@/application/portfolio/dto';
import { inlinePopoverTriggerClassName } from '@/components/about/inline-popover';
import { InteractivePopover } from '@/components/ui/interactive-popover';
import {
  PopoverPanel,
  popoverWideContentClassName,
} from '@/components/ui/popover-panel';

type Props = {
  content: AboutAgePopoverViewModel;
};

export function AgeInlinePopover({ content }: Props) {
  const today = new Date();
  const age = getAgeFromBirthDate(content.birthDate, today);
  const birthday = isBirthday(content.birthDate, today);

  return (
    <InteractivePopover
      align="start"
      content={
        <PopoverPanel>
          <p className="font-semibold text-sm">{age}</p>
          <p className="text-muted-foreground text-sm">{content.defaultText}</p>
          {birthday && (
            <div className="inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm">
              <PartyPopper className="size-4" />
              <span>{content.birthdayText}</span>
            </div>
          )}
        </PopoverPanel>
      }
      contentClassName={popoverWideContentClassName}
      side="top"
      triggerClassName={inlinePopoverTriggerClassName}
    >
      {age}
    </InteractivePopover>
  );
}
