import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

type Props = {
  text: string;
  className?: string;
  charSpeed?: number;
  delay?: number;
  showCursor?: boolean;
  onComplete?: () => void;
};

export function TypingAnimation({
  text,
  className = '',
  charSpeed = 40,
  delay = 0,
  showCursor = true,
  onComplete,
}: Props) {
  const prefersReduced = usePrefersReducedMotion();
  const [charIndex, setCharIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (prefersReduced) {
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay, onComplete, prefersReduced]);

  useEffect(() => {
    if (!started || prefersReduced) {
      return;
    }

    const timer = setInterval(() => {
      setCharIndex((prev) => {
        const next = prev + 1;
        if (next >= text.length) {
          clearInterval(timer);
          // defer callback to avoid setState-during-render
          setTimeout(() => onComplete?.(), 0);
          return text.length;
        }
        return next;
      });
    }, charSpeed);

    return () => clearInterval(timer);
  }, [started, charSpeed, text.length, onComplete, prefersReduced]);

  if (prefersReduced) {
    return <span className={className}>{text}</span>;
  }

  const done = charIndex >= text.length;
  const cursorVisible = !done || showCursor;

  return (
    <span className={className}>
      {text.slice(0, charIndex)}
      {cursorVisible && (
        <span aria-hidden="true" className={done ? 'animate-blink-caret' : ''}>
          |
        </span>
      )}
      <span className="invisible">{text.slice(charIndex)}</span>
    </span>
  );
}
