import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, HeartPulse, Phone, ShieldAlert } from "lucide-react";
import { Container } from "@/ui/layout/Container";
import Button from "@/ui/ui/Button";
import BottomSheetDrawer from "@/ui/ui/BottomSheetDrawer";
import { api } from "@/services/api";
import { saveAssessment } from "@/services/storage";
import SudGauge from "@/ui/ui/SudGauge";

type SosStage = "calm" | "assessment" | "result";

export default function SosPage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<SosStage>("calm");
  const [anxietyScore, setAnxietyScore] = useState(5);
  const [helpOpen, setHelpOpen] = useState(false);

  const helpBody = (
    <>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-500/15 text-amber-800 dark:text-amber-200">
          <Phone aria-hidden="true" size={20} />
        </span>
        <div>
          <p className="text-label-md text-amber-800 dark:text-amber-300">
            Jika darurat
          </p>
          <h2 className="text-title-lg font-semibold text-foreground">
            Hubungi bantuan langsung
          </h2>
        </div>
      </div>
      <ul className="mt-5 grid gap-3 text-body-md text-muted-foreground">
        <li>
          <strong className="text-foreground">112</strong> - nomor darurat
          terpadu Indonesia.
        </li>
        <li>
          <strong className="text-foreground">119</strong> - PSC layanan darurat
          kesehatan.
        </li>
        <li>
          <strong className="text-foreground">
            119 ext. 8 / Healing119.id
          </strong>{" "}
          - dukungan kesehatan jiwa dapat bergantung lokasi dan operator.
        </li>
      </ul>
      <p className="mt-5 rounded-lg bg-amber-500/5 p-3 text-body-sm text-muted-foreground">
        Jika memungkinkan, tetap bersama orang lain atau hubungi orang tepercaya
        sambil menunggu bantuan.
      </p>
    </>
  );

  const saveStandaloneAssessment = () => {
    const assessment = saveAssessment({
      score: anxietyScore,
      scaleType: "SUD",
      context: "standalone",
    });

    void api.saveAssessment(assessment);
    setStage("result");
  };

  const startGrounding = (score = anxietyScore) => {
    navigate(`/session/teknik-54321?pre=${score}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70 bg-card">
        <Container className="flex h-16 items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="inline-flex min-h-12 items-center gap-2 rounded-lg px-3 py-2 text-label-md text-muted-foreground transition-colors hover:bg-surface-container-low hover:text-foreground cursor-pointer"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Beranda
          </button>
          {/* Softened Safety Badge (Amber/Coral Tone) */}
          <span className="inline-flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-label-md text-amber-800 dark:text-amber-200">
            <ShieldAlert aria-hidden="true" size={16} />
            Mode SOS
          </span>
        </Container>
      </header>

      <Container className="grid min-h-[calc(100dvh-4rem)] items-center gap-8 py-8 lg:grid-cols-[1fr_360px]">
        <main>
          <AnimatePresence mode="wait">
            {stage === "calm" && (
              <motion.section
                key="calm"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45 }}
                className="mx-auto flex max-w-2xl flex-col gap-7"
              >
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary-surface/80 text-primary shadow-serene-md animate-breathe">
                  <HeartPulse aria-hidden="true" size={48} />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-surface px-3.5 py-1 text-label-sm font-semibold text-primary">
                    <HeartPulse aria-hidden="true" size={14} />
                    Ambil jeda dulu
                  </span>
                  <h1 className="mt-3 text-display-md text-foreground">
                    Kamu sedang mencoba kembali hadir.
                  </h1>
                  <p className="mt-4 max-w-xl text-body-lg text-muted-foreground leading-relaxed">
                    Duduk atau berdiri senyaman mungkin. Rasakan kaki menyentuh
                    lantai. Tarik napas perlahan, lalu buang lebih panjang dari
                    tarikan napas.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Button
                    size="lg"
                    className="min-h-12"
                    onClick={() => setStage("assessment")}
                  >
                    Nilai kecemasan
                  </Button>
                  <Button
                    size="lg"
                    className="min-h-12"
                    variant="outlined"
                    onClick={() => startGrounding(5)}
                  >
                    Langsung grounding
                  </Button>
                </div>
                <p className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-body-sm text-amber-900 dark:text-amber-200">
                  Jika kamu merasa akan menyakiti diri, orang lain, atau berada
                  dalam bahaya langsung, hubungi 112 atau 119 sekarang.
                </p>
              </motion.section>
            )}

            {stage === "assessment" && (
              <motion.section
                key="assessment"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45 }}
                className="mx-auto flex max-w-2xl flex-col gap-7"
              >
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-surface px-3.5 py-1 text-label-sm font-semibold text-primary">
                    Pengukuran Klinis SUD
                  </span>
                  <h1 className="mt-2 text-display-md text-foreground">
                    Seberapa kuat cemasnya sekarang?
                  </h1>
                  <p className="mt-3 text-body-lg text-muted-foreground">
                    Gunakan penanda di bawah ini untuk menilai ketegangan tubuh dan pikiran secara objektif.
                  </p>
                </div>

                <SudGauge
                  score={anxietyScore}
                  onChange={(newScore) => setAnxietyScore(newScore)}
                  showClinicalInfo
                />

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    className="min-h-12"
                    onClick={saveStandaloneAssessment}
                  >
                    Simpan dan Lihat Rekomendasi
                  </Button>
                  <Button
                    size="lg"
                    className="min-h-12"
                    variant="outlined"
                    onClick={() => setStage("calm")}
                  >
                    Kembali
                  </Button>
                </div>
              </motion.section>
            )}

            {stage === "result" && (
              <motion.section
                key="result"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45 }}
                className="mx-auto flex max-w-2xl flex-col gap-7"
              >
                <div>
                  <p className="text-label-md text-primary">
                    Saran langkah berikutnya
                  </p>
                  <h1 className="mt-2 text-display-md text-foreground">
                    {getRecommendation(anxietyScore).title}
                  </h1>
                  <p className="mt-4 text-body-lg text-muted-foreground">
                    {getRecommendation(anxietyScore).body}
                  </p>
                </div>
                <div className="rounded-xl border border-primary-light/40 bg-primary-surface p-5">
                  <p className="text-label-md text-primary">Skor awal</p>
                  <p className="mt-2 text-display-sm text-primary">
                    {anxietyScore}/10
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    className="min-h-12"
                    onClick={() => startGrounding()}
                  >
                    Mulai 5-4-3-2-1
                  </Button>
                  <Button
                    size="lg"
                    className="min-h-12"
                    variant="outlined"
                    onClick={() => setStage("assessment")}
                  >
                    Ubah skor
                  </Button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </main>

        {/* Warm Coral / Amber Emergency Sidebar Card (desktop) */}
        <aside className="hidden rounded-xl border border-amber-500/30 bg-card p-5 shadow-level-1 lg:block">
          {helpBody}
        </aside>
      </Container>

      {/* Mobile: floating help trigger + spring bottom sheet drawer */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setHelpOpen(true)}
          className="fixed bottom-6 left-1/2 z-40 flex min-h-12 -translate-x-1/2 items-center gap-2 rounded-full border border-amber-500/40 bg-card px-5 text-label-md font-semibold text-amber-800 shadow-lg dark:text-amber-200 cursor-pointer"
        >
          <Phone aria-hidden="true" size={18} />
          Hubungi bantuan
        </button>
        <BottomSheetDrawer
          isOpen={helpOpen}
          onClose={() => setHelpOpen(false)}
        >
          {helpBody}
        </BottomSheetDrawer>
      </div>
    </div>
  );
}

function getRecommendation(score: number) {
  if (score <= 2) {
    return {
      title: "Latihan singkat bisa membantu menjaga stabil.",
      body: "Kamu bisa tetap mencoba grounding sensorik agar tubuh punya referensi rasa aman.",
    };
  }

  if (score <= 5) {
    return {
      title: "Mulai dari teknik sensorik yang sederhana.",
      body: "5-4-3-2-1 membantu perhatian berpindah dari pikiran cemas ke lingkungan sekitar.",
    };
  }

  return {
    title: "Utamakan rasa aman dan bantuan nyata.",
    body: "Mulai grounding sekarang jika aman dilakukan. Jika ada bahaya langsung, hubungi 112 atau 119.",
  };
}
