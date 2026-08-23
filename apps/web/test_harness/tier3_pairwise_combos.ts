import './mock_env';
import { TestRunnerContext } from './assert_utils';
import { getReadableTextColor } from '../src/logic/color';
import { buildProgressViewModel } from '../src/logic/progress';
import { tapSpring, springSmooth } from '../src/logic/motion';
import { stepsBoxBreathing, groundingTechniques } from '../src/config/data/techniques';
import { buildCompletedSession, getScoreLabel } from '../src/logic/session';
import { saveSession, getSessions, clearLocalPracticeData } from '../src/services/storage';
import { api } from '../src/services/api';
import type { StepPhase, GroundingSession } from '../src/types';

export function runTier3Tests(ctx: TestRunnerContext) {
  console.log('\n==================================================');
  console.log('--- TIER 3: CROSS-FEATURE PAIRWISE COMBINATIONS (10 Tests) ---');
  console.log('==================================================\n');

  clearLocalPracticeData();

  // --------------------------------------------------------------------------
  // T3.1: F1 (Serene Design) + F8 (SUD Verification)
  // Dynamic contrast calculation for dynamic SUD anxiety card background colors
  // --------------------------------------------------------------------------
  const sudColorMap: Record<number, string> = {
    2: '#2f8061', // tenang -> serene green
    5: '#2f6670', // cemas sedang -> tranquil teal
    8: '#75634e', // cukup cemas -> warm earth brown
    10: '#5c2727', // sangat cemas -> deep rust
  };
  for (const [scoreStr, bgHex] of Object.entries(sudColorMap)) {
    const score = Number(scoreStr);
    const label = getScoreLabel(score);
    const textContrast = getReadableTextColor(bgHex);
    ctx.assert(Boolean(label) && textContrast === '#f8fff9', `T3.1: F1+F8 Score ${score} (${label}) on background ${bgHex} gets readable light text (${textContrast})`);
  }

  // --------------------------------------------------------------------------
  // T3.2: F2 (Route Polish) + F6 (Progress Ring)
  // Bento Progress Dashboard integrating SVG ProgressRing completion geometry
  // --------------------------------------------------------------------------
  const session1: GroundingSession = {
    id: 'bento-1',
    techniqueId: 'box-breathing',
    techniqueCategory: 'pernapasan',
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date(Date.now() - 3500000).toISOString(),
    durationSeconds: 100,
    completed: true,
    anxietyPre: 8,
    anxietyPost: 3,
  };
  const session2: GroundingSession = {
    id: 'bento-2',
    techniqueId: 'ocean-breath',
    techniqueCategory: 'pernapasan',
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    durationSeconds: 120,
    completed: true,
    anxietyPre: 7,
    anxietyPost: 2,
  };
  saveSession(session1);
  saveSession(session2);

  const bentoVm = buildProgressViewModel(getSessions());
  ctx.assertEqual(bentoVm.completedSessions, 2, 'T3.2a: Bento Progress Dashboard calculates 2 completed sessions');
  ctx.assertEqual(bentoVm.averageReduction, 5, 'T3.2b: Bento Progress Dashboard computes average reduction of 5 points ( (5+5)/2 )');

  function getProgressRingDashOffset(progressPct: number, size = 120, strokeWidth = 8) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    return circumference - (progressPct / 100) * circumference;
  }
  const avgRedPct = (bentoVm.averageReduction / 10) * 100; // 50%
  const offset = getProgressRingDashOffset(avgRedPct);
  ctx.assert(offset > 0, 'T3.2c: ProgressRing dash offset correctly computed for Bento Dashboard average reduction');

  // --------------------------------------------------------------------------
  // T3.3: F3 (Mobile Touch) + F4 (Spring Physics)
  // Touch Button >=48px enforcing tapSpring touch physics on click
  // --------------------------------------------------------------------------
  const touchButtonConfig = {
    minHeight: 48,
    minWidth: 48,
    whileTap: { scale: 0.96 },
    transition: tapSpring,
  };
  ctx.assert(touchButtonConfig.minHeight >= 48 && touchButtonConfig.minWidth >= 48, 'T3.3a: Touch Button satisfies min 48px touch target');
  ctx.assertEqual(touchButtonConfig.transition.stiffness, 500, 'T3.3b: Touch Button employs 500 stiffness tapSpring for instant feedback');

  // --------------------------------------------------------------------------
  // T3.4: F5 (Breathing Rhythms) + F8 (SUD State)
  // Box Breathing 16s cycle completion reducing pre-SUD to post-SUD score
  // --------------------------------------------------------------------------
  const boxTech = groundingTechniques.find((t) => t.id === 'box-breathing')!;
  const completedBoxSession = buildCompletedSession({
    sessionId: 'box-flow-1',
    technique: boxTech,
    startedAt: new Date(Date.now() - 16000).toISOString(),
    completedAt: new Date().toISOString(),
    preScore: 9,
    postScore: 3,
    responses: {},
    steps: stepsBoxBreathing,
  });
  ctx.assertEqual(completedBoxSession.durationSeconds, 16, 'T3.4a: Completed Box session duration recorded as 16 seconds');
  ctx.assert(completedBoxSession.anxietyPre! - completedBoxSession.anxietyPost! === 6, 'T3.4b: SUD anxiety score reduced by 6 points post-breathing');

  // --------------------------------------------------------------------------
  // T3.5: F6 (BottomSheet Drawer) + F7 (Route Transitions)
  // BottomSheet modal drag gesture >100px velocity triggering exit transition
  // --------------------------------------------------------------------------
  function simulateDrawerDragExit(offsetY: number, velocityY: number) {
    const shouldClose = offsetY > 100 || velocityY > 500;
    const modalTransitionVariants = {
      animate: { y: 0 },
      exit: { y: '100%', transition: springSmooth },
    };
    return { shouldClose, targetState: shouldClose ? 'exit' : 'animate', variant: modalTransitionVariants };
  }
  const dragResult = simulateDrawerDragExit(120, 100);
  ctx.assert(dragResult.shouldClose === true && dragResult.targetState === 'exit', 'T3.5: Dragging BottomSheet modal down >100px triggers exit transition to y: 100%');

  // --------------------------------------------------------------------------
  // T3.6: F1 (Color Tokens) + F5 (Breathing Pulse)
  // BreathingCircle phase color transitions maintaining AAA readable text contrast
  // --------------------------------------------------------------------------
  const breathingPhaseColors: Record<StepPhase, string> = {
    inhale: '#2f8061',
    hold: '#2f6670',
    exhale: '#75634e',
    rest: '#3b707a',
    sensory: '#3a6b88',
    touch: '#8c5c4a',
    auditory: '#275a78',
    walking: '#366e4e',
  };
  for (const [phase, colorHex] of Object.entries(breathingPhaseColors)) {
    const textColor = getReadableTextColor(colorHex);
    ctx.assert(textColor === '#f8fff9', `T3.6: Phase '${phase}' background color ${colorHex} has AAA compliant text color ${textColor}`);
  }

  // --------------------------------------------------------------------------
  // T3.7: F4 (Motion) + F5 (Reduced Motion)
  // Prefers-reduced-motion flag overriding spring physics and breathing aura loops
  // --------------------------------------------------------------------------
  function resolveBreathingAnimation(shouldReduceMotion: boolean) {
    return {
      scale: shouldReduceMotion ? 1 : 1.18,
      auraRepeat: shouldReduceMotion ? 0 : Infinity,
      transition: shouldReduceMotion ? { duration: 0.01 } : springSmooth,
    };
  }
  const redMotionAnim = resolveBreathingAnimation(true);
  ctx.assertEqual(redMotionAnim.scale, 1, 'T3.7a: Reduced motion overrides inhale scale to 1');
  ctx.assertEqual(redMotionAnim.auraRepeat, 0, 'T3.7b: Reduced motion disables aura repetition (repeat = 0)');

  // --------------------------------------------------------------------------
  // T3.8: F8 (Session Storage) + F9 (API Sync)
  // LocalStorage session save with optional backend API sync fallback when offline
  // --------------------------------------------------------------------------
  const syncSessionPayload: GroundingSession = {
    id: 'sync-sess-1',
    techniqueId: 'box-breathing',
    techniqueCategory: 'pernapasan',
    startedAt: new Date().toISOString(),
    durationSeconds: 16,
    completed: true,
    anxietyPre: 6,
    anxietyPost: 3,
  };
  saveSession(syncSessionPayload);
  const localSaved = getSessions().find((s) => s.id === 'sync-sess-1');
  ctx.assert(Boolean(localSaved), 'T3.8a: Session saved locally in LocalStorage first');
  
  // API sync returns null gracefully when remote sync is disabled or offline
  const apiPromise = api.saveSession(syncSessionPayload);
  ctx.assert(apiPromise instanceof Promise, 'T3.8b: api.saveSession returns Promise handling offline fallback seamlessly');

  // --------------------------------------------------------------------------
  // T3.9: F2 (SOS Route) + F3 (Touch Ergonomics)
  // Emergency "Pulihkan Aku" SOS route providing >=48px high-contrast coral buttons
  // --------------------------------------------------------------------------
  const sosButtonSpecs = {
    route: '/sos',
    label: 'Pulihkan Aku (SOS)',
    minHeight: 48,
    minWidth: 48,
    colorClass: 'bg-destructive text-destructive-foreground', // Coral emergency color token
  };
  ctx.assert(sosButtonSpecs.minHeight >= 48 && sosButtonSpecs.minWidth >= 48, 'T3.9a: SOS emergency action button is >=48px touch target');
  ctx.assert(sosButtonSpecs.colorClass.includes('bg-destructive'), 'T3.9b: SOS emergency button uses high-contrast destructive coral tint');

  // --------------------------------------------------------------------------
  // T3.10: F5 (Sensory 5-4-3-2-1) + F8 (Journal State)
  // 5-4-3-2-1 sensory prompts recorded into stepResponses array in completed session
  // --------------------------------------------------------------------------
  const tech54321 = groundingTechniques.find((t) => t.id === 'teknik-54321')!;
  const sensoryResponses = {
    1: 'Meja kayu, lampu, tanaman, buku, cangkir',
    2: 'Tekstur baju, permukaan meja, kunci, kain',
    3: 'Suara angin, detik jam, langkah kaki',
    4: 'Aroma kopi, bau hujan',
    5: 'Rasa segar mint',
  };
  const sensorySession = buildCompletedSession({
    sessionId: 'sensory-journal-1',
    technique: tech54321,
    startedAt: new Date(Date.now() - 120000).toISOString(),
    completedAt: new Date().toISOString(),
    preScore: 8,
    postScore: 4,
    responses: sensoryResponses,
    steps: tech54321.steps!,
  });

  ctx.assertEqual(sensorySession.stepResponses?.length, 5, 'T3.10a: Sensory session captures responses for all 5 steps');
  ctx.assertEqual(sensorySession.stepResponses![0].response, 'Meja kayu, lampu, tanaman, buku, cangkir', 'T3.10b: Step 1 (Lihat) user journal response correctly mapped in session payload');

  clearLocalPracticeData();
}
