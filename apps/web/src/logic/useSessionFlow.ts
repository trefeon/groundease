import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { groundingTechniques } from '@/config/data/techniques';
import { api } from '@/services/api';
import { buildCompletedSession } from '@/logic/session';
import type { SessionPhase } from '@/logic/session';
import { createId, saveAssessment, saveSession } from '@/services/storage';

type SessionResponses = Record<number | string, string>;

export function useSessionFlow(techniqueId: string | undefined, preScoreFromSos: number | null) {
  const navigate = useNavigate();
  const technique = groundingTechniques.find((entry) => entry.id === techniqueId);
  const steps = useMemo(() => technique?.steps ?? [], [technique]);
  const sessionId = useMemo(() => createId('session'), []);
  const startedAtRef = useRef<string | null>(null);

  const [phase, setPhase] = useState<SessionPhase>('prepare');
  const [preScore, setPreScore] = useState(preScoreFromSos ?? 5);
  const [postScore, setPostScore] = useState(
    preScoreFromSos !== null ? Math.max(0, preScoreFromSos - 1) : 4,
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(steps[0]?.duration ?? 0);
  const [isPaused, setIsPaused] = useState(false);
  const [responses, setResponses] = useState<SessionResponses>({});

  const currentStep = steps[stepIndex];
  const practiceProgress = steps.length > 0 ? ((stepIndex + 1) / steps.length) * 100 : 0;

  useEffect(() => {
    if (phase !== 'practice' || isPaused) return;

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((value) => {
        if (value > 1) {
          return value - 1;
        }

        // Timer hits 0
        if (technique?.category === 'pernapasan') {
          setStepIndex((currIdx) => {
            if (currIdx < steps.length - 1) {
              const nextIdx = currIdx + 1;
              setRemainingSeconds(steps[nextIdx]?.duration ?? 0);
              return nextIdx;
            } else {
              setPostScore(Math.max(0, preScore - 1));
              setPhase('post');
              return currIdx;
            }
          });
          return 0;
        }

        return 0;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isPaused, phase, steps, technique?.category, preScore]);

  const startPractice = () => {
    startedAtRef.current = startedAtRef.current ?? new Date().toISOString();
    setStepIndex(0);
    setRemainingSeconds(steps[0]?.duration ?? 0);
    setIsPaused(false);
    const assessment = saveAssessment({ score: preScore, scaleType: 'SUD', context: 'pre', sessionId });
    void api.saveAssessment(assessment);
    setPhase('practice');
  };

  const goToPreScreen = () => {
    if (preScoreFromSos !== null) {
      startPractice();
      return;
    }

    setPhase('pre');
  };

  const goToNextStep = () => {
    if (stepIndex < steps.length - 1) {
      const nextStepIndex = stepIndex + 1;
      setStepIndex(nextStepIndex);
      setRemainingSeconds(steps[nextStepIndex]?.duration ?? 0);
      setIsPaused(false);
      return;
    }

    setPostScore(Math.max(0, preScore - 1));
    setPhase('post');
  };

  const resetCurrentStepTimer = () => {
    setRemainingSeconds(currentStep?.duration ?? 0);
  };

  const completeSession = () => {
    if (!technique) {
      return;
    }

    const completedAt = new Date().toISOString();
    const startedAt = startedAtRef.current ?? completedAt;
    const assessment = saveAssessment({ score: postScore, scaleType: 'SUD', context: 'post', sessionId });
    const session = buildCompletedSession({
      sessionId,
      technique,
      startedAt,
      completedAt,
      preScore,
      postScore,
      responses,
      steps,
    });

    saveSession(session);
    void api.saveAssessment(assessment);
    void api.saveSession(session);
    navigate('/session-complete', { state: { session } });
  };

  return {
    technique,
    steps,
    phase,
    preScore,
    setPreScore,
    postScore,
    setPostScore,
    stepIndex,
    remainingSeconds,
    isPaused,
    setIsPaused,
    responses,
    setResponses,
    currentStep,
    practiceProgress,
    startPractice,
    goToPreScreen,
    goToNextStep,
    completeSession,
    resetCurrentStepTimer,
  };
}
