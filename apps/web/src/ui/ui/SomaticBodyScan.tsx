import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeartPulse, CheckCircle2, Sparkles } from "lucide-react";
import Button from "@/ui/ui/Button";

export interface BodyRegion {
  id: string;
  name: string;
  somaticSign: string;
  releasingExercise: string;
  vagalsignal: string;
}

export const bodyRegions: BodyRegion[] = [
  {
    id: "head-jaw",
    name: "Rahang & Wajah",
    somaticSign: "Gigi terkatup, rahang kaku, dahi berkerut.",
    releasingExercise:
      "Buka mulut sedikit, biarkan lidah turun rileks dari langit-langit mulut. Usap rahang lembut.",
    vagalsignal: "Mengurangi nada Trigeminal & Saraf Vagus kranial.",
  },
  {
    id: "neck-shoulders",
    name: "Bahu & Leher",
    somaticSign: "Bahu terangkat dekat telinga, leher tegang.",
    releasingExercise:
      "Tarik bahu ke telinga selama 5 detik, lalu hembuskan napas kuat sambil menjatuhkan bahu sepenuhnya.",
    vagalsignal:
      "Merangsang cabang Vagus Ventral untuk rileksasi otot trapezius.",
  },
  {
    id: "chest-heart",
    name: "Dada & Paru-paru",
    somaticSign: "Dada terasa sesak, napas pendek di bagian atas dada.",
    releasingExercise:
      "Letakkan satu telapak tangan hangat di tengah dada. Tarik napas perlahan dan rasakan tangan naik-turun.",
    vagalsignal:
      "Menyeimbangkan ritme sinoatrial jantung melalui persarafan vagus.",
  },
  {
    id: "stomach-solar",
    name: "Perut & Solar Plexus",
    somaticSign: "Perut mengeras, sensasi mual atau mual cemas.",
    releasingExercise:
      "Letakkan tangan di perut. Lakukan napas diafragma: embuskan napas lebih panjang dari tarikan napas.",
    vagalsignal:
      "Mengaktifkan saraf splanknikus parasimpatik sistem pencernaan.",
  },
  {
    id: "hands-feet",
    name: "Tangan & Kaki",
    somaticSign: "Jari dingin, telapak tangan berkeringat, kaki tegang.",
    releasingExercise:
      "Goyangkan jari-jari tangan. Tekan kedua telapak kaki dengan kuat ke lantai untuk merasakan tumpuan bumi.",
    vagalsignal:
      "Proprioception tumpuan bumi memberikan sinyal stabilitas ke otak.",
  },
];

export default function SomaticBodyScan() {
  const [selectedRegion, setSelectedRegion] = useState<BodyRegion>(
    bodyRegions[0],
  );
  const [completedRegions, setCompletedRegions] = useState<string[]>([]);

  const toggleComplete = (id: string) => {
    setCompletedRegions((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  return (
    <div className="grid gap-6 rounded-2xl border border-border/80 bg-card/95 p-6 shadow-serene-sm lg:grid-cols-[1fr_1.1fr]">
      {/* Region Selector Buttons */}
      <div className="flex flex-col gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-surface px-3 py-1 text-label-sm font-semibold text-primary">
            <HeartPulse aria-hidden="true" size={13} />
            Pemetaan Ketegangan Somatik
          </span>
          <h3
            id="region-selector-heading"
            className="mt-2 text-headline-sm font-semibold text-foreground"
          >
            Pilih area tubuh yang tegang
          </h3>
          <p className="mt-1 text-body-sm text-muted-foreground">
            Sentuh bagian tubuh di bawah ini untuk melihat teknik pelepasan
            saraf vagus.
          </p>
        </div>

        <div
          role="tablist"
          aria-labelledby="region-selector-heading"
          className="grid gap-2"
        >
          {bodyRegions.map((region) => {
            const isSelected = selectedRegion.id === region.id;
            const isDone = completedRegions.includes(region.id);

            return (
              <button
                key={region.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedRegion(region)}
                className={`flex items-center justify-between rounded-xl border p-3.5 text-left text-title-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                  isSelected
                    ? "border-primary bg-primary-surface text-primary shadow-xs font-semibold"
                    : "border-border/70 bg-background text-foreground hover:bg-muted/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {region.name.slice(0, 1)}
                  </span>
                  <span>{region.name}</span>
                </div>
                {isDone && (
                  <CheckCircle2
                    aria-hidden="true"
                    size={18}
                    className="text-primary"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Somatic Release Prompt Card */}
      <div
        aria-live="polite"
        className="flex flex-col justify-between rounded-xl border border-primary-light/40 bg-gradient-to-br from-primary-surface/60 via-card to-calm-surface/40 p-6 shadow-xs"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedRegion.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >
            <div>
              <span className="text-label-sm font-semibold text-primary">
                Teknik Pelepasan Somatik
              </span>
              <h4 className="mt-1 text-headline-sm font-normal text-foreground">
                {selectedRegion.name}
              </h4>
            </div>

            <div className="rounded-lg bg-card/80 p-3.5 border border-border/60 text-body-sm">
              <p className="font-semibold text-foreground">Ciri Ketegangan:</p>
              <p className="mt-0.5 text-muted-foreground">
                {selectedRegion.somaticSign}
              </p>
            </div>

            <div className="rounded-lg bg-primary-surface p-4 border border-primary-light/40 text-body-md text-foreground">
              <p className="font-semibold text-primary flex items-center gap-1.5">
                <Sparkles aria-hidden="true" size={16} /> Instruksi Rileksasi:
              </p>
              <p className="mt-1.5 leading-relaxed">
                {selectedRegion.releasingExercise}
              </p>
            </div>

            <div className="text-body-sm text-muted-foreground italic">
              <strong className="not-italic text-foreground">
                Mekanisme Vagal:
              </strong>{" "}
              {selectedRegion.vagalsignal}
            </div>
          </motion.div>
        </AnimatePresence>

        <Button
          type="button"
          variant={
            completedRegions.includes(selectedRegion.id) ? "tonal" : "filled"
          }
          onClick={() => toggleComplete(selectedRegion.id)}
          className="mt-6 min-h-12 w-full"
        >
          {completedRegions.includes(selectedRegion.id)
            ? "Sudah Dirilekskan ✓"
            : "Tandai Area Ini Rileks"}
        </Button>
      </div>
    </div>
  );
}
