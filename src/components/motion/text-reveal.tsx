import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

type Props = {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
};

export function TextReveal({ text, className = '', as: Tag = 'h1' }: Props) {
  const prefersReduced = usePrefersReducedMotion();
  const words = text.split(' ');

  if (prefersReduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <motion.span
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 8 }}
          key={`${word}-${i}`}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
          transition={{
            duration: 0.4,
            delay: i * 0.06,
            ease: [0.25, 1, 0.5, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
