import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getReadableTextColor } from '@/logic/color';
import type { StepPhase } from '@/types';

export interface BreathingCircleProps {
  phase?: StepPhase;
  visualMode?: 'breathing' | 'sensory' | 'touch' | 'auditory' | 'walking';
  duration?: number;
  size?: number;
  subtext?: string;
  isPaused?: boolean;
  children?: React.ReactNode;
}

const phaseStyles: Record<StepPhase, { label: string; scale: number; color: string }> = {
  inhale: { label: 'Tarik napas', scale: 1.18, color: '#2f8061' },
  hold: { label: 'Tahan napas', scale: 1.15, color: '#2f6670' },
  exhale: { label: 'Hembuskan pelan', scale: 0.88, color: '#75634e' },
  rest: { label: 'Jeda', scale: 1.0, color: '#3b707a' },
  sensory: { label: 'Fokus sensorik', scale: 1.05, color: '#3a6b88' },
  touch: { label: 'Rasakan sentuhan', scale: 1.06, color: '#8c5c4a' },
  auditory: { label: 'Dengarkan suara', scale: 1.05, color: '#275a78' },
  walking: { label: 'Perhatikan langkah', scale: 1.04, color: '#366e4e' },
  somatic: { label: 'Rileksasi somatik', scale: 1.06, color: '#2f8061' },
  defusion: { label: 'Defusi kognitif', scale: 1.05, color: '#3a6b88' },
};

export default function BreathingCircle({
  phase = 'inhale',
  visualMode = 'breathing',
  duration = 4,
  size = 220,
  subtext,
  isPaused = false,
  children,
}: BreathingCircleProps) {
  const shouldReduceMotion = useReducedMotion();
  const config = phaseStyles[phase] ?? phaseStyles.inhale;
  const isResting = isPaused || phase === 'rest' || Boolean(shouldReduceMotion);
  const textColor = getReadableTextColor(config.color);
  const [imageFailed, setImageFailed] = useState(false);

  const targetScale = isResting ? 1 : config.scale;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Dynamic Pulse Aura Outer Glow */}
        <motion.div
          aria-hidden="true"
          animate={{
            scale: isResting ? 1 : [1, 1.22, 1],
            opacity: isResting ? 0.15 : [0.25, 0.1, 0.25],
          }}
          transition={{
            duration: Math.max(2, duration),
            ease: 'easeInOut',
            repeat: isResting ? 0 : Infinity,
          }}
          className="absolute -inset-4 rounded-full blur-xl"
          style={{ backgroundColor: config.color }}
        />

        {/* Concentric Secondary Ring */}
        <motion.div
          aria-hidden="true"
          animate={{ scale: isResting ? 1 : targetScale }}
          transition={{
            duration: isResting ? 0.4 : duration,
            ease: 'easeInOut',
          }}
          className="absolute inset-4 rounded-full border border-current/20 bg-calm-soft/40"
          style={{ color: config.color }}
        />

        {/* Core Animated Circle */}
        <motion.div
          animate={{
            scale: isResting ? 1 : targetScale,
            backgroundColor: config.color,
          }}
          transition={{
            duration: isResting ? 0.4 : duration,
            ease: 'easeInOut',
          }}
          className="relative z-10 flex size-full items-center justify-center overflow-hidden rounded-full shadow-level-2"
          style={{ color: textColor }}
        >
          {!imageFailed && visualMode === 'breathing' && (
            <img
              src="/breathing.gif"
              alt=""
              aria-hidden="true"
              decoding="async"
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-overlay"
              onError={() => setImageFailed(true)}
            />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 35%, rgba(255,255,255,0.22), transparent 45%), radial-gradient(circle at 50% 65%, rgba(0,0,0,0.15), transparent 50%)',
            }}
          />
          <div className="absolute inset-3 rounded-full border border-current/20" />
          <div className="relative z-10">{children}</div>
        </motion.div>
      </div>

      <div className="text-center">
        <p className="mb-1 text-label-lg font-medium text-foreground">
          {visualMode === 'breathing' ? config.label : (subtext ?? config.label)}
        </p>
        {subtext && visualMode === 'breathing' && (
          <p className="text-body-md text-muted-foreground">{subtext}</p>
        )}
      </div>
    </div>
  );
}
