import type { Variants } from 'framer-motion';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  stagger?: number;
};

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  },
};

export function StaggerChildren({
  children,
  className,
  stagger = 0.08,
}: Props) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const variants: Variants = {
    ...container,
    show: {
      transition: { staggerChildren: stagger },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      variants={variants}
      viewport={{ once: true, margin: '-50px' }}
      whileInView="show"
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}
