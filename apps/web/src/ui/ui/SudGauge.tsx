import { motion } from "framer-motion";
import { Info, ShieldAlert, Sparkles } from "lucide-react";
import { Slider } from "@/ui/ui/slider";
import { getReadableTextColor } from "@/logic/color";
import { cn } from "@/logic/formatters";

export interface SudGaugeProps {
  score: number;
  onChange: (newScore: number) => void;
  showClinicalInfo?: boolean;
}

export interface ClinicalAnchor {
  score: number;
  label: string;
  category: "calm" | "mild" | "moderate" | "severe" | "extreme";
  description: string;
  somaticMarker: string;
  recommendation: string;
  color: string;
}

export const sudAnchors: ClinicalAnchor[] = [
  {
    score: 0,
    label: "Pristine Calm",
    category: "calm",
    description: "Tenang sepenuhnya, tidak ada ketegangan fisik atau kecemasan.",
    somaticMarker: "Napas pelan, otot rileks, denyut nadi stabil.",
    recommendation: "Latihan grounding ringan untuk mempertahankan kestabilan.",
    color: "#2f8061",
  },
  {
    score: 2,
    label: "Ringan / Kewaspadaan Normal",
    category: "mild",
    description: "Sedikit kekhawatiran ringan, namun perhatian mudah dialihkan.",
    somaticMarker: "Kewaspadaan ringan tanpa sesak napas.",
    recommendation: "Grounding sensorik 5-4-3-2-1 atau afirmasi positif.",
    color: "#3b707a",
  },
  {
    score: 5,
    label: "Sedang / Ketegangan Otot",
    category: "moderate",
    description: "Kecemasan terasa nyata. Ketegangan pada bahu atau rahang.",
    somaticMarker: "Bahu terangkat, rahang kaku, napas agak pendek.",
    recommendation: "Latihan Box Breathing (4-4-4-4) atau Relaksasi Somatik Vagal.",
    color: "#d97706",
  },
  {
    score: 7,
    label: "Cukup Tinggi / Lonjakan Simpatis",
    category: "severe",
    description: "Pikiran berputar, jantung berdebar kencang, sulit fokus.",
    somaticMarker: "Tachycardia ringan, telapak tangan berkeringat, gelisah.",
    recommendation: "Utamakan rasa aman. Gunakan Mode SOS atau teknik TIPP sentuhan.",
    color: "#ea580c",
  },
  {
    score: 10,
    label: "Sangat Tinggi / Amygdala Hijack",
    category: "extreme",
    description: "Kecemasan ekstrim atau perasaan kewalahan mendalam.",
    somaticMarker: "Napas sangat cepat, sensasi panik hebat.",
    recommendation: "Gunakan Mode SOS darurat. Hubungi bantuan darurat 112/119 jika merasa tidak aman.",
    color: "#dc2626",
  },
];

export function getAnchorForScore(score: number): ClinicalAnchor {
  if (score <= 1) return sudAnchors[0];
  if (score <= 3) return sudAnchors[1];
  if (score <= 6) return sudAnchors[2];
  if (score <= 8) return sudAnchors[3];
  return sudAnchors[4];
}

export default function SudGauge({
  score,
  onChange,
  showClinicalInfo = true,
}: SudGaugeProps) {
  const currentAnchor = getAnchorForScore(score);
  const textColor = getReadableTextColor(currentAnchor.color);

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border/80 bg-card/95 p-6 shadow-serene-sm">
      {/* Top Clinical Score Badge */}
      <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-surface px-3 py-1 text-label-sm font-semibold text-primary">
            <Sparkles aria-hidden="true" size={13} />
            SUD Scale (Wolpe Clinical Metric)
          </div>
          <h3 className="mt-1 text-headline-sm font-semibold text-foreground">
            {currentAnchor.label}
          </h3>
        </div>
        <motion.div
          animate={{ backgroundColor: currentAnchor.color }}
          transition={{ duration: 0.3 }}
          className="flex h-16 w-20 flex-col items-center justify-center rounded-2xl font-display shadow-serene-sm"
          style={{ color: textColor }}
        >
          <span className="text-3xl font-bold">{score}</span>
          <span className="text-[10px] font-mono opacity-80 uppercase">/ 10 SUD</span>
        </motion.div>
      </div>

      {/* Interactive Slider Bar */}
      <div className="space-y-4">
        <Slider
          min={0}
          max={10}
          step={1}
          value={[score]}
          onValueChange={(val) => onChange(Array.isArray(val) ? val[0] : val)}
          aria-label="Skor kecemasan SUD 0 sampai 10"
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
                onClick={() => onChange(num)}
                className={cn(
                  "flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg text-xs sm:text-sm transition-all cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isSelected
                    ? "bg-primary text-primary-foreground font-bold shadow-xs scale-110"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
                )}
                aria-label={`Pilih skor ${num}`}
                aria-pressed={isSelected}
              >
                {num}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between font-mono text-xs font-semibold text-muted-foreground pt-1">
          <span>0 (Tenang)</span>
          <span>5 (Kecemasan Sedang)</span>
          <span>10 (Kecemasan Sangat Tinggi)</span>
        </div>
      </div>

      {/* Clinical Reference Box */}
      {showClinicalInfo && (
        <motion.div
          key={currentAnchor.score}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="grid gap-3 rounded-xl border border-border/60 bg-muted/40 p-4 text-body-sm"
        >
          <div className="flex items-start gap-2.5">
            <Info aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Marker Somatis:</p>
              <p className="text-muted-foreground">{currentAnchor.somaticMarker}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldAlert aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300" />
            <div>
              <p className="font-semibold text-foreground">Saran Rekomendasi Klinik:</p>
              <p className="text-muted-foreground">{currentAnchor.recommendation}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
