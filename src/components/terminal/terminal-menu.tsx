import type { Variants } from 'framer-motion';
import { motion, useReducedMotion } from 'framer-motion';
import { forwardRef } from 'react';

type MenuItem = {
  label: string;
  href: string;
};

type Props = {
  hint: string;
  items: MenuItem[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
};

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] },
  },
};

const violet = 'text-[oklch(0.65_0.25_295)]';

export const TerminalMenu = forwardRef<HTMLUListElement, Props>(
  ({ hint, items, activeIndex, onActiveIndexChange }, ref) => {
    const prefersReduced = useReducedMotion();

    if (prefersReduced) {
      return (
        <div>
          <p className="mb-1 text-[12px] text-white/40">{hint}</p>
          <ul ref={ref}>
            {items.map((menuItem, i) => (
              <li key={menuItem.href}>
                <a
                  className="-mx-1 flex items-center gap-2 rounded px-1 py-0.5 transition-colors hover:bg-white/5"
                  href={menuItem.href}
                  onMouseEnter={() => onActiveIndexChange(i)}
                >
                  <span
                    aria-hidden="true"
                    className={i === activeIndex ? violet : 'text-transparent'}
                  >
                    ❯
                  </span>
                  <span>{menuItem.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <motion.div animate="show" initial="hidden" variants={container}>
        <motion.p className="mb-1 text-[12px] text-white/40" variants={item}>
          {hint}
        </motion.p>
        <ul ref={ref}>
          {items.map((menuItem, i) => (
            <motion.li key={menuItem.href} variants={item}>
              <a
                className="-mx-1 flex items-center gap-2 rounded px-1 py-0.5 transition-colors hover:bg-white/5"
                href={menuItem.href}
                onMouseEnter={() => onActiveIndexChange(i)}
              >
                <span
                  aria-hidden="true"
                  className={i === activeIndex ? violet : 'text-transparent'}
                >
                  ❯
                </span>
                <span>{menuItem.label}</span>
              </a>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    );
  }
);

TerminalMenu.displayName = 'TerminalMenu';
