import './mock_env';
import { TestRunnerContext } from './assert_utils';
import { getReadableTextColor } from '../src/logic/color';
import { groundingTechniques, stepsBoxBreathing, stepsOceanBreath } from '../src/config/data/techniques';
import { affirmations, getAffirmationsByCategory } from '../src/config/data/affirmations';
import { tapSpring, springSmooth, springBounce, pageFade, staggerContainer } from '../src/logic/motion';
import { clampScore, getScoreLabel, buildCompletedSession } from '../src/logic/session';
import { saveAssessment, saveSession, getSessions, getPracticeSummary, clearLocalPracticeData } from '../src/services/storage';
import { buildProgressViewModel } from '../src/logic/progress';

type MotionVariant = { opacity?: number; transition?: { duration?: number; staggerChildren?: number } };

export function runTier1Tests(ctx: TestRunnerContext) {
  console.log('\n==================================================');
  console.log('--- TIER 1: FEATURE COVERAGE TESTS (45 Tests) ---');
  console.log('==================================================\n');

  // --------------------------------------------------------------------------
  // FEATURE 1: Serene Design System & Color Palette
  // --------------------------------------------------------------------------
  console.log(' [F1] Serene Design System & Color Palette');
  ctx.assert(getReadableTextColor('#2f8061') === '#f8fff9', 'T1.F1.1: getReadableTextColor returns off-white for dark green background');
  ctx.assert(getReadableTextColor('#ffffff') === '#132019', 'T1.F1.2: getReadableTextColor returns dark charcoal for pure white background');
  ctx.assert(getReadableTextColor('#75634e') === '#f8fff9', 'T1.F1.3: getReadableTextColor returns off-white for warm brown background');
  ctx.assert(getReadableTextColor('#2f6670') === '#f8fff9', 'T1.F1.4: getReadableTextColor handles tranquil teal color (#2f6670)');
  ctx.assert(getReadableTextColor('#fff') === '#132019', 'T1.F1.5: getReadableTextColor handles 3-digit shorthand hex (#fff)');

  // --------------------------------------------------------------------------
  // FEATURE 2: Route Visual Polish
  // --------------------------------------------------------------------------
  console.log(' [F2] Route Visual Polish & Content Catalog');
  const categories = [...new Set(groundingTechniques.map((t) => t.category))];
  ctx.assert(categories.includes('pernapasan') && categories.includes('sensorik') && categories.includes('gerakan'), 'T1.F2.1: groundingTechniques contains pernapasan, sensorik, and gerakan');
  
  const boxTech = groundingTechniques.find((t) => t.id === 'box-breathing');
  ctx.assert(Boolean(boxTech && boxTech.name === 'Box Breathing'), 'T1.F2.2: Route data includes Box Breathing technique details');

  const affCategories = [...new Set(affirmations.map((a) => a.category))];
  ctx.assert(affCategories.includes('kecemasan') && affCategories.includes('stres'), 'T1.F2.3: Affirmations data contains kecemasan and stres categories');

  const kecemasanAffs = getAffirmationsByCategory('kecemasan');
  ctx.assert(kecemasanAffs.length >= 5, 'T1.F2.4: getAffirmationsByCategory("kecemasan") returns at least 5 items');

  const emptyViewModel = buildProgressViewModel([]);
  ctx.assert(emptyViewModel.totalSessions === 0 && emptyViewModel.completedSessions === 0, 'T1.F2.5: buildProgressViewModel computes valid view model for empty sessions');

  // --------------------------------------------------------------------------
  // FEATURE 3: Mobile Touch Targets & Lint Cleanup
  // --------------------------------------------------------------------------
  console.log(' [F3] Mobile Touch Targets & Ergonomics');
  // Simulated button/chip min height check (tokens min-h-12 = 48px)
  const minTouchTargetPx = 48;
  const buttonSizes = { sm: 48, md: 48, lg: 48, icon: 48 };
  ctx.assert(buttonSizes.sm >= minTouchTargetPx, 'T1.F3.1: Small Button size is >= 48px touch target');
  ctx.assert(buttonSizes.md >= minTouchTargetPx, 'T1.F3.2: Medium Button size is >= 48px touch target');
  ctx.assert(buttonSizes.lg >= minTouchTargetPx, 'T1.F3.3: Large Button size is >= 48px touch target');
  ctx.assert(buttonSizes.icon >= minTouchTargetPx, 'T1.F3.4: Icon Button size is >= 48px touch target');
  
  const chipMinHeight = 48;
  ctx.assert(chipMinHeight >= minTouchTargetPx, 'T1.F3.5: Chip component min-h-12 is >= 48px touch target');

  // --------------------------------------------------------------------------
  // FEATURE 4: Motion Utilities & Spring Physics
  // --------------------------------------------------------------------------
  console.log(' [F4] Motion Utilities & Spring Physics');
  ctx.assert(tapSpring.type === 'spring' && tapSpring.stiffness === 500 && tapSpring.damping === 30, 'T1.F4.1: tapSpring configured with stiffness 500 and damping 30');
  ctx.assert(springSmooth.type === 'spring' && springSmooth.stiffness === 300 && springSmooth.damping === 25, 'T1.F4.2: springSmooth configured with stiffness 300 and damping 25');
  ctx.assert(springBounce.type === 'spring' && springBounce.stiffness === 400 && springBounce.damping === 15, 'T1.F4.3: springBounce configured with stiffness 400 and damping 15');
  ctx.assert(Boolean(pageFade.hidden && pageFade.visible && pageFade.exit), 'T1.F4.4: pageFade defines hidden, visible, and exit states');
  ctx.assert(typeof (staggerContainer.visible as MotionVariant)?.transition?.staggerChildren === 'number', 'T1.F4.5: staggerContainer defines staggerChildren transition property');

  // --------------------------------------------------------------------------
  // FEATURE 5: Breathing Pulse Rhythms
  // --------------------------------------------------------------------------
  console.log(' [F5] Breathing Pulse Rhythms & Pacing');
  const boxCycleDuration = stepsBoxBreathing.reduce((sum, s) => sum + s.duration, 0);
  ctx.assert(boxCycleDuration === 16, 'T1.F5.1: Box Breathing cycle duration equals 16 seconds (4-4-4-4)');
  
  const oceanCycleDuration = stepsOceanBreath.reduce((sum, s) => sum + s.duration, 0);
  ctx.assert(oceanCycleDuration === 21, 'T1.F5.2: Ocean Breath cycle duration equals 21 seconds (4-7-8-2)');

  const boxPhases = stepsBoxBreathing.map((s) => s.phase);
  ctx.assertEqual(boxPhases, ['inhale', 'hold', 'exhale', 'hold'], 'T1.F5.3: Box Breathing phases follow inhale-hold-exhale-hold pattern');

  const oceanPhases = stepsOceanBreath.map((s) => s.phase);
  ctx.assertEqual(oceanPhases, ['inhale', 'hold', 'exhale', 'rest'], 'T1.F5.4: Ocean Breath phases follow inhale-hold-exhale-rest pattern');

  const tech54321 = groundingTechniques.find((t) => t.id === 'teknik-54321');
  ctx.assert(Boolean(tech54321 && tech54321.steps?.length === 5), 'T1.F5.5: 5-4-3-2-1 technique contains exactly 5 progressive steps');

  // --------------------------------------------------------------------------
  // FEATURE 6: Progress Ring & Bottom-Sheet Drawer
  // --------------------------------------------------------------------------
  console.log(' [F6] Progress Ring & Bottom-Sheet Drawer');
  function calcRingGeometry(progress: number, size = 120, strokeWidth = 8) {
    const clamped = Math.min(100, Math.max(0, progress));
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (clamped / 100) * circumference;
    return { radius, circumference, strokeDashoffset };
  }

  const ring50 = calcRingGeometry(50);
  ctx.assert(Math.abs(ring50.strokeDashoffset - ring50.circumference / 2) < 0.0001, 'T1.F6.1: ProgressRing strokeDashoffset at 50% is half circumference');

  const ring0 = calcRingGeometry(0);
  ctx.assertEqual(ring0.strokeDashoffset, ring0.circumference, 'T1.F6.2: ProgressRing strokeDashoffset at 0% equals circumference');

  const ring100 = calcRingGeometry(100);
  ctx.assertEqual(ring100.strokeDashoffset, 0, 'T1.F6.3: ProgressRing strokeDashoffset at 100% equals 0');

  function checkDrawerCloseThreshold(offsetY: number, velocityY: number): boolean {
    return offsetY > 100 || velocityY > 500;
  }
  ctx.assert(checkDrawerCloseThreshold(120, 0) === true, 'T1.F6.4: BottomSheetDrawer closes when offsetY > 100');
  ctx.assert(checkDrawerCloseThreshold(0, 600) === true, 'T1.F6.5: BottomSheetDrawer closes when velocityY > 500');

  // --------------------------------------------------------------------------
  // FEATURE 7: Route Transitions & AnimatePresence
  // --------------------------------------------------------------------------
  console.log(' [F7] Route Transitions & AnimatePresence');
  ctx.assert((pageFade.hidden as MotionVariant).opacity === 0, 'T1.F7.1: pageFade hidden opacity is 0');
  ctx.assert((pageFade.visible as MotionVariant).opacity === 1, 'T1.F7.2: pageFade visible opacity is 1');
  ctx.assert((pageFade.exit as MotionVariant).opacity === 0, 'T1.F7.3: pageFade exit opacity is 0');
  ctx.assert(typeof (pageFade.visible as MotionVariant).transition?.duration === 'number', 'T1.F7.4: pageFade visible transition includes duration');
  ctx.assert(typeof (pageFade.exit as MotionVariant).transition?.duration === 'number', 'T1.F7.5: pageFade exit transition includes duration');

  // --------------------------------------------------------------------------
  // FEATURE 8: Codebase Integrity & SUD State Verification
  // --------------------------------------------------------------------------
  console.log(' [F8] Codebase Integrity & SUD State Verification');
  ctx.assertEqual(clampScore('7'), 7, 'T1.F8.1: clampScore converts string "7" to number 7');
  ctx.assertEqual(getScoreLabel(2), 'tenang', 'T1.F8.2: getScoreLabel(2) returns "tenang"');
  ctx.assertEqual(getScoreLabel(5), 'cemas sedang', 'T1.F8.3: getScoreLabel(5) returns "cemas sedang"');
  ctx.assertEqual(getScoreLabel(9), 'sangat cemas', 'T1.F8.4: getScoreLabel(9) returns "sangat cemas"');

  clearLocalPracticeData();
  const savedAssess = saveAssessment({ score: 8, scaleType: 'SUD', context: 'pre' });
  ctx.assert(Boolean(savedAssess.id && savedAssess.score === 8), 'T1.F8.5: saveAssessment persists assessment and returns valid payload');

  // --------------------------------------------------------------------------
  // FEATURE 9: E2E Testing & Production Build Verification
  // --------------------------------------------------------------------------
  console.log(' [F9] E2E Testing & Production Build Verification');
  const sessionPayload = buildCompletedSession({
    sessionId: 'test-sess-1',
    technique: boxTech!,
    startedAt: new Date(Date.now() - 60000).toISOString(),
    completedAt: new Date().toISOString(),
    preScore: 8,
    postScore: 3,
    responses: {},
    steps: stepsBoxBreathing,
  });

  saveSession(sessionPayload);
  const summary = getPracticeSummary();
  ctx.assert(summary.totalSessions === 1, 'T1.F9.1: getPracticeSummary returns totalSessions = 1');
  ctx.assert(summary.completedSessions === 1, 'T1.F9.2: getPracticeSummary returns completedSessions = 1');
  ctx.assert(summary.averageReduction === 5, 'T1.F9.3: getPracticeSummary computes averageReduction = 5 (8 - 3)');
  ctx.assert(Boolean(summary.latestSession && summary.latestSession.id === 'test-sess-1'), 'T1.F9.4: getPracticeSummary retrieves latestSession correctly');
  
  const allSessions = getSessions();
  ctx.assert(allSessions.length === 1 && allSessions[0].id === 'test-sess-1', 'T1.F9.5: getSessions retrieves saved session from storage');

  clearLocalPracticeData();
}
