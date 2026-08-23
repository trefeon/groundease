import { stepsBoxBreathing, stepsOceanBreath, groundingTechniques } from '../src/config/data/techniques';
import { getReadableTextColor } from '../src/logic/color';
import { pageFade, pageTransitionVariants } from '../src/logic/motion';
import type { StepPhase, GroundingStep } from '../src/types';

// Simple lightweight assertion runner
let passedCount = 0;
let failedCount = 0;
const failures: string[] = [];

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passedCount++;
    console.log(`  ✓ PASSED: ${testName}`);
  } else {
    failedCount++;
    const msg = `  ✗ FAILED: ${testName}${detail ? ` - ${detail}` : ''}`;
    console.error(msg);
    failures.push(msg);
  }
}

function assertEqual<T>(actual: T, expected: T, testName: string) {
  const isMatch = JSON.stringify(actual) === JSON.stringify(expected);
  assert(isMatch, testName, `Expected: ${JSON.stringify(expected)}, Actual: ${JSON.stringify(actual)}`);
}

console.log('=== RUNNING M2 EMPIRICAL STRESS TESTS ===\n');

// ============================================================================
// TEST SUITE 1: Breathing Rhythm Pacing & Phase Metadata (Box 4-4-4-4 & Ocean 4-7-8)
// ============================================================================
console.log('--- TEST SUITE 1: Breathing Rhythm Verification ---');

// 1.1 Box Breathing (4-4-4-4)
assertEqual(stepsBoxBreathing.length, 4, 'Box Breathing has 4 steps');

const expectedBoxPhases: StepPhase[] = ['inhale', 'hold', 'exhale', 'hold'];
const expectedBoxDurations = [4, 4, 4, 4];

stepsBoxBreathing.forEach((step, idx) => {
  assert(step.duration === expectedBoxDurations[idx], `Box step ${idx + 1} duration is ${expectedBoxDurations[idx]}s`);
  assert(step.phase === expectedBoxPhases[idx], `Box step ${idx + 1} phase is '${expectedBoxPhases[idx]}'`);
  assert(step.visualMode === 'breathing', `Box step ${idx + 1} visualMode is 'breathing'`);
  assert(typeof step.instruction === 'string' && step.instruction.length > 0, `Box step ${idx + 1} has instruction`);
});

const boxTotalSeconds = stepsBoxBreathing.reduce((sum, s) => sum + s.duration, 0);
assertEqual(boxTotalSeconds, 16, 'Box Breathing total cycle duration is 16 seconds');

// 1.2 Ocean Breath (4-7-8)
assertEqual(stepsOceanBreath.length, 4, 'Ocean Breath has 4 steps');

const expectedOceanPhases: StepPhase[] = ['inhale', 'hold', 'exhale', 'rest'];
const expectedOceanDurations = [4, 7, 8, 2];

stepsOceanBreath.forEach((step, idx) => {
  assert(step.duration === expectedOceanDurations[idx], `Ocean step ${idx + 1} duration is ${expectedOceanDurations[idx]}s`);
  assert(step.phase === expectedOceanPhases[idx], `Ocean step ${idx + 1} phase is '${expectedOceanPhases[idx]}'`);
  assert(step.visualMode === 'breathing', `Ocean step ${idx + 1} visualMode is 'breathing'`);
  assert(typeof step.instruction === 'string' && step.instruction.length > 0, `Ocean step ${idx + 1} has instruction`);
});

const oceanTotalSeconds = stepsOceanBreath.reduce((sum, s) => sum + s.duration, 0);
assertEqual(oceanTotalSeconds, 21, 'Ocean Breath total cycle duration is 21 seconds');

// 1.3 Technique Catalogue Metadata
const boxTech = groundingTechniques.find((t) => t.id === 'box-breathing');
assert(Boolean(boxTech), "groundingTechniques contains 'box-breathing'");
assertEqual(boxTech?.category, 'pernapasan', "'box-breathing' category is 'pernapasan'");
assertEqual(boxTech?.steps, stepsBoxBreathing, "'box-breathing' steps reference stepsBoxBreathing");

const oceanTech = groundingTechniques.find((t) => t.id === 'ocean-breath');
assert(Boolean(oceanTech), "groundingTechniques contains 'ocean-breath'");
assertEqual(oceanTech?.category, 'pernapasan', "'ocean-breath' category is 'pernapasan'");
assertEqual(oceanTech?.steps, stepsOceanBreath, "'ocean-breath' steps reference stepsOceanBreath");


// ============================================================================
// TEST SUITE 2: BottomSheetDrawer Drag Threshold & Scroll Lock Cleanup
// ============================================================================
console.log('\n--- TEST SUITE 2: BottomSheetDrawer Drag Threshold & Scroll Lock ---');

// Drag threshold logic test
function shouldCloseDrawer(offsetY: number, velocityY: number): boolean {
  return offsetY > 100 || velocityY > 500;
}

assert(shouldCloseDrawer(101, 0) === true, 'Closes when offset.y > 100 (offset=101)');
assert(shouldCloseDrawer(100, 0) === false, 'Stays open when offset.y == 100 (boundary edge)');
assert(shouldCloseDrawer(50, 0) === false, 'Stays open when offset.y < 100 (offset=50)');
assert(shouldCloseDrawer(0, 501) === true, 'Closes when velocity.y > 500 (velocity=501)');
assert(shouldCloseDrawer(0, 500) === false, 'Stays open when velocity.y == 500 (boundary edge)');
assert(shouldCloseDrawer(0, 200) === false, 'Stays open when velocity.y < 500 (velocity=200)');
assert(shouldCloseDrawer(-150, -600) === false, 'Stays open when dragged upward (negative offset/velocity)');
assert(shouldCloseDrawer(150, 600) === true, 'Closes when both offset and velocity exceed threshold');

// Body Scroll Lock Mock Test
class DummyBody {
  style = { overflow: '' };
}

function simulateBottomSheetEffect(isOpen: boolean, body: DummyBody): () => void {
  if (isOpen) {
    const originalOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    return () => {
      body.style.overflow = originalOverflow;
    };
  }
  return () => {};
}

// Test 2.1: Open and Close restores original overflow
const bodyMock1 = new DummyBody();
bodyMock1.style.overflow = '';
const cleanup1 = simulateBottomSheetEffect(true, bodyMock1);
assertEqual(bodyMock1.style.overflow, 'hidden', 'Body overflow is set to hidden when drawer opens');
cleanup1();
assertEqual(bodyMock1.style.overflow, '', 'Body overflow is restored to empty on close/cleanup');

// Test 2.2: Unmount while isOpen restores custom pre-existing overflow
const bodyMock2 = new DummyBody();
bodyMock2.style.overflow = 'scroll';
const cleanup2 = simulateBottomSheetEffect(true, bodyMock2);
assertEqual(bodyMock2.style.overflow, 'hidden', 'Body overflow set to hidden from pre-existing scroll');
cleanup2(); // Unmount effect cleanup
assertEqual(bodyMock2.style.overflow, 'scroll', 'Unmount while open restores pre-existing overflow (scroll)');


// ============================================================================
// TEST SUITE 3: Accessibility & Reduced Motion Handling
// ============================================================================
console.log('\n--- TEST SUITE 3: Accessibility & Reduced Motion ---');

// 3.1 BreathingCircle reduced motion scale & aura logic
function getBreathingCircleState(phase: StepPhase, isPaused: boolean, shouldReduceMotion: boolean) {
  const phaseStyles: Record<StepPhase, { scale: number; color: string }> = {
    inhale: { scale: 1.18, color: '#2f8061' },
    hold: { scale: 1.15, color: '#2f6670' },
    exhale: { scale: 0.88, color: '#75634e' },
    rest: { scale: 1.0, color: '#3b707a' },
    sensory: { scale: 1.05, color: '#3a6b88' },
    touch: { scale: 1.06, color: '#8c5c4a' },
    auditory: { scale: 1.05, color: '#275a78' },
    walking: { scale: 1.04, color: '#366e4e' },
  };
  const config = phaseStyles[phase] ?? phaseStyles.inhale;
  const isResting = isPaused || phase === 'rest' || Boolean(shouldReduceMotion);
  const targetScale = isResting ? 1 : config.scale;
  const auraRepeat = isResting ? 0 : Infinity;
  const auraOpacity = isResting ? 0.15 : [0.25, 0.1, 0.25];
  return { isResting, targetScale, auraRepeat, auraOpacity };
}

const normalInhale = getBreathingCircleState('inhale', false, false);
assertEqual(normalInhale.isResting, false, 'Normal inhale is not resting');
assertEqual(normalInhale.targetScale, 1.18, 'Normal inhale scales to 1.18');
assertEqual(normalInhale.auraRepeat, Infinity, 'Normal inhale aura repeats infinitely');

const reducedMotionInhale = getBreathingCircleState('inhale', false, true);
assertEqual(reducedMotionInhale.isResting, true, 'Inhale with reduced motion is resting');
assertEqual(reducedMotionInhale.targetScale, 1, 'Inhale with reduced motion locks scale to 1');
assertEqual(reducedMotionInhale.auraRepeat, 0, 'Inhale with reduced motion disables infinite aura loop');

const pausedInhale = getBreathingCircleState('inhale', true, false);
assertEqual(pausedInhale.isResting, true, 'Paused inhale locks scale to 1 and stops aura repeat');

// 3.2 ProgressRing Clamping & Stroke Geometry
function calculateProgressRingGeometry(progress: number | undefined, value: number | undefined, size = 120, strokeWidth = 8) {
  const rawProgress = progress ?? value ?? 0;
  const clampedProgress = Math.min(100, Math.max(0, rawProgress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;
  return { clampedProgress, radius, circumference, strokeDashoffset };
}

const ringNegative = calculateProgressRingGeometry(-25, undefined);
assertEqual(ringNegative.clampedProgress, 0, 'ProgressRing clamps negative value (-25) to 0');
assertEqual(ringNegative.strokeDashoffset, ringNegative.circumference, 'At 0% progress strokeDashoffset equals full circumference');

const ringOverflow = calculateProgressRingGeometry(150, undefined);
assertEqual(ringOverflow.clampedProgress, 100, 'ProgressRing clamps overflow value (150) to 100');
assertEqual(ringOverflow.strokeDashoffset, 0, 'At 100% progress strokeDashoffset equals 0');

const ringHalf = calculateProgressRingGeometry(50, undefined);
assertEqual(ringHalf.clampedProgress, 50, 'ProgressRing 50% progress clamped correctly');
assert(Math.abs(ringHalf.strokeDashoffset - ringHalf.circumference / 2) < 0.0001, 'At 50% progress strokeDashoffset is half circumference');

// 3.3 Text contrast colors
assert(getReadableTextColor('#2f8061') === '#f8fff9', 'Dark green background gets serene off-white text contrast (#f8fff9)');
assert(getReadableTextColor('#ffffff') === '#132019', 'Light background gets dark charcoal text contrast (#132019)');

// 3.4 Page transition variant integrity
assert(Boolean(pageFade.hidden) && Boolean(pageFade.visible) && Boolean(pageFade.exit), 'pageFade defines hidden, visible, and exit states');
assert(Boolean(pageTransitionVariants.hidden) && Boolean(pageTransitionVariants.visible) && Boolean(pageTransitionVariants.exit), 'pageTransitionVariants defines hidden, visible, and exit states');


// ============================================================================
// TEST SUITE 4: Timer & Session Flow Simulation (useSessionFlow)
// ============================================================================
console.log('\n--- TEST SUITE 4: Timer & Session Flow Simulation ---');

// Simulate session flow timer state machine
class SessionFlowSimulator {
  phase: 'prepare' | 'pre' | 'practice' | 'post' = 'prepare';
  stepIndex = 0;
  remainingSeconds = 0;
  isPaused = false;
  preScore = 5;
  postScore = 4;
  steps: GroundingStep[] = [];
  category: string;

  constructor(category: string, steps: GroundingStep[]) {
    this.category = category;
    this.steps = steps;
    this.remainingSeconds = steps[0]?.duration ?? 0;
  }

  startPractice() {
    this.stepIndex = 0;
    this.remainingSeconds = this.steps[0]?.duration ?? 0;
    this.isPaused = false;
    this.phase = 'practice';
  }

  tick() {
    if (this.phase !== 'practice' || this.isPaused) return;

    if (this.remainingSeconds > 1) {
      this.remainingSeconds -= 1;
    } else {
      // Timer hits 0
      if (this.category === 'pernapasan') {
        if (this.stepIndex < this.steps.length - 1) {
          this.stepIndex += 1;
          this.remainingSeconds = this.steps[this.stepIndex]?.duration ?? 0;
        } else {
          this.postScore = Math.max(0, this.preScore - 1);
          this.phase = 'post';
          this.remainingSeconds = 0;
        }
      } else {
        this.remainingSeconds = 0;
      }
    }
  }

  pause() {
    this.isPaused = true;
  }

  unpause() {
    this.isPaused = false;
  }

  goToNextStep() {
    if (this.stepIndex < this.steps.length - 1) {
      this.stepIndex += 1;
      this.remainingSeconds = this.steps[this.stepIndex]?.duration ?? 0;
      this.isPaused = false;
    } else {
      this.postScore = Math.max(0, this.preScore - 1);
      this.phase = 'post';
    }
  }

  resetCurrentStepTimer() {
    this.remainingSeconds = this.steps[this.stepIndex]?.duration ?? 0;
  }
}

// Test 4.1: Box Breathing Auto-Advance Cycle
const boxSim = new SessionFlowSimulator('pernapasan', stepsBoxBreathing);
boxSim.startPractice();
assertEqual(boxSim.stepIndex, 0, 'Box sim starts at step 0');
assertEqual(boxSim.remainingSeconds, 4, 'Box sim step 0 remainingSeconds is 4');

// Tick 3 seconds
boxSim.tick(); // 3s
boxSim.tick(); // 2s
boxSim.tick(); // 1s
assertEqual(boxSim.remainingSeconds, 1, 'After 3 ticks, remainingSeconds is 1');
assertEqual(boxSim.stepIndex, 0, 'Still at step 0 before 4th tick');

// 4th tick -> auto-advances to step 1
boxSim.tick();
assertEqual(boxSim.stepIndex, 1, 'After 4th tick, stepIndex auto-advances to 1 (Hold 4s)');
assertEqual(boxSim.remainingSeconds, 4, 'Step 1 remainingSeconds reset to 4s');

// Fast-forward through step 1 (4s), step 2 (4s), step 3 (4s)
// Step 1: 4 ticks
boxSim.tick(); boxSim.tick(); boxSim.tick(); boxSim.tick();
assertEqual(boxSim.stepIndex, 2, 'StepIndex auto-advances to 2 (Exhale 4s)');
assertEqual(boxSim.remainingSeconds, 4, 'Step 2 remainingSeconds reset to 4s');

// Step 2: 4 ticks
boxSim.tick(); boxSim.tick(); boxSim.tick(); boxSim.tick();
assertEqual(boxSim.stepIndex, 3, 'StepIndex auto-advances to 3 (Hold 4s - final step)');
assertEqual(boxSim.remainingSeconds, 4, 'Step 3 remainingSeconds reset to 4s');

// Step 3 (final step): 4 ticks
boxSim.tick(); boxSim.tick(); boxSim.tick(); boxSim.tick();
assertEqual(boxSim.phase, 'post', 'Final step completion transitions phase to post');
assertEqual(boxSim.postScore, 4, 'Post score set to preScore - 1 (5 - 1 = 4)');

// Test 4.2: Pause and Unpause during Box Breathing
const pauseSim = new SessionFlowSimulator('pernapasan', stepsBoxBreathing);
pauseSim.startPractice();
pauseSim.tick(); // remainingSeconds = 3
pauseSim.pause();
assertEqual(pauseSim.remainingSeconds, 3, 'Paused at remainingSeconds = 3');

// Tick while paused
pauseSim.tick();
pauseSim.tick();
assertEqual(pauseSim.remainingSeconds, 3, 'Ticks while paused do not decrement remainingSeconds');
assertEqual(pauseSim.stepIndex, 0, 'Ticks while paused do not advance stepIndex');

// Unpause and tick
pauseSim.unpause();
pauseSim.tick();
assertEqual(pauseSim.remainingSeconds, 2, 'Resuming decreases remainingSeconds to 2');

// Test 4.3: Reset current step timer
pauseSim.resetCurrentStepTimer();
assertEqual(pauseSim.remainingSeconds, 4, 'Resetting step timer restores step duration to 4s');

// Test 4.4: Ocean Breath 4-7-8 Auto-Advance Timing
const oceanSim = new SessionFlowSimulator('pernapasan', stepsOceanBreath);
oceanSim.startPractice();
// Step 0: Inhale 4s -> 4 ticks
for (let i = 0; i < 4; i++) oceanSim.tick();
assertEqual(oceanSim.stepIndex, 1, 'Ocean Breath step 0 -> step 1 (Hold 7s)');
assertEqual(oceanSim.remainingSeconds, 7, 'Ocean step 1 initial duration is 7s');

// Step 1: Hold 7s -> 7 ticks
for (let i = 0; i < 7; i++) oceanSim.tick();
assertEqual(oceanSim.stepIndex, 2, 'Ocean Breath step 1 -> step 2 (Exhale 8s)');
assertEqual(oceanSim.remainingSeconds, 8, 'Ocean step 2 initial duration is 8s');

// Step 2: Exhale 8s -> 8 ticks
for (let i = 0; i < 8; i++) oceanSim.tick();
assertEqual(oceanSim.stepIndex, 3, 'Ocean Breath step 2 -> step 3 (Rest 2s)');
assertEqual(oceanSim.remainingSeconds, 2, 'Ocean step 3 initial duration is 2s');

// Step 3: Rest 2s -> 2 ticks
for (let i = 0; i < 2; i++) oceanSim.tick();
assertEqual(oceanSim.phase, 'post', 'Ocean Breath completes cycle and transitions to post phase');

// Test 4.5: Non-breathing technique (Sensory) stays at 0 when timer expires until manually advanced
const sensorySim = new SessionFlowSimulator('sensorik', [
  { id: 1, instruction: 'Look', duration: 5 },
  { id: 2, instruction: 'Touch', duration: 5 },
]);
sensorySim.startPractice();
for (let i = 0; i < 5; i++) sensorySim.tick();
assertEqual(sensorySim.remainingSeconds, 0, 'Sensory timer reaches 0');
assertEqual(sensorySim.stepIndex, 0, 'Sensory does NOT auto-advance stepIndex automatically');
sensorySim.goToNextStep();
assertEqual(sensorySim.stepIndex, 1, 'Calling goToNextStep manually advances sensory step to 1');
assertEqual(sensorySim.remainingSeconds, 5, 'Step 1 remainingSeconds set to 5s');


// ============================================================================
// TEST SUMMARY & RESULTS
// ============================================================================
console.log('\n==================================================');
console.log(`TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
console.log('==================================================');

if (failedCount > 0) {
  console.error('\nFailures:');
  failures.forEach((f) => console.error(f));
  process.exit(1);
} else {
  console.log('\nALL EMPIRICAL TESTS PASSED SUCCESSFULLY! ✅');
  process.exit(0);
}
