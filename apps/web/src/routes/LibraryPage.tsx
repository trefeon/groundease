import { useDeferredValue, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/logic/motion";
import {
  Ear,
  Footprints,
  Hand,
  Quote,
  Search,
  Sparkles,
  Waves,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageWrapper } from "@/ui/layout/Container";
import Button from "@/ui/ui/Button";
import Chip from "@/ui/ui/Chip";
import SomaticBodyScan from "@/ui/ui/SomaticBodyScan";
import { affirmations } from "@/config/data/affirmations";
import { groundingTechniques } from "@/config/data/techniques";
import type { AffirmationCategory, GroundingCategory } from "@/types";

type FilterKey = "all" | Exclude<GroundingCategory, "afirmasi">;

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "sensorik", label: "Sensorik" },
  { key: "pernapasan", label: "Pernapasan" },
  { key: "somatik", label: "Somatik & Vagal" },
  { key: "kognitif", label: "Defusi Kognitif" },
  { key: "gerakan", label: "Gerakan" },
];

const affirmationCategories: { key: AffirmationCategory; label: string }[] = [
  { key: "kecemasan", label: "Kecemasan" },
  { key: "stres", label: "Stres" },
  { key: "self-worth", label: "Harga diri" },
  { key: "akademik", label: "Akademik" },
  { key: "umum", label: "Umum" },
];

const iconMap: Record<string, LucideIcon> = {
  Hand,
  Fingerprint: Hand,
  Ear,
  Wind,
  Droplets: Waves,
  Footprints,
};

const categoryLabel: Record<GroundingCategory, string> = {
  sensorik: "Sensorik",
  pernapasan: "Pernapasan",
  somatik: "Somatik & Vagal",
  kognitif: "Defusi Kognitif",
  gerakan: "Gerakan",
  afirmasi: "Afirmasi",
};

export default function LibraryPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [activeAffCategory, setActiveAffCategory] =
    useState<AffirmationCategory>("kecemasan");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filteredTechniques = useMemo(() => {
    return groundingTechniques.filter((technique) => {
      const matchesCategory =
        activeFilter === "all" || technique.category === activeFilter;
      const matchesQuery =
        deferredQuery.length === 0 ||
        technique.name.toLowerCase().includes(deferredQuery) ||
        technique.description.toLowerCase().includes(deferredQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeFilter, deferredQuery]);

  const filteredAffirmations = useMemo(
    () =>
      affirmations
        .filter((affirmation) => affirmation.category === activeAffCategory)
        .slice(0, 4),
    [activeAffCategory],
  );

  return (
    <PageWrapper className="relative">
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="grid gap-6 border-b border-border/70 pb-8 lg:grid-cols-[1fr_360px] lg:items-end"
      >
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-light/40 bg-primary-surface/80 px-4 py-1.5 text-label-md text-primary shadow-xs backdrop-blur-xs">
            <Sparkles aria-hidden="true" size={14} />
            Library teknik
          </div>
          <h1 className="mt-3 text-display-md text-foreground">
            Pilih latihan yang paling mudah dimulai.
          </h1>
          <p className="mt-3 max-w-2xl text-body-lg text-muted-foreground leading-relaxed">
            Semua latihan bisa digunakan tanpa akun. Pilih teknik pendek saat
            cemas naik, atau gunakan sesi lebih panjang untuk latihan rutin.
          </p>
        </div>

        <label htmlFor="search-technique" className="block">
          <span className="mb-2 block text-label-md text-muted-foreground font-semibold">
            Cari teknik
          </span>
          <span className="relative block">
            <Search
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              id="search-technique"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-12 w-full rounded-2xl border border-border/80 bg-card/95 pl-10 pr-4 text-body-md text-foreground outline-none transition duration-200 focus:border-primary focus:ring-3 focus:ring-primary/20 shadow-serene-sm"
              placeholder="Contoh: napas, sentuhan, suara"
              type="search"
            />
          </span>
        </label>
      </motion.header>

      <section className="py-8">
        <div className="mb-6 flex flex-wrap gap-2.5">
          {filters.map((filter) => (
            <Chip
              key={filter.key}
              label={filter.label}
              selected={activeFilter === filter.key}
              onClick={() => setActiveFilter(filter.key)}
            />
          ))}
        </div>

        {filteredTechniques.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {filteredTechniques.map((technique) => {
              const Icon = iconMap[technique.iconName] ?? Hand;

              return (
                <motion.article
                  key={technique.id}
                  variants={staggerItem}
                  className="flex min-h-[260px] flex-col rounded-2xl border border-border/80 bg-card/95 p-6 shadow-serene-sm transition-all duration-300 hover:border-primary-light/60 hover:shadow-serene-md"
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-calm-surface text-calm shadow-xs">
                      <Icon aria-hidden="true" size={24} />
                    </span>
                    <span className="rounded-full bg-primary-surface/80 px-3.5 py-1 text-label-md font-medium text-primary">
                      {technique.duration} menit
                    </span>
                  </div>
                  <p className="text-label-md font-semibold text-primary">
                    {categoryLabel[technique.category]}
                  </p>
                  <h2 className="mt-2 text-headline-sm text-foreground font-normal">
                    {technique.name}
                  </h2>
                  <p className="mt-3 grow text-body-md text-muted-foreground leading-relaxed">
                    {technique.description}
                  </p>
                  <Button
                    className="mt-6 min-h-12 w-full"
                    onClick={() => navigate(`/session/${technique.id}`)}
                  >
                    Mulai latihan
                  </Button>
                </motion.article>
              );
            })}
          </motion.div>
        ) : (
          <div
            role="status"
            className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center shadow-level-1"
          >
            <Search
              aria-hidden="true"
              className="mx-auto text-muted-foreground"
              size={32}
            />
            <h2 className="mt-4 text-headline-sm text-foreground">
              Teknik tidak ditemukan
            </h2>
            <p className="mx-auto mt-2 mb-6 max-w-md text-body-md text-muted-foreground">
              Coba kata kunci lain atau pilih kategori berbeda.
            </p>
            <Button
              variant="outlined"
              className="min-h-12"
              onClick={() => {
                setQuery("");
                setActiveFilter("all");
              }}
            >
              Hapus pencarian
            </Button>
          </div>
        )}
      </section>

      {/* Somatic Vagus Nerve Release Section */}
      <section className="border-t border-border/70 py-8">
        <SomaticBodyScan />
      </section>

      {/* Soothing Affirmation Quote Cards Section */}
      <section className="border-t border-border/70 py-8">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-surface text-primary shadow-xs">
            <Quote aria-hidden="true" size={22} />
          </span>
          <div>
            <p className="text-label-md text-primary">Afirmasi singkat</p>
            <h2 className="text-headline-sm text-foreground">
              Kalimat bantu saat pikiran berputar
            </h2>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {affirmationCategories.map((category) => (
            <Chip
              key={category.key}
              label={category.label}
              selected={activeAffCategory === category.key}
              onClick={() => setActiveAffCategory(category.key)}
              variant="tonal"
            />
          ))}
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-4 md:grid-cols-2"
        >
          {filteredAffirmations.map((affirmation) => (
            <motion.figure
              key={affirmation.id}
              variants={staggerItem}
              className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-primary-light/40 bg-gradient-to-br from-primary-surface/80 via-card to-calm-surface/40 p-6 shadow-level-1 transition-colors hover:border-primary-light/70"
            >
              <Quote
                aria-hidden="true"
                className="absolute right-4 top-4 text-primary-light/25 select-none"
                size={48}
              />
              <blockquote className="relative z-10 font-display text-headline-sm text-foreground leading-relaxed italic">
                "{affirmation.text}"
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-2 text-label-sm text-primary">
                <Sparkles aria-hidden="true" size={14} />
                <span>Penguat Grounding</span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </section>

      <p className="max-w-2xl rounded-xl border border-border bg-card p-4 text-body-sm text-muted-foreground">
        Teknik grounding membantu sebagian orang merasa lebih hadir. Jika gejala
        terasa berat, berulang, atau membahayakan, hubungi profesional kesehatan
        mental atau layanan darurat.
      </p>
    </PageWrapper>
  );
}
