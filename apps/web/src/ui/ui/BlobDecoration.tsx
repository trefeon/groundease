import { motion } from 'framer-motion';

/**
 * Ambient background organic glow decoration for Ruang Pulih.
 * Renders smooth floating OKLCH color blurs behind layout content.
 */
export default function BlobDecoration() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
    >
      {/* Top-left Sage organic aura */}
      <motion.div
        animate={{
          x: [0, 45, -35, 0],
          y: [0, -35, 55, 0],
          scale: [1, 1.12, 0.92, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -left-28 -top-28 h-[450px] w-[450px] rounded-full bg-sage-soft opacity-35 blur-[110px] dark:opacity-20"
      />

      {/* Mid-right Warm Sand / Ivory organic aura */}
      <motion.div
        animate={{
          x: [0, -55, 35, 0],
          y: [0, 70, -45, 0],
          scale: [1, 0.88, 1.15, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[35%] -right-20 h-[420px] w-[420px] rounded-full bg-sand-soft opacity-30 blur-[100px] dark:opacity-15"
      />

      {/* Bottom-left Tranquil Calm Teal aura */}
      <motion.div
        animate={{
          x: [0, 50, -45, 0],
          y: [0, -60, 35, 0],
          scale: [1, 1.18, 0.95, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-24 left-[15%] h-[500px] w-[500px] rounded-full bg-calm-soft opacity-25 blur-[125px] dark:opacity-15"
      />
    </div>
  );
}
