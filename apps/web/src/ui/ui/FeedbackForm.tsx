import { useState, useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquarePlus,
  Send,
  Star,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import Button from "@/ui/ui/Button";
import { cn } from "@/logic/formatters";

type FeedbackCategory =
  | "kegunaan"
  | "tampilan"
  | "teknik"
  | "saran"
  | "bug"
  | "lainnya";

const CATEGORIES: { value: FeedbackCategory; label: string; emoji: string }[] =
  [
    { value: "kegunaan", label: "Kegunaan", emoji: "🎯" },
    { value: "tampilan", label: "Tampilan", emoji: "🎨" },
    { value: "teknik", label: "Teknik", emoji: "🧘" },
    { value: "saran", label: "Saran", emoji: "💡" },
    { value: "bug", label: "Bug", emoji: "🐛" },
    { value: "lainnya", label: "Lainnya", emoji: "💬" },
  ];

const STAR_LABELS = [
  "Sangat buruk",
  "Kurang",
  "Cukup",
  "Bagus",
  "Sangat bagus",
];

const STORAGE_KEY = "ruang-pulih:feedback-given";

interface FeedbackFormProps {
  sourcePage: string;
  compact?: boolean;
  onSubmitted?: () => void;
}

export default function FeedbackForm({
  sourcePage,
  compact = false,
  onSubmitted,
}: FeedbackFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState<FeedbackCategory | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const ratingId = useId();
  const categoryId = useId();
  const messageId = useId();

  const activeRating = hoverRating || rating;
  const canSubmit = rating > 0 && category !== null;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          category,
          message: message.trim(),
          sourcePage,
        }),
      });

      if (!response.ok) throw new Error("Gagal mengirim");

      window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
      setSubmitted(true);
      toast.success("Terima kasih atas masukanmu!");
      onSubmitted?.();
    } catch {
      toast.error("Gagal mengirim masukan. Coba lagi nanti.");
    } finally {
      setSubmitting(false);
    }
  }, [
    canSubmit,
    submitting,
    rating,
    category,
    message,
    sourcePage,
    onSubmitted,
  ]);

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-3 rounded-lg border border-primary-light/40 bg-primary-surface p-6 text-center"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 size={28} />
        </div>
        <p className="text-title-sm text-primary-container">
          Masukan berhasil dikirim
        </p>
        <p className="text-body-sm text-muted-foreground">
          Terima kasih sudah meluangkan waktu untuk membantu kami menjadi lebih
          baik.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "rounded-lg border border-border bg-card shadow-level-1",
        compact ? "p-4" : "p-5 md:p-6",
      )}
    >
      {/* Header */}
      {!compact && (
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-surface text-primary">
            <MessageSquarePlus size={22} />
          </div>
          <div>
            <p className="text-title-lg text-foreground">Beri Masukan</p>
            <p className="mt-0.5 text-body-sm text-muted-foreground">
              Bantu kami memperbaiki aplikasi ini. Masukanmu anonim dan sangat
              berarti.
            </p>
          </div>
        </div>
      )}

      {/* Star rating */}
      <div className="mb-4">
        <p id={ratingId} className="mb-2 text-label-md text-muted-foreground">
          Bagaimana pengalamanmu? <span className="text-destructive">*</span>
        </p>
        <div
          className="flex items-center gap-1"
          role="group"
          aria-labelledby={ratingId}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              aria-pressed={activeRating >= star}
              className={cn(
                "inline-flex min-h-12 min-w-12 items-center justify-center rounded-md p-1 transition-all duration-150",
                "hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary/40",
                activeRating >= star
                  ? "text-amber-400"
                  : "text-muted-foreground/30",
              )}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              aria-label={`${star} bintang — ${STAR_LABELS[star - 1]}`}
            >
              <Star
                size={compact ? 26 : 30}
                fill={activeRating >= star ? "currentColor" : "none"}
                strokeWidth={1.5}
              />
            </button>
          ))}
          <AnimatePresence mode="wait">
            {activeRating > 0 && (
              <motion.span
                key={activeRating}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="ml-2 text-body-sm text-muted-foreground"
              >
                {STAR_LABELS[activeRating - 1]}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Category */}
      <div className="mb-4">
        <p id={categoryId} className="mb-2 text-label-md text-muted-foreground">
          Kategori <span className="text-destructive">*</span>
        </p>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-labelledby={categoryId}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              aria-pressed={category === cat.value}
              onClick={() => setCategory(cat.value)}
              className={cn(
                "inline-flex min-h-12 min-w-12 items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                category === cat.value
                  ? "border-primary bg-primary-surface text-primary-container shadow-sm"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-muted",
              )}
            >
              <span aria-hidden="true">{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div className="mb-5">
        <label
          htmlFor={messageId}
          className="mb-2 block text-label-md text-muted-foreground"
        >
          Pesan (opsional)
        </label>
        <textarea
          id={messageId}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ceritakan pengalamanmu, saran, atau hal yang bisa kami perbaiki..."
          maxLength={2000}
          rows={compact ? 3 : 4}
          className={cn(
            "w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5",
            "text-body-md text-foreground placeholder:text-outline-variant",
            "transition-all duration-200",
            "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
          )}
        />
        {message.length > 0 && (
          <p className="mt-1 text-right text-body-sm text-muted-foreground">
            {message.length}/2000
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="button"
        disabled={!canSubmit || submitting}
        onClick={handleSubmit}
        className="w-full"
      >
        {submitting ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Send size={18} />
        )}
        {submitting ? "Mengirim..." : "Kirim Masukan"}
      </Button>
    </motion.div>
  );
}

export { STORAGE_KEY as FEEDBACK_STORAGE_KEY };
