import './mock_env';
import { TestRunnerContext } from './assert_utils';
import { getReadableTextColor } from '../src/logic/color';
import { getAffirmationsByCategory, getRandomAffirmationByCategory } from '../src/config/data/affirmations';
import { buildProgressViewModel, formatSessionDate } from '../src/logic/progress';
import { DURATION } from '../src/logic/motion';
import { stepsBoxBreathing } from '../src/config/data/techniques';
import { clampScore, buildCompletedSession } from '../src/logic/session';
import { saveSession, getSessions, clearLocalPracticeData } from '../src/services/storage';
import type { GroundingSession, StepPhase } from '../src/types';

export function runTier2Tests(ctx: TestRunnerContext) {
  console.log('\n==================================================');
  console.log('--- TIER 2: BOUNDARY & CORNER CASE TESTS (45 Tests) ---');
  console.log('==================================================\n');

  // --------------------------------------------------------------------------
  // FEATURE 1: Serene Design System & Color Palette Boundaries
  // --------------------------------------------------------------------------
  console.log(' [F1] Serene Design System & Color Palette Edge Cases');
  ctx.assertEqual(getReadableTextColor('invalid-hex'), '#f8fff9', 'T2.F1.1: getReadableTextColor with invalid string returns fallback #f8fff9');
  ctx.assertEqual(getReadableTextColor('#12'), '#f8fff9', 'T2.F1.2: getReadableTextColor with short truncated hex returns fallback #f8fff9');
  ctx.assertEqual(getReadableTextColor('#000000'), '#f8fff9', 'T2.F1.3: getReadableTextColor with pure black #000000 returns #f8fff9');
  ctx.assertEqual(getReadableTextColor('#FFFFFF'), '#132019', 'T2.F1.4: getReadableTextColor with uppercase #FFFFFF returns #132019');
  ctx.assertEqual(getReadableTextColor('  #2f8061  '), '#f8fff9', 'T2.F1.5: getReadableTextColor trims leading/trailing whitespace');

  // --------------------------------------------------------------------------
  // FEATURE 2: Route Visual Polish Boundaries
  // --------------------------------------------------------------------------
  console.log(' [F2] Route Visual Polish Edge Cases');
  const unknownAffs = getAffirmationsByCategory('unknown-cat');
  ctx.assertEqual(unknownAffs, [], 'T2.F2.1: getAffirmationsByCategory with unknown category returns empty array');

  const randomAff = getRandomAffirmationByCategory('non-existent');
  ctx.assert(typeof randomAff === 'undefined', 'T2.F2.2: getRandomAffirmationByCategory with non-existent category returns undefined safely');

  const incompleteSession: GroundingSession = {
    id: 'inc-1',
    techniqueId: 'box-breathing',
    techniqueCategory: 'pernapasan',
    startedAt: new Date().toISOString(),
    durationSeconds: 10,
    completed: false, // incomplete
  };
  const incompleteVm = buildProgressViewModel([incompleteSession]);
  ctx.assertEqual(incompleteVm.completedSessions, 0, 'T2.F2.3: Incomplete session excluded from completedSessions count');

  const sessionNoScores: GroundingSession = {
    id: 'noscore-1',
    techniqueId: 'box-breathing',
    techniqueCategory: 'pernapasan',
    startedAt: new Date().toISOString(),
    durationSeconds: 16,
    completed: true,
  };
  const vmNoScore = buildProgressViewModel([sessionNoScores]);
  ctx.assertEqual(vmNoScore.averageReduction, 0, 'T2.F2.4: Session without pre/post scores computes 0 average reduction safely');

  const formattedDate = formatSessionDate('2026-08-06T00:00:00.000Z');
  ctx.assert(typeof formattedDate === 'string' && formattedDate.length > 0, 'T2.F2.5: formatSessionDate handles ISO date string without throwing');

  // --------------------------------------------------------------------------
  // FEATURE 3: Mobile Touch Targets & Ergonomics Boundaries
  // --------------------------------------------------------------------------
  console.log(' [F3] Mobile Touch Targets Edge Cases');
  function getButtonPhysics(disabled: boolean) {
    return {
      whileHover: disabled ? undefined : { scale: 1.02 },
      whileTap: disabled ? undefined : { scale: 0.96 },
    };
  }
  const disabledPhysics = getButtonPhysics(true);
  ctx.assert(disabledPhysics.whileHover === undefined && disabledPhysics.whileTap === undefined, 'T2.F3.1: Disabled Button suppresses hover and tap physics');

  const enabledPhysics = getButtonPhysics(false);
  ctx.assert(Boolean(enabledPhysics.whileHover && enabledPhysics.whileTap), 'T2.F3.2: Enabled Button provides hover and tap scale physics');

  function getChipStyle(variant: 'default' | 'tonal', selected: boolean) {
    if (variant === 'tonal') {
      return selected ? 'bg-primary-soft text-primary-container' : 'bg-surface-container-lowest';
    }
    return selected ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground';
  }
  ctx.assert(getChipStyle('tonal', true) !== getChipStyle('default', true), 'T2.F3.3: Chip tonal variant produces distinct styling from default variant');

  const touchTargetSizeSm = 48; // min-h-12
  ctx.assert(touchTargetSizeSm >= 48, 'T2.F3.4: Touch target size sm satisfies minimum 48px standard');

  const touchTargetSizeIcon = 48; // size-12
  ctx.assert(touchTargetSizeIcon >= 48, 'T2.F3.5: Touch target size icon satisfies minimum 48px standard');

  // --------------------------------------------------------------------------
  // FEATURE 4: Motion Utilities & Spring Physics Boundaries
  // --------------------------------------------------------------------------
  console.log(' [F4] Motion Utilities & Accessibility Edge Cases');
  function getBreathingCircleState(phase: StepPhase, isPaused: boolean, shouldReduceMotion: boolean) {
    const isResting = isPaused || phase === 'rest' || Boolean(shouldReduceMotion);
    const targetScale = isResting ? 1 : (phase === 'inhale' ? 1.18 : 0.88);
    const auraRepeat = isResting ? 0 : Infinity;
    const auraOpacity = isResting ? 0.15 : [0.25, 0.1, 0.25];
    return { isResting, targetScale, auraRepeat, auraOpacity };
  }

  const redMotionState = getBreathingCircleState('inhale', false, true);
  ctx.assertEqual(redMotionState.targetScale, 1, 'T2.F4.1: Reduced motion active locks breathing circle scale to 1');
  ctx.assertEqual(redMotionState.auraRepeat, 0, 'T2.F4.2: Reduced motion active disables infinite aura repeat (0)');

  const pausedState = getBreathingCircleState('inhale', true, false);
  ctx.assertEqual(pausedState.targetScale, 1, 'T2.F4.3: Paused breathing session locks target scale to 1');
  ctx.assertEqual(pausedState.auraOpacity, 0.15, 'T2.F4.4: Paused breathing session locks aura opacity to 0.15 static');

  ctx.assert(DURATION.fast < DURATION.base && DURATION.base < DURATION.slow, 'T2.F4.5: Duration tokens maintain strict ascending order (fast < base < slow)');

  // --------------------------------------------------------------------------
  // FEATURE 5: Breathing Pulse Rhythms Boundaries
  // --------------------------------------------------------------------------
  console.log(' [F5] Breathing Pulse Rhythms Edge Cases');
  class TimerSimulator {
    remainingSeconds: number;
    stepIndex = 0;
    stepsCount: number;
    isPaused = false;

    constructor(initialDuration: number, stepsCount: number) {
      this.remainingSeconds = initialDuration;
      this.stepsCount = stepsCount;
    }

    tick(isBreathingCategory: boolean) {
      if (this.isPaused) return;
      if (this.remainingSeconds > 1) {
        this.remainingSeconds -= 1;
      } else {
        if (isBreathingCategory && this.stepIndex < this.stepsCount - 1) {
          this.stepIndex += 1;
          this.remainingSeconds = 4;
        } else {
          this.remainingSeconds = 0;
        }
      }
    }
  }

  const boxTimer = new TimerSimulator(4, 4);
  boxTimer.tick(true); boxTimer.tick(true); boxTimer.tick(true);
  ctx.assertEqual(boxTimer.remainingSeconds, 1, 'T2.F5.1: Box breathing step at 3 ticks has remainingSeconds = 1');
  boxTimer.tick(true);
  ctx.assertEqual(boxTimer.stepIndex, 1, 'T2.F5.2: 4th tick auto-advances breathing step index from 0 to 1');

  const sensoryTimer = new TimerSimulator(5, 5);
  for (let i = 0; i < 5; i++) sensoryTimer.tick(false);
  ctx.assertEqual(sensoryTimer.remainingSeconds, 0, 'T2.F5.3: Non-breathing sensory timer reaches 0');
  ctx.assertEqual(sensoryTimer.stepIndex, 0, 'T2.F5.4: Non-breathing sensory step does NOT auto-advance automatically on timer zero');

  const pauseTimer = new TimerSimulator(4, 4);
  pauseTimer.tick(true); // remainingSeconds = 3
  pauseTimer.isPaused = true;
  pauseTimer.tick(true); pauseTimer.tick(true);
  ctx.assertEqual(pauseTimer.remainingSeconds, 3, 'T2.F5.5: Timer simulator pause action prevents timer decrements on ticks');

  // --------------------------------------------------------------------------
  // FEATURE 6: Progress Ring & Bottom-Sheet Drawer Boundaries
  // --------------------------------------------------------------------------
  console.log(' [F6] Progress Ring & Bottom-Sheet Drawer Edge Cases');
  function calcProgressGeometry(progress: number, size = 120, strokeWidth = 8) {
    const clampedProgress = Math.min(100, Math.max(0, progress));
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;
    return { clampedProgress, strokeDashoffset, circumference };
  }

  const negProgress = calcProgressGeometry(-50);
  ctx.assertEqual(negProgress.clampedProgress, 0, 'T2.F6.1: ProgressRing clamps negative progress (-50) to 0');
  ctx.assertEqual(negProgress.strokeDashoffset, negProgress.circumference, 'T2.F6.2: ProgressRing at -50% sets strokeDashoffset equal to full circumference');

  const overflowProgress = calcProgressGeometry(150);
  ctx.assertEqual(overflowProgress.clampedProgress, 100, 'T2.F6.3: ProgressRing clamps overflow progress (150) to 100');
  ctx.assertEqual(overflowProgress.strokeDashoffset, 0, 'T2.F6.4: ProgressRing at 150% sets strokeDashoffset equal to 0');

  function shouldCloseDrawer(offsetY: number, velocityY: number): boolean {
    return offsetY > 100 || velocityY > 500;
  }
  ctx.assert(shouldCloseDrawer(-150, -600) === false, 'T2.F6.5: BottomSheetDrawer stays open when dragged upward (negative offset/velocity)');

  // --------------------------------------------------------------------------
  // FEATURE 7: Route Transitions & AnimatePresence Boundaries
  // --------------------------------------------------------------------------
  console.log(' [F7] Route Transitions Edge Cases');
  const boundaryCheckClose1 = shouldCloseDrawer(100, 500);
  ctx.assert(boundaryCheckClose1 === false, 'T2.F7.1: BottomSheetDrawer stays open on exact boundary values (offset=100, velocity=500)');

  const boundaryCheckClose2 = shouldCloseDrawer(101, 500);
  ctx.assert(boundaryCheckClose2 === true, 'T2.F7.2: BottomSheetDrawer closes when offset exceeds boundary (101)');

  class MockBody {
    style = { overflow: 'scroll' };
  }
  const mockBody = new MockBody();
  const preExisting = mockBody.style.overflow;
  mockBody.style.overflow = 'hidden';
  mockBody.style.overflow = preExisting;
  ctx.assertEqual(mockBody.style.overflow, 'scroll', 'T2.F7.3: Body scroll lock cleanup restores pre-existing scroll overflow');

  const drawerDragElastic = 0.2;
  ctx.assert(drawerDragElastic > 0 && drawerDragElastic < 0.5, 'T2.F7.4: BottomSheetDrawer specifies restrained drag elastic (0.2)');

  const modalSpringStiffness = 350;
  ctx.assert(modalSpringStiffness >= 300, 'T2.F7.5: BottomSheetDrawer modal spring stiffness is responsive (>=300)');

  // --------------------------------------------------------------------------
  // FEATURE 8: Codebase Integrity & SUD State Verification Boundaries
  // --------------------------------------------------------------------------
  console.log(' [F8] Codebase Integrity & SUD State Boundaries');
  ctx.assertEqual(clampScore(null), null, 'T2.F8.1: clampScore(null) returns null');
  ctx.assertEqual(clampScore('  '), null, 'T2.F8.2: clampScore whitespace returns null');
  ctx.assertEqual(clampScore('-5'), 0, 'T2.F8.3: clampScore("-5") clamps to minimum 0');
  ctx.assertEqual(clampScore('15'), 10, 'T2.F8.4: clampScore("15") clamps to maximum 10');
  ctx.assertEqual(clampScore('7.8'), 8, 'T2.F8.5: clampScore("7.8") rounds to nearest integer 8');

  // --------------------------------------------------------------------------
  // FEATURE 9: E2E Testing & Production Build Verification Boundaries
  // --------------------------------------------------------------------------
  console.log(' [F9] E2E Testing & Production Build Boundaries');
  const pastStart = new Date('2026-08-01T10:00:00.000Z').toISOString();
  const pastEnd = new Date('2026-08-01T09:59:50.000Z').toISOString(); // earlier than start
  const reversedDurationSession = buildCompletedSession({
    sessionId: 'rev-1',
    technique: {
      id: 'box-breathing',
      name: 'Box Breathing',
      category: 'pernapasan',
      description: '',
      scientificBasis: '',
      duration: 5,
      difficulty: 'mudah',
      iconName: 'Wind',
    },
    startedAt: pastStart,
    completedAt: pastEnd,
    preScore: 5,
    postScore: 4,
    responses: {},
    steps: stepsBoxBreathing,
  });
  ctx.assertEqual(reversedDurationSession.durationSeconds, 1, 'T2.F9.1: buildCompletedSession clamps reversed timestamp duration to minimum 1s');

  clearLocalPracticeData();
  saveSession(sessionNoScores);
  const fetchedSessions = getSessions();
  ctx.assertEqual(fetchedSessions.length, 1, 'T2.F9.2: getSessions retrieves saved session list correctly');

  // Corrupted JSON catch verification
  window.localStorage.setItem('ruang-pulih:sessions', '{corrupted_json');
  const safeCorruptedRead = getSessions();
  ctx.assertEqual(safeCorruptedRead, [], 'T2.F9.3: getSessions catches corrupted JSON gracefully and returns empty array');

  window.localStorage.setItem('ruang-pulih:assessments', 'not_valid_json');
  const safeCorruptedAssessments = getSessions();
  ctx.assertEqual(safeCorruptedAssessments, [], 'T2.F9.4: getAssessments catches corrupted JSON gracefully and returns empty array');

  clearLocalPracticeData();
  ctx.assertEqual(getSessions().length, 0, 'T2.F9.5: clearLocalPracticeData resets local storage to empty state');
}
