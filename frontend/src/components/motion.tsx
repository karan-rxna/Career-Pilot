import { animate, motion, useInView, type Variants } from "framer-motion";
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export const staggerChildScale: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

interface StaggerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
}

/** Parent that staggers its <Item> children on mount. */
export function Stagger({ children, className, stagger = 0.055 }: StaggerProps) {
  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: 0.04 } },
  };
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      animate="show"
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
}

/** Single animated child (must live inside <Stagger> or receive variants by hand). */
export function Item({
  children,
  className,
  scale = false,
}: {
  children: ReactNode;
  className?: string;
  scale?: boolean;
}) {
  return (
    <motion.div className={className} variants={scale ? staggerChildScale : staggerChild}>
      {children}
    </motion.div>
  );
}

/** Fade + rise wrapper for standalone blocks. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  ...rest
}: { children: ReactNode; delay?: number; y?: number } & ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      style={{ willChange: "opacity, transform" }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Number that counts up when it first scrolls into view. */
export function CountUp({
  value,
  decimals = 0,
  duration = 1.4,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: EASE,
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
