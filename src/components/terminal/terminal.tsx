import { motion, useReducedMotion } from 'framer-motion';
import type { KeyboardEvent, ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Lang } from '@/i18n/translations';
import { getLocalizedPath, getTranslations } from '@/i18n/utils';
import { TypingAnimation } from '../animated/typing-animation';
import { TerminalChrome } from './terminal-chrome';
import { TerminalMenu } from './terminal-menu';

type Props = {
  lang: Lang;
  className?: string;
};

const violet = 'text-[oklch(0.65_0.25_295)]';

export function Terminal({ lang, className }: Props) {
  const t = getTranslations(lang);
  const prefersReduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const menuListRef = useRef<HTMLUListElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);

  const advance = useCallback(() => {
    setStep((s) => s + 1);
  }, []);

  const projectsHref = getLocalizedPath('/projects', lang);
  const aboutHref = getLocalizedPath('/about', lang);

  const menuItems = [
    { label: t.nav.projects, href: projectsHref },
    { label: t.nav.about, href: aboutHref },
  ];

  const successLines = [
    { text: `✓ ${t.terminal.envReady}`, delay: 300 },
    { text: `✓ ${t.terminal.projectsLoaded}`, delay: 300 },
    { text: `✓ ${t.terminal.expVerified}`, delay: 300 },
  ];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!prefersReduced && step < 7) {
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + menuItems.length) % menuItems.length);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % menuItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const link =
          menuListRef.current?.querySelectorAll<HTMLAnchorElement>('a')[
            activeIndex
          ];
        link?.click();
      }
    },
    [prefersReduced, step, menuItems.length, activeIndex]
  );

  // Autofocus terminal when interactive
  useEffect(() => {
    if (prefersReduced || step >= 7) {
      chromeRef.current?.focus({ preventScroll: true });
    }
  }, [prefersReduced, step]);

  if (prefersReduced) {
    return (
      <TerminalChrome
        className={className}
        onKeyDown={handleKeyDown}
        ref={chromeRef}
        title={t.terminal.title}
      >
        <p>
          <span className={violet}>$</span> sandra --init
        </p>
        <p className="text-white/60">{t.terminal.loading}</p>
        {successLines.map((line) => (
          <p className={violet} key={line.text}>
            {line.text}
          </p>
        ))}
        <p>&nbsp;</p>
        <p>
          <span className={violet}>$</span> sandra --menu
        </p>
        <div className="mt-2">
          <TerminalMenu
            activeIndex={activeIndex}
            hint={t.terminal.menuHint}
            items={menuItems}
            onActiveIndexChange={setActiveIndex}
            ref={menuListRef}
          />
        </div>
      </TerminalChrome>
    );
  }

  return (
    <TerminalChrome
      className={className}
      onKeyDown={handleKeyDown}
      ref={chromeRef}
      title={t.terminal.title}
    >
      {/* Step 0: $ sandra --init */}
      <p>
        <span className={violet}>$ </span>
        <TypingAnimation
          charSpeed={40}
          delay={600}
          onComplete={advance}
          showCursor={step < 1}
          text="sandra --init"
        />
      </p>

      {/* Step 1: Loading... */}
      {step >= 1 && (
        <FadeLine duration={0.3} onDone={advance}>
          <span className="text-white/60">{t.terminal.loading}</span>
        </FadeLine>
      )}

      {/* Steps 2-4: Success lines */}
      {successLines.map((line, i) =>
        step >= i + 2 ? (
          <SlideLine delay={0} key={line.text} onDone={advance}>
            <span className={violet}>{line.text}</span>
          </SlideLine>
        ) : null
      )}

      {/* Step 5: Empty line pause */}
      {step >= 5 && <PauseLine ms={100} onDone={advance} />}

      {/* Step 6: $ sandra --menu */}
      {step >= 6 && (
        <p>
          <span className={violet}>$ </span>
          <TypingAnimation
            charSpeed={40}
            onComplete={advance}
            showCursor={step < 7}
            text="sandra --menu"
          />
        </p>
      )}

      {/* Step 7: Menu */}
      {step >= 7 && (
        <div className="mt-2">
          <TerminalMenu
            activeIndex={activeIndex}
            hint={t.terminal.menuHint}
            items={menuItems}
            onActiveIndexChange={setActiveIndex}
            ref={menuListRef}
          />
        </div>
      )}
    </TerminalChrome>
  );
}

/* ---- helper components ---- */

function FadeLine({
  children,
  onDone,
  duration = 0.3,
}: {
  children: ReactNode;
  onDone?: () => void;
  duration?: number;
}) {
  return (
    <motion.p
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      onAnimationComplete={onDone}
      transition={{ duration }}
    >
      {children}
    </motion.p>
  );
}

function SlideLine({
  children,
  onDone,
  delay = 0,
}: {
  children: ReactNode;
  onDone?: () => void;
  delay?: number;
}) {
  return (
    <motion.p
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 4 }}
      onAnimationComplete={onDone}
      transition={{ duration: 0.3, delay, ease: [0.25, 1, 0.5, 1] }}
    >
      {children}
    </motion.p>
  );
}

function PauseLine({ onDone, ms }: { onDone: () => void; ms: number }) {
  return (
    <motion.p
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      onAnimationComplete={() => {
        setTimeout(onDone, ms);
      }}
      transition={{ duration: 0 }}
    >
      &nbsp;
    </motion.p>
  );
}
