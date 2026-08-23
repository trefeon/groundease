import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import { PageWrapper } from "@/ui/layout/Container";
import Button from "@/ui/ui/Button";
import BreathingCircle from "@/ui/ui/BreathingCircle";
import ProgressRing from "@/ui/ui/ProgressRing";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/ui/tooltip";
import { Badge } from "@/ui/ui/badge";
import { Progress } from "@/ui/ui/progress";
import { Slider } from "@/ui/ui/slider";
import {
  ambientSoundOptions,
  usePreferences,
  type AmbientSoundPreference,
} from "@/logic/preferences";
import { clampScore, formatTime, getScoreLabel } from "@/logic/session";
import { cn } from "@/logic/formatters";
import { primeAmbientPlayback, useAmbientSound } from "@/logic/useAmbientSound";
import { useSessionFlow } from "@/logic/useSessionFlow";
import type { StepPhase } from "@/types";

export default function SessionPage() {
  const navigate = useNavigate();
  const { techniqueId } = useParams();
  const [searchParams] = useSearchParams();
  const preScoreFromSos = clampScore(searchParams.get("pre"));
  const { preferences } = usePreferences();
  const {
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
  } = useSessionFlow(techniqueId, preScoreFromSos);

  const effectiveSound: AmbientSoundPreference =
    preferences.ambientSound !== "none"
      ? preferences.ambientSound
      : ((technique?.defaultSound as AmbientSoundPreference) ?? "none");
  const soundLabel =
    ambientSoundOptions.find((option) => option.value === effectiveSound)
      ?.label ?? ambientSoundOptions[0].label;

  useAmbientSound({
    active: phase === "practice" && !isPaused,
    sound: effectiveSound,
    muted: preferences.ambientMuted,
    volume: preferences.ambientVolume,
  });

  const unlockSessionAudio = () => {
    void primeAmbientPlayback({
      sound: effectiveSound,
      muted: preferences.ambientMuted,
      volume: preferences.ambientVolume,
    });
  };

  const handlePrepareStart = () => {
    if (preScoreFromSos !== null) {
      unlockSessionAudio();
    }
    goToPreScreen();
  };

  const handlePracticeStart = () => {
    unlockSessionAudio();
    startPractice();
  };

  if (!technique) {
    return (
      <PageWrapper maxWidth="narrow" centered>
        <div className="rounded-lg border border-border bg-card p-8 text-center shadow-level-1">
          <BookOpen
            aria-hidden="true"
            className="mx-auto text-muted-foreground"
            size={34}
          />
          <h1 className="mt-4 text-headline-sm text-foreground">
            Teknik tidak ditemukan
          </h1>
          <p className="mt-2 text-body-md text-muted-foreground">
            Pilih ulang teknik grounding dari library.
          </p>
          <Button className="mt-6" onClick={() => navigate("/library")}>
            Kembali ke teknik
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-[var(--space-page-px)]">
          <div>
            <p className="text-label-md text-primary">Sesi grounding</p>
            <p className="text-body-sm text-muted-foreground">
              {technique.name}
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    onClick={() => navigate("/library")}
                    variant="outlined"
                    size="icon"
                    aria-label="Keluar dari sesi"
                  />
                }
              >
                <X aria-hidden="true" size={18} />
              </TooltipTrigger>
              <TooltipContent>Keluar dari sesi</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      <PageWrapper maxWidth="md" centered className="min-h-[calc(100dvh-4rem)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${phase}-${stepIndex}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="w-full rounded-lg border border-border bg-card p-5 text-card-foreground shadow-level-1 md:p-7"
          >
            {phase === "prepare" && (
              <PrepareStep
                techniqueName={technique.name}
                description={technique.description}
                scientificBasis={technique.scientificBasis}
                duration={technique.duration}
                stepCount={steps.length}
                skipPre={preScoreFromSos !== null}
                onStart={handlePrepareStart}
              />
            )}

            {phase === "pre" && (
              <ScoreStep
                title="Bagaimana perasaanmu sekarang?"
                helper="Skor ini menjadi titik awal sebelum latihan."
                score={preScore}
                onScoreChange={setPreScore}
                actionLabel="Mulai latihan"
                onSubmit={handlePracticeStart}
              />
            )}

            {phase === "practice" && currentStep && (
              <PracticeStep
                currentStepLabel={`Langkah ${stepIndex + 1} dari ${steps.length}`}
                progress={practiceProgress}
                senseType={currentStep.senseType ?? "Fokus"}
                soundLabel={soundLabel}
                soundEnabled={effectiveSound !== "none"}
                instruction={currentStep.instruction}
                prompt={currentStep.prompt}
                stepPhase={currentStep.phase}
                visualMode={currentStep.visualMode}
                duration={currentStep.duration}
                response={responses[currentStep.id] ?? ""}
                onResponseChange={(value) =>
                  setResponses((current) => ({
                    ...current,
                    [currentStep.id]: value,
                  }))
                }
                remainingSeconds={remainingSeconds}
                isPaused={isPaused}
                onPauseToggle={() => setIsPaused(!isPaused)}
                onReset={resetCurrentStepTimer}
                onNext={goToNextStep}
                isLastStep={stepIndex === steps.length - 1}
              />
            )}

            {phase === "post" && (
              <ScoreStep
                title="Bagaimana perasaanmu setelah latihan?"
                helper="Tidak perlu memaksa skor turun. Catat keadaan tubuh saat ini."
                score={postScore}
                onScoreChange={setPostScore}
                actionLabel="Simpan sesi"
                onSubmit={completeSession}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </PageWrapper>
    </div>
  );
}

function PrepareStep({
  techniqueName,
  description,
  scientificBasis,
  duration,
  stepCount,
  skipPre,
  onStart,
}: {
  techniqueName: string;
  description: string;
  scientificBasis: string;
  duration: number;
  stepCount: number;
  skipPre: boolean;
  onStart: () => void;
}) {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-label-md text-primary">
          {skipPre ? "Dari mode SOS" : "Siapkan diri"}
        </p>
        <h1 className="mt-2 text-display-sm text-foreground">
          {techniqueName}
        </h1>
        <p className="mt-4 text-body-lg text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <InfoTile label="Durasi" value={`${duration} menit`} />
        <InfoTile label="Langkah" value={`${stepCount}`} />
        <InfoTile label="Data" value="Lokal" />
      </div>

      <p className="rounded-lg border border-border bg-background p-4 text-body-sm text-muted-foreground">
        {scientificBasis}
      </p>

      <Button size="lg" onClick={onStart}>
        {skipPre ? "Mulai latihan sekarang" : "Lanjut ke pengukuran awal"}
        <ChevronRight aria-hidden="true" size={18} />
      </Button>
    </div>
  );
}

function ScoreStep({
  title,
  helper,
  score,
  onScoreChange,
  actionLabel,
  onSubmit,
}: {
  title: string;
  helper: string;
  score: number;
  onScoreChange: (score: number) => void;
  actionLabel: string;
  onSubmit: () => void;
}) {
  return (
    <div className="grid gap-7">
      <div>
        <p className="text-label-md font-semibold tracking-wide uppercase text-primary">SUD Scale 0-10</p>
        <h1 className="mt-2 text-display-sm text-foreground">{title}</h1>
        <p className="mt-3 text-body-md text-muted-foreground">{helper}</p>
      </div>

      <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-xs">
        {/* Ring & Increment / Decrement Stepper Controls */}
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <Button
            type="button"
            variant="outlined"
            size="icon"
            onClick={() => onScoreChange(Math.max(0, score - 1))}
            disabled={score <= 0}
            className="h-11 w-11 rounded-full cursor-pointer transition-transform active:scale-95 disabled:opacity-30"
            aria-label="Kurangi skor kecemasan"
          >
            <Minus aria-hidden="true" size={20} />
          </Button>

          <div className="relative flex items-center justify-center">
            <ProgressRing value={score * 10} size={136} strokeWidth={9}>
              <span className="font-display text-5xl font-bold text-primary transition-all select-none">
                {score}
              </span>
            </ProgressRing>
          </div>

          <Button
            type="button"
            variant="outlined"
            size="icon"
            onClick={() => onScoreChange(Math.min(10, score + 1))}
            disabled={score >= 10}
            className="h-11 w-11 rounded-full cursor-pointer transition-transform active:scale-95 disabled:opacity-30"
            aria-label="Tambah skor kecemasan"
          >
            <Plus aria-hidden="true" size={20} />
          </Button>
        </div>

        {/* Dynamic Category Label */}
        <p className="mt-4 text-title-lg font-semibold capitalize text-foreground transition-all">
          {getScoreLabel(score)}
        </p>

        {/* Slider & Quick-pick Pill Controls */}
        <div className="mt-6 w-full space-y-4">
          <Slider
            min={0}
            max={10}
            step={1}
            value={[score]}
            onValueChange={(value) =>
              onScoreChange(Array.isArray(value) ? (value[0] ?? score) : value)
            }
            aria-label={title}
            className="w-full cursor-pointer"
          />

          {/* Quick pick 0-10 number buttons */}
          <div className="flex flex-wrap justify-between gap-1 pt-1">
            {Array.from({ length: 11 }, (_, i) => i).map((num) => {
              const isSelected = num === score;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => onScoreChange(num)}
                  className={cn(
                    "flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg text-xs sm:text-sm transition-all cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isSelected
                      ? "bg-primary text-primary-foreground font-bold shadow-xs scale-110"
                      : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
                  )}
                  aria-label={`Pilih skor ${num}`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between text-xs font-semibold text-muted-foreground pt-1">
            <span>0 tenang</span>
            <span>5 cemas sedang</span>
            <span>10 sangat cemas</span>
          </div>
        </div>
      </div>

      <Button size="lg" onClick={onSubmit} className="w-full">
        {actionLabel}
        <ChevronRight aria-hidden="true" size={18} />
      </Button>
    </div>
  );
}

function PracticeStep({
  currentStepLabel,
  progress,
  senseType,
  soundLabel,
  soundEnabled,
  instruction,
  prompt,
  stepPhase,
  visualMode,
  duration,
  response,
  onResponseChange,
  remainingSeconds,
  isPaused,
  onPauseToggle,
  onReset,
  onNext,
  isLastStep,
}: {
  currentStepLabel: string;
  progress: number;
  senseType: string;
  soundLabel: string;
  soundEnabled: boolean;
  instruction: string;
  prompt?: string;
  stepPhase?: StepPhase;
  visualMode?: "breathing" | "sensory" | "touch" | "auditory" | "walking";
  duration?: number;
  response: string;
  onResponseChange: (value: string) => void;
  remainingSeconds: number;
  isPaused: boolean;
  onPauseToggle: () => void;
  onReset: () => void;
  onNext: () => void;
  isLastStep: boolean;
}) {
  return (
    <div className="grid gap-6">
      <div>
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="text-label-md text-primary">{currentStepLabel}</p>
          <div className="flex flex-wrap justify-end gap-2">
            {soundEnabled && <Badge variant="secondary">{soundLabel}</Badge>}
            <Badge variant="outline">{senseType}</Badge>
          </div>
        </div>
        <Progress value={progress} aria-label="Progres latihan" />
      </div>

      <div className="text-center">
        <p className="text-headline-sm text-foreground">{instruction}</p>
      </div>

      <BreathingCircle
        phase={isPaused ? "rest" : (stepPhase ?? "inhale")}
        visualMode={visualMode ?? "breathing"}
        duration={duration ?? 4}
        size={220}
        subtext={prompt ?? "Ikuti waktu dengan nyaman"}
        isPaused={isPaused}
      >
        <div className="text-center">
          <span className="block font-display text-6xl">
            {remainingSeconds > 0 ? (
              remainingSeconds
            ) : (
              <CheckCircle2 aria-hidden="true" size={44} />
            )}
          </span>
          <span className="text-label-md opacity-80">
            {formatTime(remainingSeconds)}
          </span>
        </div>
      </BreathingCircle>

      {prompt && (
        <label>
          <span className="mb-2 block text-label-md text-muted-foreground">
            Catatan opsional
          </span>
          <textarea
            value={response}
            onChange={(event) => onResponseChange(event.target.value)}
            placeholder={prompt}
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-body-md text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
      )}

      <div className="grid gap-3 sm:grid-cols-[auto_auto_1fr]">
        <Button onClick={onPauseToggle} variant="outlined" size="lg">
          {isPaused ? (
            <Play aria-hidden="true" size={18} />
          ) : (
            <Pause aria-hidden="true" size={18} />
          )}
          {isPaused ? "Lanjut" : "Jeda"}
        </Button>
        <Button onClick={onReset} variant="outlined" size="lg">
          <RotateCcw aria-hidden="true" size={18} />
          Ulang timer
        </Button>
        <Button className="w-full" size="lg" onClick={onNext}>
          {isLastStep ? "Selesaikan latihan" : "Langkah berikutnya"}
          <ChevronRight aria-hidden="true" size={18} />
        </Button>
      </div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="text-label-md text-muted-foreground">{label}</p>
      <p className="mt-1 text-title-lg text-primary">{value}</p>
    </div>
  );
}
