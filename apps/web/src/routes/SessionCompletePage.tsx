import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, CheckCircle2, Home, MessageSquarePlus, ShieldCheck } from 'lucide-react';
import { FEEDBACK_STORAGE_KEY } from '@/ui/ui/FeedbackForm';
import Button from '@/ui/ui/Button';
import { PageWrapper } from '@/ui/layout/Container';
import { getRecentSessions } from '@/services/storage';
import type { GroundingSession } from '@/types';

type LocationState = {
  session?: GroundingSession;
};

export default function SessionCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionFromState = (location.state as LocationState | null)?.session;
  const session = useMemo(() => sessionFromState ?? getRecentSessions(1)[0], [sessionFromState]);

  const durationMinutes = session ? Math.max(1, Math.ceil(session.durationSeconds / 60)) : 0;
  const reduction =
    session && typeof session.anxietyPre === 'number' && typeof session.anxietyPost === 'number'
      ? session.anxietyPre - session.anxietyPost
      : 0;

  return (
    <PageWrapper maxWidth="md" centered className="bg-background">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full rounded-lg border border-border bg-card p-5 shadow-level-1 md:p-8"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-primary-surface text-primary">
          <CheckCircle2 aria-hidden="true" size={34} />
        </div>
        <div className="mt-6 text-center">
          <p className="text-label-md text-primary">Sesi selesai</p>
          <h1 className="mt-2 text-display-sm text-foreground">Terima kasih sudah memberi waktu untuk tubuhmu.</h1>
          <p className="mx-auto mt-4 max-w-lg text-body-lg text-muted-foreground">
            Riwayat sesi tersimpan di perangkat ini. Gunakan hasilnya sebagai refleksi,
            bukan penilaian benar-salah.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <SummaryTile label="Teknik" value={session?.techniqueName ?? 'Grounding'} />
          <SummaryTile label="Durasi" value={durationMinutes > 0 ? `${durationMinutes}m` : '-'} />
          <SummaryTile label="Perubahan SUD" value={reduction > 0 ? `-${reduction}` : '0'} />
        </div>

        <div className="mt-6 rounded-lg border border-primary-light/40 bg-primary-surface p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck aria-hidden="true" className="mt-1 text-primary" size={20} />
            <p className="text-body-md text-primary-container">
              Jika cemas kembali naik, kamu bisa mengulang sesi yang sama atau menghubungi
              orang tepercaya. Jika ada bahaya langsung, gunakan layanan darurat.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Button onClick={() => navigate('/')}>
            <Home aria-hidden="true" size={18} />
            Beranda
          </Button>
          <Button variant="outlined" onClick={() => navigate('/progress')}>
            <BarChart3 aria-hidden="true" size={18} />
            Progres
          </Button>
          <Button variant="tonal" onClick={() => navigate('/library')}>
            Latihan lagi
            <ArrowRight aria-hidden="true" size={18} />
          </Button>
        </div>

        {/* Feedback CTA — only shown if user hasn't submitted feedback yet */}
        {!window.localStorage.getItem(FEEDBACK_STORAGE_KEY) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-6 rounded-lg border border-dashed border-primary/30 bg-primary-surface/50 p-4"
          >
            <div className="flex items-center gap-3">
              <MessageSquarePlus aria-hidden="true" className="shrink-0 text-primary" size={20} />
              <div className="flex-1">
                <p className="text-title-sm text-foreground">Ada masukan?</p>
                <p className="text-body-sm text-muted-foreground">
                  Bantu kami memperbaiki aplikasi ini dengan memberi masukan singkat.
                </p>
              </div>
              <Button variant="text" size="sm" onClick={() => navigate('/feedback')}>
                Beri Masukan
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </PageWrapper>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4 text-center">
      <p className="text-label-md text-muted-foreground">{label}</p>
      <p className="mt-2 text-title-lg text-primary">{value}</p>
    </div>
  );
}
