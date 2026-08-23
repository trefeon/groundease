import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  HeartPulse,
  LineChart,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import { PageWrapper } from "@/ui/layout/Container";
import Button from "@/ui/ui/Button";
import ProgressRing from "@/ui/ui/ProgressRing";
import BottomSheetDrawer from "@/ui/ui/BottomSheetDrawer";
import { buildProgressViewModel, formatSessionDate } from "@/logic/progress";
import { getSessions } from "@/services/storage";
import type { GroundingSession } from "@/types";

function formatReduction(value: number) {
  return value > 0 ? `-${value.toFixed(1)}` : "0.0";
}

/** Animates a number from 0 to `value` when it enters the viewport */
function CountUp({
  value,
  duration = 800,
}: {
  value: number;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{display}</>;
}

export default function ProgressPage() {
  const navigate = useNavigate();
  const rawSessions = getSessions();
  const progress = useMemo(() => buildProgressViewModel(rawSessions), [rawSessions]);
  const [selectedSession, setSelectedSession] = useState<GroundingSession | null>(null);

  // Compute overall percentage of reduction (capped 0-100)
  const reductionPercentage = Math.min(
    100,
    Math.max(0, (progress.averageReduction / 10) * 100)
  );

  return (
    <PageWrapper>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="border-b border-border/70 pb-8"
      >
        <div className="inline-flex items-center gap-2 rounded-lg border border-primary-light/40 bg-primary-surface px-3 py-1.5 text-label-md text-primary">
          <Sparkles aria-hidden="true" size={14} />
          Progres lokal
        </div>
        <h1 className="mt-3 text-display-md text-foreground">
          Lihat pola latihan dari perangkat ini.
        </h1>
        <p className="mt-3 max-w-2xl text-body-lg text-muted-foreground">
          Angka di halaman ini berasal dari sesi yang kamu selesaikan di browser
          ini. Tidak ada akun, tidak ada pelacakan server, tidak ada klaim
          diagnosis.
        </p>
      </motion.header>

      {/* Organic Bento Grid */}
      <section className="grid grid-cols-1 gap-5 py-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Bento Tile 1: Hero Primary Stat Tile with ProgressRing */}
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="col-span-1 flex flex-col justify-between rounded-2xl border border-primary-light/40 bg-gradient-to-br from-primary-surface via-card to-background p-6 shadow-serene-sm md:col-span-2"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-surface px-3 py-1 text-label-sm font-semibold text-primary">
                <TrendingDown aria-hidden="true" size={14} />
                Rata-rata Penurunan SUD
              </span>
              <h2 className="mt-3 text-display-sm text-primary font-semibold">
                {formatReduction(progress.averageReduction)}{" "}
                <span className="text-title-lg font-normal text-muted-foreground">
                  Poin
                </span>
              </h2>
              <p className="mt-2 text-body-sm text-muted-foreground leading-relaxed">
                Perubahan tingkat kecemasan (SUD) sebelum dibanding sesudah sesi.
              </p>
            </div>
            <div className="shrink-0">
              <ProgressRing
                progress={reductionPercentage}
                size={96}
                strokeWidth={7}
                color="var(--primary)"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-surface text-primary shadow-xs">
                  <TrendingDown aria-hidden="true" size={20} />
                </div>
              </ProgressRing>
            </div>
          </div>
        </motion.article>

        {/* Bento Tile 2: Compact Stat — Sesi Selesai (1 Col) */}
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="col-span-1 flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-level-1 hover:border-primary-light/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-calm-surface text-calm">
              <HeartPulse aria-hidden="true" size={20} />
            </span>
            <span className="text-label-sm text-muted-foreground">Sesi</span>
          </div>
          <div className="mt-4">
            <p className="text-display-sm text-foreground">
              <CountUp value={progress.completedSessions} />
            </p>
            <p className="mt-1 text-label-md text-muted-foreground">
              Sesi Selesai
            </p>
            <p className="mt-0.5 text-body-sm text-muted-foreground">
              Tersimpan di browser
            </p>
          </div>
        </motion.article>

        {/* Bento Tile 3: Compact Stat — Streak (1 Col) */}
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="col-span-1 flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-level-1 hover:border-primary-light/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300">
              <LineChart aria-hidden="true" size={20} />
            </span>
            <span className="text-label-sm text-muted-foreground">Streak</span>
          </div>
          <div className="mt-4">
            <p className="text-display-sm text-foreground">
              <CountUp value={progress.currentStreak} />{" "}
              <span className="text-title-md text-muted-foreground">hari</span>
            </p>
            <p className="mt-1 text-label-md text-muted-foreground">
              Hari Berurutan
            </p>
            <p className="mt-0.5 text-body-sm text-muted-foreground">
              Aktif berturut-turut
            </p>
          </div>
        </motion.article>

        {/* Bento Tile 4: Insight Ringkas Block (2 Cols) */}
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="col-span-1 flex flex-col justify-between rounded-xl border border-primary-light/30 bg-primary-surface/70 p-6 shadow-level-1 md:col-span-2"
        >
          <div>
            <p className="text-label-md text-primary">Insight ringkas</p>
            <h3 className="mt-2 text-headline-sm text-foreground">
              {progress.bestReduction > 0
                ? `Penurunan SUD terbaik kamu ${progress.bestReduction.toFixed(0)} poin.`
                : "Beberapa sesi belum menunjukkan penurunan SUD."}
            </h3>
            <p className="mt-2 text-body-md text-muted-foreground">
              Gunakan angka ini sebagai refleksi pribadi. Naik-turun wajar; yang
              penting kamu punya cara kembali ke tubuh saat cemas meningkat.
            </p>
          </div>
          <div className="mt-5">
            <Button
              variant="tonal"
              className="min-h-12"
              onClick={() => navigate("/library")}
            >
              Latihan lagi
            </Button>
          </div>
        </motion.article>

        {/* Bento Tile 5: Hari Aktif (2 Cols) */}
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="col-span-1 flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-level-1 md:col-span-2"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-label-md text-muted-foreground">
                Hari Aktif Grounding
              </p>
              <p className="mt-2 text-display-sm text-foreground">
                <CountUp value={progress.daysActive} />{" "}
                <span className="text-title-lg font-normal text-muted-foreground">
                  Hari
                </span>
              </p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-container-low text-muted-foreground">
              <CalendarDays aria-hidden="true" size={22} />
            </span>
          </div>
          <p className="mt-4 text-body-sm text-muted-foreground">
            Berdasarkan tanggal unik sesi latihan yang kamu selesaikan di
            perangkat ini.
          </p>
        </motion.article>
      </section>

      {/* Sessions History / Empty State */}
      {progress.completedSessions === 0 ? (
        <section className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center shadow-level-1">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-surface text-primary">
            <BarChart3 aria-hidden="true" size={32} />
          </span>
          <h2 className="mt-5 text-headline-sm text-foreground">
            Belum ada riwayat latihan
          </h2>
          <p className="mt-2 max-w-md text-body-md text-muted-foreground">
            Selesaikan satu sesi grounding untuk melihat perubahan SUD, durasi,
            dan catatan langkah di sini.
          </p>
          <Button
            className="mt-6 min-h-12"
            onClick={() => navigate("/library")}
          >
            Mulai latihan pertama
            <ArrowRight aria-hidden="true" size={18} />
          </Button>
        </section>
      ) : (
        <section className="rounded-xl border border-border bg-card p-6 shadow-level-1">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-label-md text-primary">Riwayat terbaru</p>
              <h2 className="text-headline-sm text-foreground">
                Sesi Selesai ({progress.completedSessions})
              </h2>
            </div>
          </div>
          <div className="grid gap-3">
            {progress.recentSessions.map((session) => {
              const reduction =
                typeof session.anxietyPre === "number" &&
                typeof session.anxietyPost === "number"
                  ? session.anxietyPre - session.anxietyPost
                  : 0;

              return (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => setSelectedSession(session)}
                  className="grid text-left cursor-pointer gap-3 rounded-lg border border-border/80 bg-background p-4 transition-colors hover:border-primary-light/50 sm:grid-cols-[1fr_auto] sm:items-center focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/35"
                >
                  <div>
                    <h3 className="text-title-lg font-semibold text-foreground">
                      {session.techniqueName ?? "Sesi grounding"}
                    </h3>
                    <p className="mt-1 text-body-sm text-muted-foreground">
                      {formatSessionDate(session.startedAt)} ·{" "}
                      {Math.ceil(session.durationSeconds / 60)} menit
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-lg bg-primary-surface px-3 py-2 text-label-md text-primary">
                    SUD {session.anxietyPre ?? "-"} &rarr;{" "}
                    {session.anxietyPost ?? "-"} · {formatReduction(reduction)}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Session Details Bottom Sheet Drawer */}
      <BottomSheetDrawer
        isOpen={selectedSession !== null}
        onClose={() => setSelectedSession(null)}
        title={selectedSession?.techniqueName ?? "Detail Sesi Grounding"}
        description={selectedSession ? formatSessionDate(selectedSession.startedAt) : undefined}
      >
        {selectedSession && (
          <div className="grid gap-6">
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-background p-6 text-center">
              <ProgressRing
                progress={
                  typeof selectedSession.anxietyPre === "number" &&
                  typeof selectedSession.anxietyPost === "number" &&
                  selectedSession.anxietyPre > 0
                    ? Math.max(
                        0,
                        Math.min(
                          100,
                          ((selectedSession.anxietyPre - selectedSession.anxietyPost) /
                            selectedSession.anxietyPre) *
                            100
                        )
                      )
                    : 0
                }
                size={120}
                strokeWidth={8}
              >
                <div className="text-center">
                  <span className="text-title-lg font-bold text-primary">
                    {formatReduction(
                      typeof selectedSession.anxietyPre === "number" &&
                        typeof selectedSession.anxietyPost === "number"
                        ? selectedSession.anxietyPre - selectedSession.anxietyPost
                        : 0
                    )}
                  </span>
                  <span className="block text-label-sm text-muted-foreground">
                    penurunan
                  </span>
                </div>
              </ProgressRing>
              <div className="mt-4 flex items-center justify-center gap-6 text-body-md text-foreground">
                <div>
                  <span className="block text-label-sm text-muted-foreground">Sebelum</span>
                  <span className="font-semibold">{selectedSession.anxietyPre ?? "-"}</span>
                </div>
                <div className="h-6 w-px bg-border" />
                <div>
                  <span className="block text-label-sm text-muted-foreground">Sesudah</span>
                  <span className="font-semibold">{selectedSession.anxietyPost ?? "-"}</span>
                </div>
                <div className="h-6 w-px bg-border" />
                <div>
                  <span className="block text-label-sm text-muted-foreground">Durasi</span>
                  <span className="font-semibold">{Math.ceil(selectedSession.durationSeconds / 60)} m</span>
                </div>
              </div>
            </div>

            {selectedSession.stepResponses && selectedSession.stepResponses.length > 0 && (
              <div>
                <h4 className="mb-3 text-label-lg font-semibold text-foreground">
                  Catatan Sesi
                </h4>
                <div className="grid gap-2">
                  {selectedSession.stepResponses.map((res, i) => (
                    <div key={i} className="rounded-lg border border-border bg-background p-3 text-body-sm">
                      <p className="font-medium text-foreground">{res.prompt ?? `Langkah ${res.stepId}`}</p>
                      <p className="mt-1 text-muted-foreground">{res.response || "Tidak ada catatan."}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </BottomSheetDrawer>
    </PageWrapper>
  );
}
