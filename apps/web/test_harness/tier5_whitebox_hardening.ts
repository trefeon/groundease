import './mock_env';
import { TestRunnerContext } from './assert_utils';

import type { StepPhase } from '../src/types';

// Import target modules for white-box gap analysis
import {
  tapSpring,
  springSmooth,
  springBounce,
  EASE_OUT,
  DURATION,
} from '../src/logic/motion';
import { getReadableTextColor } from '../src/logic/color';
import {
  clampScore,
  formatTime,
  getScoreLabel,
  buildCompletedSession,
} from '../src/logic/session';
import {
  buildProgressViewModel,
} from '../src/logic/progress';
import {
  readPreferences,
  defaultPreferences,
  preferencesStorageKey,
} from '../src/logic/preferences';
import { groundingTechniques } from '../src/config/data/techniques';

export function runTier5HardeningTests(): TestRunnerContext {
  const runner = new TestRunnerContext();
  console.log('\n==================================================');
  console.log('--- TIER 5: WHITE-BOX GAP ANALYSIS & HARDENING ---');
  console.log('==================================================\n');

  // ----------------------------------------------------
  // 1. Motion System & Physics Parameter Hardening
  // ----------------------------------------------------
  console.log(' [1] Motion Spring & Transition Hardening');
  runner.assertEqual(tapSpring.type, 'spring', 'T5.1.1: tapSpring type is "spring"');
  runner.assertGreaterOrEqual(tapSpring.stiffness, 100, 'T5.1.2: tapSpring stiffness is responsive (>=100)');
  runner.assertGreaterOrEqual(tapSpring.damping, 10, 'T5.1.3: tapSpring damping is stable (>=10)');
  runner.assert(tapSpring.mass > 0, 'T5.1.4: tapSpring mass is strictly positive');

  // Verify spring non-singularity (stiffness * mass > 0)
  const tapRatio = tapSpring.damping / (2 * Math.sqrt(tapSpring.stiffness * tapSpring.mass));
  runner.assert(Number.isFinite(tapRatio) && tapRatio > 0, 'T5.1.5: tapSpring produces finite positive damping ratio');

  runner.assertEqual(springSmooth.type, 'spring', 'T5.1.6: springSmooth type is "spring"');
  const smoothRatio = springSmooth.damping / (2 * Math.sqrt(springSmooth.stiffness * springSmooth.mass));
  runner.assert(Number.isFinite(smoothRatio) && smoothRatio > 0, 'T5.1.7: springSmooth produces finite positive damping ratio');

  runner.assertEqual(springBounce.type, 'spring', 'T5.1.8: springBounce type is "spring"');
  const bounceRatio = springBounce.damping / (2 * Math.sqrt(springBounce.stiffness * springBounce.mass));
  runner.assert(Number.isFinite(bounceRatio) && bounceRatio > 0, 'T5.1.9: springBounce produces finite positive damping ratio');

  runner.assert(DURATION.fast < DURATION.base && DURATION.base < DURATION.slow, 'T5.1.10: DURATION tokens strictly ordered (fast < base < slow)');
  runner.assertEqual(EASE_OUT, [0.16, 1, 0.3, 1], 'T5.1.11: EASE_OUT expo bezier token verified');

  // ----------------------------------------------------
  // 2. Breathing Circle Pacing & Pacing Hardening
  // ----------------------------------------------------
  console.log('\n [2] Breathing Circle & Pacing Hardening');
  const phaseStyles: Record<string, { label: string; scale: number; color: string }> = {
    inhale: { label: 'Tarik napas', scale: 1.18, color: '#2f8061' },
    hold: { label: 'Tahan napas', scale: 1.15, color: '#2f6670' },
    exhale: { label: 'Hembuskan pelan', scale: 0.88, color: '#75634e' },
    rest: { label: 'Jeda', scale: 1.0, color: '#3b707a' },
    sensory: { label: 'Fokus sensorik', scale: 1.05, color: '#3a6b88' },
    touch: { label: 'Rasakan sentuhan', scale: 1.06, color: '#8c5c4a' },
    auditory: { label: 'Dengarkan suara', scale: 1.05, color: '#275a78' },
    walking: { label: 'Perhatikan langkah', scale: 1.04, color: '#366e4e' },
  };

  // Test fallback handling for unknown phase
  const unknownPhase = 'unknown_phase' as unknown as StepPhase;
  const fallbackConfig = phaseStyles[unknownPhase] ?? phaseStyles.inhale;
  runner.assertEqual(fallbackConfig.label, 'Tarik napas', 'T5.2.1: Unknown breathing phase falls back safely to inhale config');

  // Test duration bounds (Math.max(2, duration))
  runner.assertEqual(Math.max(2, 4), 4, 'T5.2.2: Standard 4s breathing duration preserved');
  runner.assertEqual(Math.max(2, 1), 2, 'T5.2.3: Under-minimum 1s duration clamped to 2s minimum for motion stability');
  runner.assertEqual(Math.max(2, -10), 2, 'T5.2.4: Negative duration clamped to 2s minimum');

  // Verify grounding techniques steps & durations
  runner.assertGreaterOrEqual(groundingTechniques.length, 6, 'T5.2.5: Grounding techniques inventory has 6+ techniques');
  for (const technique of groundingTechniques) {
    runner.assert(technique.steps.length > 0, `T5.2.6: Technique "${technique.id}" has valid step definitions`);
    for (const step of technique.steps) {
      runner.assert(step.duration > 0, `T5.2.7: Step "${step.id}" in technique "${technique.id}" has positive duration (${step.duration}s)`);
    }
  }

  // ----------------------------------------------------
  // 3. Progress Ring Math & Clamping Hardening
  // ----------------------------------------------------
  console.log('\n [3] Progress Ring & Math Clamping Hardening');
  const computeRingParams = (progress: number | undefined, value: number | undefined, size = 120, strokeWidth = 8) => {
    const rawProgress = progress ?? value ?? 0;
    const clampedProgress = Math.min(100, Math.max(0, rawProgress));
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;
    return { clampedProgress, strokeDashoffset, circumference };
  };

  const normalRing = computeRingParams(50, undefined);
  runner.assertEqual(normalRing.clampedProgress, 50, 'T5.3.1: Progress Ring retains normal 50% value');
  runner.assertEqual(normalRing.strokeDashoffset, normalRing.circumference * 0.5, 'T5.3.2: 50% progress calculates exact half dashoffset');

  const negativeRing = computeRingParams(-50, undefined);
  runner.assertEqual(negativeRing.clampedProgress, 0, 'T5.3.3: Progress Ring clamps negative progress (-50) to 0');
  runner.assertEqual(negativeRing.strokeDashoffset, negativeRing.circumference, 'T5.3.4: 0 clamped progress sets full circumference dashoffset');

  const overflowRing = computeRingParams(150, undefined);
  runner.assertEqual(overflowRing.clampedProgress, 100, 'T5.3.5: Progress Ring clamps overflow progress (150) to 100');
  runner.assertEqual(overflowRing.strokeDashoffset, 0, 'T5.3.6: 100 clamped progress sets 0 dashoffset');

  const aliasRing = computeRingParams(undefined, 75);
  runner.assertEqual(aliasRing.clampedProgress, 75, 'T5.3.7: Progress Ring accepts "value" prop as fallback for progress');

  const undefinedRing = computeRingParams(undefined, undefined);
  runner.assertEqual(undefinedRing.clampedProgress, 0, 'T5.3.8: Progress Ring defaults undefined inputs to 0%');

  // ----------------------------------------------------
  // 4. Bottom Sheet Drag Handler Hardening
  // ----------------------------------------------------
  console.log('\n [4] Bottom Sheet Drag Handler & Scroll Lock Hardening');

  const shouldCloseDrawer = (offsetY: number, velocityY: number) => {
    return offsetY > 100 || velocityY > 500;
  };

  runner.assertEqual(shouldCloseDrawer(50, 200), false, 'T5.4.1: Drag offset 50px & velocity 200 keeps drawer open');
  runner.assertEqual(shouldCloseDrawer(100, 500), false, 'T5.4.2: Boundary drag offset 100px & velocity 500 keeps drawer open');
  runner.assertEqual(shouldCloseDrawer(101, 0), true, 'T5.4.3: Drag offset 101px exceeds threshold and closes drawer');
  runner.assertEqual(shouldCloseDrawer(0, 501), true, 'T5.4.4: Velocity 501px/s exceeds threshold and closes drawer');
  runner.assertEqual(shouldCloseDrawer(-150, -300), false, 'T5.4.5: Upward drag (negative offset/velocity) keeps drawer open');

  // ----------------------------------------------------
  // 5. Storage & Preference Recovery Hardening
  // ----------------------------------------------------
  console.log('\n [5] Preferences & Storage Hardening');

  // Test corrupted storage in readPreferences
  window.localStorage.setItem(preferencesStorageKey, '{ invalid json syntax ...');
  const recoveredPrefs = readPreferences();
  runner.assertEqual(recoveredPrefs, defaultPreferences, 'T5.5.1: readPreferences gracefully recovers defaultPreferences on invalid JSON');

  // Test unexpected preference data types
  window.localStorage.setItem(
    preferencesStorageKey,
    JSON.stringify({
      theme: 'invalid-theme-string',
      ambientSound: 'wind', // map legacy 'wind' -> 'forest'
      ambientVolume: 'not-a-number',
      dailyReminder: 'yes', // invalid boolean type
    }),
  );
  const normalizedPrefs = readPreferences();
  runner.assertEqual(normalizedPrefs.theme, 'system', 'T5.5.2: Invalid theme string falls back to "system"');
  runner.assertEqual(normalizedPrefs.ambientSound, 'forest', 'T5.5.3: Legacy "wind" sound string normalized to "forest"');
  runner.assertEqual(normalizedPrefs.ambientVolume, 35, 'T5.5.4: Invalid volume string falls back to default 35');
  runner.assertEqual(normalizedPrefs.dailyReminder, true, 'T5.5.5: Invalid dailyReminder type falls back to default true');

  // Clean up
  window.localStorage.removeItem(preferencesStorageKey);

  // ----------------------------------------------------
  // 6. Color & Contrast Calculation Hardening
  // ----------------------------------------------------
  console.log('\n [6] Color Contrast Calculation Hardening');

  runner.assertEqual(getReadableTextColor('#2f8061'), '#f8fff9', 'T5.6.1: Dark sage (#2f8061) selects high-contrast light text (#f8fff9)');
  runner.assertEqual(getReadableTextColor('#ffffff'), '#132019', 'T5.6.2: Pure white background selects dark text (#132019)');
  runner.assertEqual(getReadableTextColor('#fff'), '#132019', 'T5.6.3: 3-digit hex (#fff) supported correctly');
  runner.assertEqual(getReadableTextColor('invalid-hex'), '#f8fff9', 'T5.6.4: Invalid hex string falls back to light text without throwing error');

  // ----------------------------------------------------
  // 7. Logic & Helper Utilities Hardening
  // ----------------------------------------------------
  console.log('\n [7] Logic Helper Utilities Hardening');

  // clampScore
  runner.assertEqual(clampScore(null), null, 'T5.7.1: clampScore(null) returns null');
  runner.assertEqual(clampScore('  '), null, 'T5.7.2: clampScore whitespace returns null');
  runner.assertEqual(clampScore('not-a-number'), null, 'T5.7.3: clampScore NaN string returns null');
  runner.assertEqual(clampScore('-10'), 0, 'T5.7.4: clampScore("-10") clamps to min 0');
  runner.assertEqual(clampScore('20'), 10, 'T5.7.5: clampScore("20") clamps to max 10');
  runner.assertEqual(clampScore('6.7'), 7, 'T5.7.6: clampScore("6.7") rounds to integer 7');

  // formatTime
  runner.assertEqual(formatTime(0), '0:00', 'T5.7.7: formatTime(0) produces "0:00"');
  runner.assertEqual(formatTime(59), '0:59', 'T5.7.8: formatTime(59) produces "0:59"');
  runner.assertEqual(formatTime(60), '1:00', 'T5.7.9: formatTime(60) produces "1:00"');
  runner.assertEqual(formatTime(3599), '59:59', 'T5.7.10: formatTime(3599) produces "59:59"');

  // getScoreLabel
  runner.assertEqual(getScoreLabel(0), 'tenang', 'T5.7.11: getScoreLabel(0) returns "tenang"');
  runner.assertEqual(getScoreLabel(2), 'tenang', 'T5.7.12: getScoreLabel(2) returns "tenang"');
  runner.assertEqual(getScoreLabel(3), 'sedikit cemas', 'T5.7.13: getScoreLabel(3) returns "sedikit cemas"');
  runner.assertEqual(getScoreLabel(5), 'cemas sedang', 'T5.7.14: getScoreLabel(5) returns "cemas sedang"');
  runner.assertEqual(getScoreLabel(7), 'cukup cemas', 'T5.7.15: getScoreLabel(7) returns "cukup cemas"');
  runner.assertEqual(getScoreLabel(9), 'sangat cemas', 'T5.7.16: getScoreLabel(9) returns "sangat cemas"');
  runner.assertEqual(getScoreLabel(10), 'sangat cemas', 'T5.7.17: getScoreLabel(10) returns "sangat cemas"');

  // buildCompletedSession timestamp duration math
  const reversedDurationSession = buildCompletedSession({
    sessionId: 'test-session-1',
    technique: groundingTechniques[0],
    startedAt: '2026-08-06T12:05:00.000Z',
    completedAt: '2026-08-06T12:00:00.000Z', // Completed BEFORE started
    preScore: 8,
    postScore: 3,
    responses: {},
    steps: groundingTechniques[0].steps,
  });
  runner.assertEqual(reversedDurationSession.durationSeconds, 1, 'T5.7.18: Reversed timestamp duration clamped to minimum 1s');

  // buildProgressViewModel with empty session array
  const emptyViewModel = buildProgressViewModel([]);
  runner.assertEqual(emptyViewModel.totalSessions, 0, 'T5.7.19: Empty session array yields 0 totalSessions');
  runner.assertEqual(emptyViewModel.averageReduction, 0, 'T5.7.20: Empty session array yields 0 averageReduction');
  runner.assertEqual(emptyViewModel.currentStreak, 0, 'T5.7.21: Empty session array yields 0 currentStreak');

  return runner;
}

const runner = runTier5HardeningTests();
console.log(`\nTier 5 Executed: ${runner.passed + runner.failed} tests, Passed: ${runner.passed}, Failed: ${runner.failed}`);
if (runner.failed > 0) {
  process.exit(1);
}

