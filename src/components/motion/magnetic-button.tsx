import { motion, useMotionValue, useTransform } from 'framer-motion';
import { type ReactNode, useRef } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

type Props = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

export function MagneticButton({ children, className, strength = 3 }: Props) {
  const prefersReduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const moveX = useTransform(x, (v) => v * strength);
  const moveY = useTransform(y, (v) => v * strength);

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  function handleMouse(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) {
      return;
    }
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      className={className}
      onMouseLeave={handleLeave}
      onMouseMove={handleMouse}
      ref={ref}
      style={{ x: moveX, y: moveY }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
