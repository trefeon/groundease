import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/logic/motion";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  HeartPulse,
  LifeBuoy,
  ListChecks,
  ShieldCheck,
  Sparkles,
  Volume2,
} from "lucide-react";
import Button from "@/ui/ui/Button";
import ProgressRing from "@/ui/ui/ProgressRing";
import BottomSheetDrawer from "@/ui/ui/BottomSheetDrawer";
import { Container } from "@/ui/layout/Container";
import { getPracticeSummary } from "@/services/storage";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
};

const principles = [
  {
    title: "Lokal-first",
    body: "Riwayat latihan tersimpan di browser perangkat ini. Tidak perlu akun untuk mulai.",
    Icon: ShieldCheck,
  },
  {
    title: "Singkat dan terpandu",
    body: "Setiap sesi memberi langkah jelas, timer, dan pengukuran SUD sebelum-sesudah.",
    Icon: BookOpen,
  },
  {
    title: "Bukan diagnosis",
    body: "Ruang Pulih membantu regulasi diri, bukan pengganti bantuan profesional.",
    Icon: LifeBuoy,
  },
];

const flowSteps = [
  "Opsional: buka Setelan untuk memilih suara latar, cek volume, atau matikan audio.",
  "Mulai dari SOS saat butuh bantuan cepat, atau pilih teknik dari library.",
  "Isi skor SUD awal agar kamu punya titik refleksi sebelum latihan.",
  "Ikuti langkah grounding, lalu isi skor akhir dan lihat progres lokal.",
];

export default function HomePage() {
  const navigate = useNavigate();
  const summary = getPracticeSummary();
  const [isGuidanceOpen, setIsGuidanceOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <Container className="grid min-h-[calc(100dvh-4rem)] items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <motion.section {...fadeUp} className="flex flex-col gap-7">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-light/50 bg-primary-surface/80 px-4 py-2 text-label-md text-primary shadow-xs backdrop-blur-xs">
              <Sparkles aria-hidden="true" size={16} className="text-primary" />
              Panduan grounding saat pikiran terasa penuh
            </div>
            <div className="flex flex-col gap-5">
              <h1 className="max-w-3xl text-display-lg text-foreground tracking-tight">
                Kembali ke momen sekarang, satu langkah kecil.
              </h1>
              <p className="max-w-2xl text-body-lg text-muted-foreground leading-relaxed">
                Ruang Pulih membantu kamu menjalani teknik grounding berbasis
                sensorik, pernapasan, dan gerakan dengan instruksi sederhana,
                aman, dan bisa digunakan tanpa akun.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                className="min-h-12 w-full sm:w-auto"
                size="lg"
                onClick={() => navigate("/sos")}
              >
                Mulai dari SOS
                <ArrowRight aria-hidden="true" size={18} />
              </Button>
              <Button
                className="min-h-12 w-full sm:w-auto"
                variant="outlined"
                size="lg"
                onClick={() => navigate("/library")}
              >
                Pilih teknik
              </Button>
              <Button
                className="min-h-12 w-full sm:w-auto"
                variant="tonal"
                size="lg"
                onClick={() => setIsGuidanceOpen(true)}
              >
                <BookOpen aria-hidden="true" size={18} />
                Panduan Pakai
              </Button>
            </div>
            <div className="max-w-2xl rounded-2xl border border-border/80 bg-card/90 p-6 text-card-foreground shadow-serene-sm backdrop-blur-xs">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-calm-surface text-calm shadow-xs">
                  <ListChecks aria-hidden="true" size={20} />
                </span>
                <div>
                  <h2 className="text-title-lg text-foreground font-semibold">
                    Grounding itu apa?
                  </h2>
                  <p className="mt-2 text-body-md text-muted-foreground leading-relaxed">
                    Grounding adalah latihan untuk mengarahkan perhatian kembali
                    ke tubuh, napas, dan lingkungan saat pikiran terasa penuh.
                    Caranya sederhana: perhatikan hal yang bisa dilihat,
                    disentuh, didengar, dicium, atau dirasakan agar tubuh punya
                    sinyal bahwa kamu sedang berada di momen sekarang.
                  </p>
                </div>
              </div>
            </div>
            <p className="max-w-2xl rounded-2xl border border-border/70 bg-card/60 p-4 text-body-sm text-muted-foreground backdrop-blur-xs">
              Jika kamu sedang dalam bahaya langsung atau punya dorongan
              menyakiti diri, hubungi layanan darurat setempat atau orang
              tepercaya. Aplikasi ini alat bantu edukasi, bukan layanan krisis.
            </p>
          </motion.section>

          <motion.section
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-4"
            aria-label="Ringkasan Ruang Pulih"
          >
            <motion.div
              variants={staggerItem}
              className="rounded-2xl border border-primary-light/40 bg-gradient-to-br from-card via-card to-primary-surface/40 p-6 shadow-serene-sm"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-surface px-3 py-1 text-label-sm font-semibold text-primary">
                    <Sparkles aria-hidden="true" size={12} />
                    Latihan cepat pilihan
                  </span>
                  <h2 className="mt-2.5 text-headline-md font-normal text-foreground">
                    Technique 5-4-3-2-1
                  </h2>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-calm-surface text-calm shadow-xs">
                  <HeartPulse aria-hidden="true" size={24} />
                </span>
              </div>
              <ol className="grid gap-2.5 text-body-md text-muted-foreground">
                <li className="flex items-center gap-2.5"><span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">5</span> hal yang terlihat</li>
                <li className="flex items-center gap-2.5"><span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">4</span> hal yang bisa disentuh</li>
                <li className="flex items-center gap-2.5"><span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</span> suara yang terdengar</li>
                <li className="flex items-center gap-2.5"><span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</span> aroma yang disadari</li>
                <li className="flex items-center gap-2.5"><span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</span> rasa atau sensasi di mulut</li>
              </ol>
              <Button
                className="mt-6 min-h-12 w-full"
                onClick={() => navigate("/session/teknik-54321")}
              >
                Mulai latihan 5-4-3-2-1
                <ArrowRight aria-hidden="true" size={18} />
              </Button>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3"
            >
              <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-serene-sm transition-colors hover:border-primary-light/40">
                <div>
                  <p className="text-label-md text-muted-foreground">Sesi lokal</p>
                  <p className="mt-1 text-headline-md font-bold text-primary">
                    {summary.completedSessions}
                  </p>
                </div>
                <ProgressRing
                  progress={Math.min(100, summary.completedSessions * 10)}
                  size={52}
                  strokeWidth={5}
                  color="var(--primary)"
                />
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-serene-sm transition-colors hover:border-primary-light/40">
                <div>
                  <p className="text-label-md text-muted-foreground">Rata-rata turun</p>
                  <p className="mt-1 text-headline-md font-bold text-primary">
                    {summary.averageReduction.toFixed(1)}
                  </p>
                </div>
                <ProgressRing
                  progress={Math.min(100, (summary.averageReduction / 10) * 100)}
                  size={52}
                  strokeWidth={5}
                  color="var(--primary)"
                />
              </div>
              <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-serene-sm transition-colors hover:border-primary-light/40">
                <p className="text-label-md text-muted-foreground">Mode data</p>
                <p className="mt-2 text-title-md font-semibold text-primary">Perangkat</p>
              </div>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="rounded-2xl border border-border/80 bg-card p-6 shadow-serene-sm"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-surface text-primary shadow-xs">
                  <Volume2 aria-hidden="true" size={22} />
                </span>
                <div>
                  <p className="text-label-md text-primary font-semibold">
                    Alur pakai aplikasi
                  </p>
                  <h2 className="mt-1 text-title-lg text-foreground font-semibold">
                    Mau pakai sound? Atur dulu sebelum mulai sesi.
                  </h2>
                </div>
              </div>
              <ol className="mt-5 grid gap-3 text-body-sm text-muted-foreground">
                {flowSteps.map((step, index) => (
                  <li key={step} className="grid grid-cols-[1.75rem_1fr] gap-3 items-center">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-surface text-label-md font-bold text-primary">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <Button
                className="mt-6 min-h-12 w-full"
                variant="tonal"
                onClick={() => navigate("/settings")}
              >
                Atur suara di Setelan
                <ArrowRight aria-hidden="true" size={18} />
              </Button>
            </motion.div>
          </motion.section>
        </Container>

        <motion.section
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="border-y border-border/70 bg-card/60 py-12 backdrop-blur-xs"
        >
          <Container className="grid gap-6 md:grid-cols-3">
            {principles.map(({ title, body, Icon }) => (
              <motion.article
                key={title}
                variants={staggerItem}
                className="rounded-2xl border border-border/80 bg-background/90 p-6 shadow-serene-sm transition-colors hover:border-primary-light/40"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-surface text-primary shadow-xs">
                  <Icon aria-hidden="true" size={22} />
                </span>
                <h2 className="mt-4 text-title-lg font-semibold text-foreground">{title}</h2>
                <p className="mt-2 text-body-md text-muted-foreground leading-relaxed">
                  {body}
                </p>
              </motion.article>
            ))}
          </Container>
        </motion.section>

        <Container className="py-12">
          <motion.div
            {...fadeUp}
            className="flex flex-col gap-6 rounded-2xl border border-primary-light/40 bg-gradient-to-r from-primary-surface via-card to-calm-surface/40 p-6 shadow-serene-sm md:flex-row md:items-center md:justify-between"
          >
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-surface px-3 py-1 text-label-sm font-semibold text-primary">
                <BarChart3 aria-hidden="true" size={14} />
                Cek progres
              </span>
              <h2 className="mt-2 text-headline-sm text-foreground">
                Lihat pola latihan dari data lokal kamu.
              </h2>
            </div>
            <Button
              className="min-h-12"
              variant="filled"
              onClick={() => navigate("/progress")}
            >
              Buka progres
              <BarChart3 aria-hidden="true" size={18} />
            </Button>
          </motion.div>
        </Container>
      </main>

      {/* Mobile Guidance BottomSheetDrawer */}
      <BottomSheetDrawer
        isOpen={isGuidanceOpen}
        onClose={() => setIsGuidanceOpen(false)}
        title="Panduan Penggunaan Ruang Pulih"
        description="Langkah mudah untuk kembali tenang dan fokus."
      >
        <div className="grid gap-4 py-2">
          {flowSteps.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg border border-border bg-background p-3.5"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-surface text-label-md font-bold text-primary">
                {index + 1}
              </span>
              <p className="text-body-md text-foreground">{step}</p>
            </div>
          ))}
          <Button
            className="mt-2 min-h-12 w-full"
            onClick={() => {
              setIsGuidanceOpen(false);
              navigate("/sos");
            }}
          >
            Mulai dari Mode SOS
            <ArrowRight aria-hidden="true" size={18} />
          </Button>
        </div>
      </BottomSheetDrawer>
    </div>
  );
}
