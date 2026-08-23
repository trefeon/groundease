import './mock_env';
import { TestRunnerContext } from './assert_utils';
import { groundingTechniques, stepsBoxBreathing, stepsOceanBreath } from '../src/config/data/techniques';
import { getAffirmationsByCategory, getRandomAffirmationByCategory } from '../src/config/data/affirmations';
import { clampScore, getScoreLabel, buildCompletedSession } from '../src/logic/session';
import { buildProgressViewModel } from '../src/logic/progress';
import { saveAssessment, saveSession, getSessions, getPracticeSummary, clearLocalPracticeData } from '../src/services/storage';
import { api } from '../src/services/api';
import type { GroundingSession, UserPreferences } from '../src/types';

export async function runTier4Tests(ctx: TestRunnerContext) {
  console.log('\n==================================================');
  console.log('--- TIER 4: REAL-WORLD APPLICATION SCENARIOS (6 Tests) ---');
  console.log('==================================================\n');

  clearLocalPracticeData();

  // --------------------------------------------------------------------------
  // T4.1: Emergency SOS "Pulihkan Aku" Crisis Workflow
  // User in acute anxiety opens SOS -> instant emergency Box Breathing -> pre 9 -> post 3 -> saved
  // --------------------------------------------------------------------------
  console.log(' [Workflow 1] Emergency SOS "Pulihkan Aku" Crisis Flow');
  
  // Step 1: Open SOS flow and record high pre-assessment score
  const sosPreScore = clampScore('9')!;
  ctx.assertEqual(sosPreScore, 9, 'T4.1a: Emergency SOS user pre-SUD score recorded as 9 (sangat cemas)');
  ctx.assertEqual(getScoreLabel(sosPreScore), 'sangat cemas', 'T4.1b: SOS pre-score labeled as "sangat cemas"');

  const sosPreAssessment = saveAssessment({
    score: sosPreScore,
    scaleType: 'SUD',
    context: 'pre',
  });
  ctx.assert(Boolean(sosPreAssessment.id), 'T4.1c: SOS pre-assessment saved with generated ID');

  // Step 2: Conduct emergency Box Breathing (4-4-4-4) 16s cycle
  const boxTech = groundingTechniques.find((t) => t.id === 'box-breathing')!;
  const sosStartTime = new Date(Date.now() - 16000).toISOString();
  const sosEndTime = new Date().toISOString();

  // Step 3: Record post-assessment score 3 (sedikit cemas)
  const sosPostScore = clampScore('3')!;
  ctx.assertEqual(sosPostScore, 3, 'T4.1d: Emergency SOS user post-SUD score recorded as 3 (sedikit cemas)');

  const sosSessionPayload = buildCompletedSession({
    sessionId: `sos-session-${Date.now()}`,
    technique: boxTech,
    startedAt: sosStartTime,
    completedAt: sosEndTime,
    preScore: sosPreScore,
    postScore: sosPostScore,
    responses: {},
    steps: stepsBoxBreathing,
  });

  saveSession(sosSessionPayload);
  const storedSosSession = getSessions().find((s) => s.id === sosSessionPayload.id);
  ctx.assert(Boolean(storedSosSession && storedSosSession.completed), 'T4.1e: Emergency SOS session saved in local storage with completed=true');
  ctx.assertEqual((storedSosSession?.anxietyPre ?? 0) - (storedSosSession?.anxietyPost ?? 0), 6, 'T4.1f: SOS workflow achieves 6-point anxiety reduction');

  clearLocalPracticeData();

  // --------------------------------------------------------------------------
  // T4.2: Full 5-4-3-2-1 Sensory Grounding Workflow
  // User completes 5 sensory prompts with journal entries -> pre 8 -> post 3 -> bento dashboard updates
  // --------------------------------------------------------------------------
  console.log(' [Workflow 2] 5-4-3-2-1 Sensory Grounding Session Flow');

  const tech54321 = groundingTechniques.find((t) => t.id === 'teknik-54321')!;
  const s54321Pre = 8;
  
  // User enters responses for all 5 senses
  const userJournalEntries = {
    1: 'Tanaman hias, bingkai foto, jam dinding, cangkir teh, jendela',
    2: 'Kain selimut lembut, meja kayu halus, karpet, dinginnya gelas',
    3: 'Kicauan burung di luar, suara kipas angin, deru mobil jauh',
    4: 'Aroma minyak kayu putih, wangi teh hangat',
    5: 'Rasa segar pasta gigi mint',
  };

  const s54321Post = 3;
  const s54321Session = buildCompletedSession({
    sessionId: `sensory-flow-${Date.now()}`,
    technique: tech54321,
    startedAt: new Date(Date.now() - 120000).toISOString(),
    completedAt: new Date().toISOString(),
    preScore: s54321Pre,
    postScore: s54321Post,
    responses: userJournalEntries,
    steps: tech54321.steps!,
  });

  saveSession(s54321Session);
  const bentoMetrics = buildProgressViewModel(getSessions());

  ctx.assertEqual(bentoMetrics.totalSessions, 1, 'T4.2a: Bento Progress Dashboard records 1 total session');
  ctx.assertEqual(bentoMetrics.averageReduction, 5, 'T4.2b: Bento Progress Dashboard records 5 points average reduction');
  ctx.assertEqual(bentoMetrics.recentSessions[0].stepResponses?.length, 5, 'T4.2c: Recent session stores all 5 step responses accurately');

  clearLocalPracticeData();

  // --------------------------------------------------------------------------
  // T4.3: Ocean Breath (4-7-8) Deep Relaxation & Pause Workflow
  // User starts Ocean Breath -> pauses midway -> resumes -> completes -> saved
  // --------------------------------------------------------------------------
  console.log(' [Workflow 3] Ocean Breath (4-7-8) Deep Relaxation & Pause Flow');

  const oceanTech = groundingTechniques.find((t) => t.id === 'ocean-breath')!;
  
  class OceanBreathSimulator {
    stepIndex = 0;
    remainingSeconds = 4;
    isPaused = false;
    completed = false;

    start() {
      this.stepIndex = 0;
      this.remainingSeconds = stepsOceanBreath[0].duration;
    }

    pause() {
      this.isPaused = true;
    }

    resume() {
      this.isPaused = false;
    }

    tick() {
      if (this.isPaused || this.completed) return;
      if (this.remainingSeconds > 1) {
        this.remainingSeconds -= 1;
      } else {
        if (this.stepIndex < stepsOceanBreath.length - 1) {
          this.stepIndex += 1;
          this.remainingSeconds = stepsOceanBreath[this.stepIndex].duration;
        } else {
          this.completed = true;
          this.remainingSeconds = 0;
        }
      }
    }
  }

  const oceanSim = new OceanBreathSimulator();
  oceanSim.start();
  
  // Tick through Inhale 4s -> Hold 7s
  for (let i = 0; i < 4; i++) oceanSim.tick(); // Step 1 complete
  ctx.assertEqual(oceanSim.stepIndex, 1, 'T4.3a: Ocean Breath advances to step 1 (Hold 7s)');

  // Pause session midway through step 1
  oceanSim.tick(); oceanSim.tick(); // remaining = 5
  oceanSim.pause();
  const pausedRemaining = oceanSim.remainingSeconds;
  oceanSim.tick(); oceanSim.tick(); // ticks while paused
  ctx.assertEqual(oceanSim.remainingSeconds, pausedRemaining, 'T4.3b: Pausing Ocean Breath freezes timer');

  // Resume and finish remaining steps
  oceanSim.resume();
  for (let i = 0; i < 5 + 8 + 2; i++) oceanSim.tick(); // Finish hold 5s + exhale 8s + rest 2s
  ctx.assert(oceanSim.completed === true, 'T4.3c: Resumed Ocean Breath session completes cycle successfully');

  const oceanSessionPayload = buildCompletedSession({
    sessionId: `ocean-sess-${Date.now()}`,
    technique: oceanTech,
    startedAt: new Date(Date.now() - 25000).toISOString(),
    completedAt: new Date().toISOString(),
    preScore: 7,
    postScore: 2,
    responses: {},
    steps: stepsOceanBreath,
  });
  saveSession(oceanSessionPayload);
  ctx.assert(getSessions().length === 1, 'T4.3d: Completed Ocean Breath session stored in local practice database');

  clearLocalPracticeData();

  // --------------------------------------------------------------------------
  // T4.4: Positive Affirmations Bookmark & Category Filter Workflow
  // Filter affirmations -> mark favorites -> store user preferences
  // --------------------------------------------------------------------------
  console.log(' [Workflow 4] Affirmations Library & Favorite Bookmarking Flow');

  const kecemasanList = getAffirmationsByCategory('kecemasan');
  const stresList = getAffirmationsByCategory('stres');
  ctx.assert(kecemasanList.length > 0 && stresList.length > 0, 'T4.4a: Affirmations correctly filtered by categories "kecemasan" and "stres"');

  const selectedAff1 = kecemasanList[0];
  const selectedAff2 = stresList[0];

  const userPrefs: UserPreferences = {
    theme: 'light',
    soundEnabled: true,
    volume: 0.8,
    favoriteTechniques: ['box-breathing'],
    favoriteAffirmations: [selectedAff1.id, selectedAff2.id],
  };

  ctx.assert(userPrefs.favoriteAffirmations.includes(selectedAff1.id), 'T4.4b: User preferences state includes first bookmarked affirmation');
  ctx.assert(userPrefs.favoriteAffirmations.includes(selectedAff2.id), 'T4.4c: User preferences state includes second bookmarked affirmation');

  const randomStresAff = getRandomAffirmationByCategory('stres');
  ctx.assert(Boolean(randomStresAff && randomStresAff.category === 'stres'), 'T4.4d: getRandomAffirmationByCategory("stres") returns valid category affirmation');

  // --------------------------------------------------------------------------
  // T4.5: Multi-Day Usage & Streak Resilience Workflow
  // Simulate 5 contiguous calendar days of practice -> 5 day streak -> miss 1 day -> recalculates
  // --------------------------------------------------------------------------
  console.log(' [Workflow 5] Multi-Day Usage & Streak Resilience Flow');

  const now = new Date();
  const multiDaySessions: GroundingSession[] = [];

  // Generate sessions for today, yesterday, 2 days ago, 3 days ago, 4 days ago
  for (let i = 0; i < 5; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    multiDaySessions.push({
      id: `streak-day-${i}`,
      techniqueId: 'box-breathing',
      techniqueCategory: 'pernapasan',
      startedAt: d.toISOString(),
      completedAt: d.toISOString(),
      durationSeconds: 16,
      completed: true,
      anxietyPre: 7,
      anxietyPost: 3,
    });
  }

  const streakVm5 = buildProgressViewModel(multiDaySessions);
  ctx.assertEqual(streakVm5.currentStreak, 5, 'T4.5a: 5 contiguous daily sessions produce 5-day active streak');
  ctx.assertEqual(streakVm5.daysActive, 5, 'T4.5b: 5 distinct dates produce daysActive = 5');

  // Introduce a gap by removing yesterday's session (index 1)
  const gappedSessions = multiDaySessions.filter((_, idx) => idx !== 1);
  const streakVmGapped = buildProgressViewModel(gappedSessions);
  ctx.assertEqual(streakVmGapped.currentStreak, 1, 'T4.5c: Missing yesterday resets contiguous streak to 1 (today only)');

  clearLocalPracticeData();

  // --------------------------------------------------------------------------
  // T4.6: Offline Storage Resilience & Data Integrity Workflow
  // Backend API calls fail -> local storage handles state -> summary remains intact
  // --------------------------------------------------------------------------
  console.log(' [Workflow 6] Offline Storage Resilience & API Fallback Flow');

  const offlineSession: GroundingSession = {
    id: 'offline-sess-1',
    techniqueId: 'mindful-walking',
    techniqueCategory: 'gerakan',
    startedAt: new Date(Date.now() - 600000).toISOString(),
    completedAt: new Date().toISOString(),
    durationSeconds: 600,
    completed: true,
    anxietyPre: 8,
    anxietyPost: 4,
  };

  // Save session locally
  saveSession(offlineSession);

  // Call API saveSession (mock returns null gracefully offline without throwing error)
  let apiErrorThrown = false;
  try {
    const apiResult = await api.saveSession(offlineSession);
    ctx.assertEqual(apiResult, null, 'T4.6a: API POST endpoint returns null when remote sync is disabled/offline without error');
  } catch {
    apiErrorThrown = true;
  }
  ctx.assert(!apiErrorThrown, 'T4.6b: API save call handles offline state without throwing unhandled exception');

  const offlineSummary = getPracticeSummary();
  ctx.assertEqual(offlineSummary.totalSessions, 1, 'T4.6c: Local practice summary remains 100% accurate despite offline API mode');
  ctx.assertEqual(offlineSummary.averageReduction, 4, 'T4.6d: Local practice summary average reduction equals 4 (8 - 4)');

  clearLocalPracticeData();
}
