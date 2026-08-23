import { motion } from 'framer-motion';
import { Bell, Download, MessageSquarePlus, Moon, Play, ShieldCheck, Square, Trash2, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/ui/layout/Container';
import Button from '@/ui/ui/Button';
import { Alert, AlertDescription, AlertTitle } from '@/ui/ui/alert';
import { Badge } from '@/ui/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/ui/Card';
import { Slider } from '@/ui/ui/slider';
import { Switch } from '@/ui/ui/switch';
import {
  ambientSoundOptions,
  themeOptions,
  usePreferences,
  type AmbientSoundPreference,
} from '@/logic/preferences';
import { useAudioPreview } from '@/logic/useAmbientSound';
import { clearLocalPracticeData, getSessions } from '@/services/storage';

export default function SettingsPage() {
  const { preferences, resolvedTheme, setPreference } = usePreferences();
  const { previewing, playPreview, stopPreview } = useAudioPreview();
  const navigate = useNavigate();

  const exportData = () => {
    const sessions = getSessions();
    const blob = new Blob([JSON.stringify({ sessions }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ruang-pulih-data-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Data lokal diekspor');
  };

  const clearData = () => {
    const confirmed = window.confirm('Hapus semua riwayat latihan dari perangkat ini?');
    if (!confirmed) return;
    clearLocalPracticeData();
    toast.success('Riwayat lokal sudah dihapus');
  };

  return (
    <PageWrapper maxWidth="lg">
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="border-b border-border pb-8"
      >
        <p className="text-label-md text-primary">Setelan</p>
        <h1 className="mt-2 text-display-md text-foreground">Atur tema, audio, dan data lokal.</h1>
        <p className="mt-4 max-w-2xl text-body-lg text-muted-foreground">
          Ruang Pulih berjalan tanpa akun. Tema mengikuti sistem secara default dan semua
          riwayat tetap di perangkat ini.
        </p>
      </motion.header>

      <div className="grid gap-6 py-8">
        <div>
          <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Moon aria-hidden="true" size={20} />
                  Tema
                </CardTitle>
                <CardDescription>Default mengikuti tema perangkat. Teks memakai pasangan warna kontras.</CardDescription>
              </div>
              <Badge variant="secondary">{resolvedTheme === 'dark' ? 'Gelap aktif' : 'Terang aktif'}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-3">
              {themeOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={preferences.theme === option.value ? 'filled' : 'outlined'}
                  onClick={() => setPreference('theme', option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>

        <div>
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 aria-hidden="true" size={20} />
              Audio sesi
            </CardTitle>
            <CardDescription>
              Loop CC0 tersimpan lokal di aplikasi. Suara baru diputar setelah kamu menekan mulai atau preview.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {ambientSoundOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={preferences.ambientSound === option.value ? 'filled' : 'outlined'}
                  onClick={() => setPreference('ambientSound', option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            <div className="grid gap-4 rounded-lg border border-border bg-muted/60 p-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-title-sm text-foreground">Preview suara</p>
                <p className="text-body-sm text-muted-foreground">
                  Volume preview memakai nilai yang sama dengan sesi.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outlined"
                  disabled={preferences.ambientSound === 'none'}
                  onClick={() =>
                    playPreview(
                      preferences.ambientSound as Exclude<AmbientSoundPreference, 'none'>,
                      preferences.ambientVolume,
                    )
                  }
                >
                  <Play aria-hidden="true" size={16} />
                  Preview
                </Button>
                <Button type="button" variant="ghost" disabled={previewing === 'none'} onClick={stopPreview}>
                  <Square aria-hidden="true" size={16} />
                  Stop
                </Button>
              </div>
            </div>

            <div className="grid gap-4 rounded-lg border border-border bg-card p-4 md:grid-cols-[auto_1fr] md:items-center">
              <Button
                type="button"
                variant={preferences.ambientMuted ? 'destructive' : 'outlined'}
                onClick={() => setPreference('ambientMuted', !preferences.ambientMuted)}
              >
                {preferences.ambientMuted ? (
                  <VolumeX aria-hidden="true" size={16} />
                ) : (
                  <Volume2 aria-hidden="true" size={16} />
                )}
                {preferences.ambientMuted ? 'Senyap' : 'Audio aktif'}
              </Button>
              <div className="grid gap-2">
                <div className="flex justify-between gap-3 text-body-sm text-muted-foreground">
                  <span>Volume</span>
                  <span>{preferences.ambientVolume}%</span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={[preferences.ambientVolume]}
                  onValueChange={(value) =>
                    setPreference(
                      'ambientVolume',
                      Array.isArray(value) ? (value[0] ?? 35) : value,
                    )
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
        </div>

        <div>
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell aria-hidden="true" size={20} />
              Pengalaman
            </CardTitle>
            <CardDescription>Preferensi ringan untuk penggunaan harian.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <p className="text-title-sm text-foreground">Pengingat harian</p>
              <p className="text-body-sm text-muted-foreground">
                Tampilkan niat latihan saat membuka aplikasi.
              </p>
            </div>
            <Switch
              checked={preferences.dailyReminder}
              onCheckedChange={(checked) => setPreference('dailyReminder', checked)}
            />
          </CardContent>
        </Card>
        </div>

        <div>
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquarePlus aria-hidden="true" size={20} />
              Masukan Pengguna
            </CardTitle>
            <CardDescription>
              Bantu kami memahami apa yang bisa diperbaiki. Masukan bersifat anonim.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="tonal" onClick={() => navigate('/feedback')} className="w-full sm:w-auto">
              <MessageSquarePlus aria-hidden="true" size={16} />
              Beri Masukan
            </Button>
          </CardContent>
        </Card>
        </div>

        <div>
          <Card>
          <CardHeader>
            <CardTitle>Privasi data</CardTitle>
            <CardDescription>Ekspor atau hapus riwayat yang tersimpan di browser ini.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Button variant="outlined" onClick={exportData}>
              <Download aria-hidden="true" size={16} />
              Ekspor data lokal
            </Button>
            <Button variant="destructive" onClick={clearData}>
              <Trash2 aria-hidden="true" size={16} />
              Hapus riwayat perangkat
            </Button>
          </CardContent>
        </Card>
        </div>

        <div>
          <Alert>
          <ShieldCheck aria-hidden="true" size={18} />
          <AlertTitle>Batas penggunaan</AlertTitle>
          <AlertDescription>
            Ruang Pulih adalah alat bantu self-help dan edukasi. Jika kamu merasa tidak aman,
            hubungi layanan darurat, profesional kesehatan mental, atau orang tepercaya.
          </AlertDescription>
        </Alert>
        </div>
      </div>
    </PageWrapper>
  );
}
