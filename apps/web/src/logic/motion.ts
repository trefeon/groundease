import type { Variants } from "framer-motion";

/** Motion tokens — keep durations short and easing smooth for a calm mental-health app */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const; // expo-out feel
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const DURATION = { fast: 0.18, base: 0.3, slow: 0.45 } as const;

/** Fade + rise — default entrance for sections and cards */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
};

/** Pure fade — for full-page route transitions */
export const pageFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATION.fast, ease: EASE_IN_OUT },
  },
};

/** Parent for staggered children: <motion.div variants={staggerContainer} initial="hidden" animate="visible"> */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

/** Child item for use inside a staggerContainer — pairs with fadeUp naming (hidden/visible) */
export const staggerItem: Variants = fadeUp;

/** Spring for taps/hover feedback on interactive elements */
export const tapSpring = {
  type: "spring" as const,
  stiffness: 500,
  damping: 30,
  mass: 0.6,
};

/** Smooth spring for cards and gentle hover interactions */
export const springSmooth = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
  mass: 0.8,
};

/** Playful bouncy spring for subtle emphasis */
export const springBounce = {
  type: "spring" as const,
  stiffness: 400,
  damping: 15,
  mass: 0.5,
};

/** Fade in + slide up with spring transition */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springSmooth,
  },
};

/** Smooth page transition with subtle slide exit */
export const pageTransitionVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: DURATION.fast, ease: EASE_IN_OUT },
  },
};

