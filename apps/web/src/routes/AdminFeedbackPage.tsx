import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Download,
  KeyRound,
  Loader2,
  LogOut,
  MessageSquare,
  Star,
  TrendingUp,
} from "lucide-react";
import { PageWrapper } from "@/ui/layout/Container";
import Button from "@/ui/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/ui/ui/Card";
import Input from "@/ui/ui/Input";
import { cn } from "@/logic/formatters";

const SESSION_KEY = "ruang-pulih:admin-key";

type FeedbackItem = {
  _id?: string;
  rating: number;
  category: string;
  message: string;
  sourcePage: string;
  userAgent: string;
  createdAt: string;
};

type FeedbackStats = {
  total: number;
  averageRating: number;
  byCategory: Record<string, number>;
};

const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  kegunaan: { label: "Kegunaan", emoji: "🎯" },
  tampilan: { label: "Tampilan", emoji: "🎨" },
  teknik: { label: "Teknik", emoji: "🧘" },
  saran: { label: "Saran", emoji: "💡" },
  bug: { label: "Bug", emoji: "🐛" },
  lainnya: { label: "Lainnya", emoji: "💬" },
};

export default function AdminFeedbackPage() {
  const [adminKey, setAdminKey] = useState("");
  const [storedKey, setStoredKey] = useState(
    () => sessionStorage.getItem(SESSION_KEY) ?? "",
  );
  const authenticated = storedKey.length > 0;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("");

  // Fetch data when authenticated (key restored lazily from sessionStorage)
  const fetchData = useCallback(
    async (key: string) => {
      setLoading(true);
      try {
        const categoryParam = filterCategory
          ? `&category=${filterCategory}`
          : "";
        const [feedbackRes, statsRes] = await Promise.all([
          fetch(
            `/api/feedback?key=${encodeURIComponent(key)}&limit=200${categoryParam}`,
          ),
          fetch(`/api/feedback/stats?key=${encodeURIComponent(key)}`),
        ]);

        if (feedbackRes.status === 401 || statsRes.status === 401) {
          setStoredKey("");
          sessionStorage.removeItem(SESSION_KEY);
          setError("Kunci admin tidak valid atau sudah berubah.");
          return;
        }

        const feedbackData = await feedbackRes.json();
        const statsData = await statsRes.json();

        setFeedback(feedbackData.data ?? []);
        setStats(statsData.data ?? null);
        setError("");
      } catch {
        setError("Gagal memuat data. Pastikan server backend berjalan.");
      } finally {
        setLoading(false);
      }
    },
    [filterCategory],
  );

  useEffect(() => {
    if (authenticated && storedKey) {
      // Deferred out of the effect's synchronous tick so the loading state
      // is only set from the async fetch path (react-hooks/set-state-in-effect)
      void Promise.resolve().then(() => fetchData(storedKey));
    }
  }, [authenticated, storedKey, fetchData]);

  const handleLogin = async () => {
    if (!adminKey.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/feedback/stats?key=${encodeURIComponent(adminKey.trim())}`,
      );

      if (res.status === 401) {
        setError("Kunci admin salah. Coba lagi.");
        setLoading(false);
        return;
      }

      sessionStorage.setItem(SESSION_KEY, adminKey.trim());
      setStoredKey(adminKey.trim());
    } catch {
      setError("Tidak bisa terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setStoredKey("");
    setAdminKey("");
    setFeedback([]);
    setStats(null);
  };

  const exportCsv = () => {
    if (feedback.length === 0) return;
    const headers = [
      "Tanggal",
      "Rating",
      "Kategori",
      "Pesan",
      "Halaman Asal",
      "User Agent",
    ];
    const rows = feedback.map((f) => [
      new Date(f.createdAt).toLocaleString("id-ID"),
      String(f.rating),
      CATEGORY_LABELS[f.category]?.label ?? f.category,
      `"${(f.message ?? "").replace(/"/g, '""')}"`,
      f.sourcePage,
      `"${(f.userAgent ?? "").replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `feedback-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ── Login Gate ──
  if (!authenticated) {
    return (
      <PageWrapper maxWidth="sm" centered className="bg-background">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full"
        >
          <Card>
            <CardHeader>
              <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-lg bg-primary-surface text-primary">
                <KeyRound size={28} />
              </div>
              <CardTitle className="text-center">Admin Feedback</CardTitle>
              <CardDescription className="text-center">
                Masukkan kunci admin untuk melihat semua masukan pengguna.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Input
                type="password"
                label="Kunci Admin"
                placeholder="Masukkan kunci rahasia..."
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                error={error || undefined}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <Button
                onClick={handleLogin}
                disabled={!adminKey.trim() || loading}
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <KeyRound size={18} />
                )}
                {loading ? "Memverifikasi..." : "Masuk"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </PageWrapper>
    );
  }

  // ── Dashboard ──
  return (
    <PageWrapper maxWidth="lg" className="bg-background">
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex items-start justify-between gap-4 border-b border-border pb-8"
      >
        <div>
          <p className="text-label-md text-primary">Admin</p>
          <h1 className="mt-2 text-display-md text-foreground">
            Dashboard Feedback
          </h1>
          <p className="mt-2 text-body-lg text-muted-foreground">
            Semua masukan dari pengguna Ruang Pulih.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outlined"
            size="sm"
            onClick={exportCsv}
            disabled={feedback.length === 0}
          >
            <Download size={16} />
            CSV
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut size={16} />
            Keluar
          </Button>
        </div>
      </motion.header>

      {loading && feedback.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6 py-8">
          {/* Stats row */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-4 sm:grid-cols-3"
            >
              <StatCard
                icon={<MessageSquare size={20} />}
                label="Total Masukan"
                value={String(stats.total)}
              />
              <StatCard
                icon={<Star size={20} />}
                label="Rata-rata Rating"
                value={
                  stats.averageRating > 0 ? `${stats.averageRating} / 5` : "-"
                }
                accent
              />
              <StatCard
                icon={<TrendingUp size={20} />}
                label="Kategori Terbanyak"
                value={getTopCategory(stats.byCategory)}
              />
            </motion.div>
          )}

          {/* Category distribution */}
          {stats && stats.total > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={20} />
                  Distribusi Kategori
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {Object.entries(stats.byCategory)
                    .sort(([, a], [, b]) => b - a)
                    .map(([cat, count]) => (
                      <div key={cat} className="flex items-center gap-3">
                        <span className="w-24 shrink-0 text-body-sm text-muted-foreground">
                          {CATEGORY_LABELS[cat]?.emoji}{" "}
                          {CATEGORY_LABELS[cat]?.label ?? cat}
                        </span>
                        <div className="flex-1">
                          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(count / stats.total) * 100}%`,
                              }}
                              transition={{ duration: 0.6, delay: 0.1 }}
                              className="h-full rounded-full bg-primary"
                            />
                          </div>
                        </div>
                        <span className="w-10 text-right text-body-sm font-medium text-foreground">
                          {count}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filter chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-label-md text-muted-foreground">Filter:</span>
            <button
              type="button"
              onClick={() => setFilterCategory("")}
              aria-pressed={!filterCategory}
              className={cn(
                "inline-flex min-h-12 min-w-12 items-center justify-center rounded-lg border px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                !filterCategory
                  ? "border-primary bg-primary-surface text-primary-container"
                  : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              Semua
            </button>
            {Object.entries(CATEGORY_LABELS).map(([key, { label, emoji }]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilterCategory(key)}
                aria-pressed={filterCategory === key}
                className={cn(
                  "inline-flex min-h-12 min-w-12 items-center justify-center rounded-lg border px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  filterCategory === key
                    ? "border-primary bg-primary-surface text-primary-container"
                    : "border-border text-muted-foreground hover:bg-muted",
                )}
              >
                {emoji} {label}
              </button>
            ))}
          </div>

          {/* Feedback list */}
          <div className="grid gap-3">
            <AnimatePresence mode="popLayout">
              {feedback.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground"
                >
                  <MessageSquare
                    size={32}
                    className="mx-auto mb-3 opacity-40"
                  />
                  <p className="text-title-sm">Belum ada masukan</p>
                  <p className="mt-1 text-body-sm">
                    Masukan akan muncul di sini setelah pengguna mengirimkannya.
                  </p>
                </motion.div>
              ) : (
                feedback.map((item, i) => (
                  <motion.div
                    key={item._id ?? i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{
                      duration: 0.25,
                      delay: Math.min(i * 0.03, 0.3),
                    }}
                    layout
                  >
                    <FeedbackCard item={item} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

/* ── Sub-components ── */

function StatCard({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            accent
              ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
              : "bg-primary-surface text-primary",
          )}
        >
          {icon}
        </div>
        <div>
          <p className="text-body-sm text-muted-foreground">{label}</p>
          <p className="text-title-lg text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function FeedbackCard({ item }: { item: FeedbackItem }) {
  const catInfo = CATEGORY_LABELS[item.category] ?? {
    label: item.category,
    emoji: "💬",
  };
  const date = new Date(item.createdAt);

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:bg-muted/30">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Stars */}
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={14}
                className={
                  s <= item.rating
                    ? "text-amber-400"
                    : "text-muted-foreground/20"
                }
                fill={s <= item.rating ? "currentColor" : "none"}
                strokeWidth={1.5}
              />
            ))}
          </div>
          <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {catInfo.emoji} {catInfo.label}
          </span>
        </div>
        <span className="text-body-sm text-muted-foreground">
          {date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}{" "}
          {date.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      {item.message && (
        <p className="mt-2.5 text-body-md text-foreground">{item.message}</p>
      )}
      <p className="mt-2 text-body-sm text-muted-foreground/60">
        Dari: {item.sourcePage}
      </p>
    </div>
  );
}

function getTopCategory(byCategory: Record<string, number>): string {
  const entries = Object.entries(byCategory);
  if (entries.length === 0) return "-";
  const [cat] = entries.sort(([, a], [, b]) => b - a)[0];
  return CATEGORY_LABELS[cat]?.label ?? cat;
}
