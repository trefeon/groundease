import { Outlet, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  HeartPulse,
  Home,
  Library,
  Settings,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import BlobDecoration from "@/ui/ui/BlobDecoration";
import { Container } from "@/ui/layout/Container";
import PageTransition from "@/ui/layout/PageTransition";
import { cn } from "@/logic/formatters";

type NavItem = {
  to: string;
  label: string;
  description: string;
  Icon: LucideIcon;
};

const navItems: NavItem[] = [
  {
    to: "/",
    label: "Beranda",
    description: "Ringkasan dan mulai cepat",
    Icon: Home,
  },
  {
    to: "/library",
    label: "Teknik",
    description: "Pilih latihan grounding",
    Icon: Library,
  },
  {
    to: "/progress",
    label: "Progres",
    description: "Riwayat lokal perangkat",
    Icon: BarChart3,
  },
  {
    to: "/settings",
    label: "Setelan",
    description: "Privasi dan preferensi",
    Icon: Settings,
  },
];

export default function Layout() {
  const location = useLocation();
  const isSessionRoute = location.pathname.startsWith("/session/");
  const currentNavItem =
    navItems.find(
      ({ to }) =>
        location.pathname === to ||
        (to === "/library" && location.pathname.startsWith("/session")),
    ) ?? navItems[0];

  return (
    <div className="min-h-screen bg-background text-foreground lg:flex">
      <aside className="hidden w-72 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="border-b border-sidebar-border p-6">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <span className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HeartPulse aria-hidden="true" size={22} />
            </span>
            <span>
              <span className="block font-display text-2xl text-primary">
                Ruang Pulih
              </span>
              <span className="block text-body-sm text-muted-foreground">
                Grounding mandiri
              </span>
            </span>
          </Link>
        </div>

        <nav
          aria-label="Navigasi utama"
          className="flex flex-1 flex-col gap-2 p-4"
        >
          {navItems.map(({ to, label, description, Icon }) => {
            const active =
              location.pathname === to ||
              (to === "/library" && location.pathname.startsWith("/session"));

            return (
              <Link
                key={to}
                to={to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3.5 py-3.5 no-underline transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/35",
                  active
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                )}
              >
                {active && (
                  <motion.div
                    layoutId="activeNavDesktop"
                    className="absolute inset-0 rounded-xl bg-primary-surface border border-primary-light/30 shadow-xs"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex shrink-0 items-center justify-center">
                  <Icon aria-hidden="true" size={20} className={active ? "text-primary" : "text-muted-foreground"} />
                </span>
                <span className="relative z-10">
                  <span className="block text-title-sm">{label}</span>
                  <span className="block text-body-sm opacity-75">
                    {description}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <Link
            to="/sos"
            className="group flex items-center gap-3 rounded-xl bg-destructive px-3.5 py-3.5 text-destructive-foreground no-underline shadow-serene-sm transition-all hover:bg-destructive/90 hover:shadow-serene-md"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-white/20 text-white transition-transform group-hover:scale-110">
              <ShieldCheck aria-hidden="true" size={20} />
            </span>
            <span>
              <span className="block text-title-sm font-semibold">Butuh bantuan cepat?</span>
              <span className="block text-body-sm opacity-90">Buka mode SOS</span>
            </span>
          </Link>
        </div>
      </aside>

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <BlobDecoration />
        {!isSessionRoute && (
          <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md lg:hidden">
            <Container className="flex h-16 items-center justify-between">
              <Link to="/" className="flex items-center gap-3 no-underline">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-serene-sm">
                  <HeartPulse aria-hidden="true" size={20} />
                </span>
                <span className="font-display text-2xl font-normal text-primary">
                  Ruang Pulih
                </span>
              </Link>
              <Link
                to="/sos"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-destructive px-3.5 text-label-md text-destructive-foreground no-underline shadow-serene-sm transition-transform active:scale-95"
              >
                <ShieldCheck aria-hidden="true" size={16} />
                SOS
              </Link>
            </Container>
          </header>
        )}

        {!isSessionRoute && (
          <header className="sticky top-0 z-30 hidden border-b border-border/80 bg-background/80 backdrop-blur-md lg:block">
            <Container className="flex h-16 items-center justify-between">
              <div>
                <p className="text-title-sm font-semibold text-foreground">
                  {currentNavItem.label}
                </p>
                <p className="text-body-sm text-muted-foreground">
                  {currentNavItem.description}
                </p>
              </div>
              <Link
                to="/sos"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-destructive px-4 text-label-md text-destructive-foreground no-underline shadow-serene-sm transition-all hover:bg-destructive/90 hover:shadow-serene-md"
              >
                <ShieldCheck aria-hidden="true" size={16} />
                Mode SOS
              </Link>
            </Container>
          </header>
        )}

        <main
          className={cn(
            "flex-1",
            !isSessionRoute &&
              "pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))] lg:pb-0",
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>

        {!isSessionRoute && (
          <footer className="hidden border-t border-border/70 bg-card/60 py-6 backdrop-blur-xs lg:block">
            <Container className="flex items-center justify-between gap-4 text-body-sm text-muted-foreground">
              <span>Ruang Pulih · Grounding mandiri lokal di perangkat kamu.</span>
              <span>
                Alat bantu edukasi, bukan pengganti layanan profesional.
              </span>
            </Container>
          </footer>
        )}
      </div>

      {!isSessionRoute && (
        <nav
          aria-label="Navigasi bawah"
          className="fixed bottom-0 left-0 z-50 grid min-h-[calc(4.25rem+env(safe-area-inset-bottom,0px))] w-full grid-cols-4 border-t border-border/80 bg-card/90 px-2 pb-[calc(env(safe-area-inset-bottom,0px)+0.375rem)] pt-1.5 backdrop-blur-md lg:hidden"
        >
          {navItems.map(({ to, label, Icon }) => {
            const active =
              location.pathname === to ||
              (to === "/library" && location.pathname.startsWith("/session"));

            return (
              <Link
                key={to}
                to={to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl py-1.5 text-xs font-semibold no-underline transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/35",
                  active
                    ? "text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <motion.div
                    layoutId="activeNavMobile"
                    className="absolute inset-x-1.5 inset-y-1 rounded-xl bg-primary-surface border border-primary-light/40 shadow-xs"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex flex-col items-center gap-0.5">
                  <Icon aria-hidden="true" size={20} className={active ? "text-primary" : "text-muted-foreground"} />
                  <span>{label}</span>
                </span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
