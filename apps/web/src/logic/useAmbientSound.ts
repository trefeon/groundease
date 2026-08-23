import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ambientSoundSources,
  type AmbientSoundPreference,
} from '@/logic/preferences';

type AmbientSoundOptions = {
  active: boolean;
  sound: AmbientSoundPreference;
  muted?: boolean;
  volume?: number;
};

type InteractionType = 'click' | 'keydown' | 'pointerdown' | 'touchend';
type InteractionEntry = { handler: () => void; type: InteractionType };

let _prefersOgg: boolean | null = null;
let sessionAudio: HTMLAudioElement | null = null;
let sessionAudioSrc: string | null = null;

function prefersOgg(): boolean {
  if (_prefersOgg !== null) return _prefersOgg;
  if (typeof document === 'undefined') {
    _prefersOgg = false;
    return false;
  }

  const audio = document.createElement('audio');
  const canPlay = audio.canPlayType('audio/ogg; codecs="vorbis"');
  _prefersOgg = canPlay === 'probably' || canPlay === 'maybe';
  return _prefersOgg;
}

function getAudioSource(sound: AmbientSoundPreference): string | null {
  if (sound === 'none') return null;
  const sources = ambientSoundSources[sound];
  return prefersOgg() ? sources.ogg : sources.mp3;
}

function normalizeVolume(volume = 35) {
  return Math.min(1, Math.max(0, volume / 100));
}

function applyMobileAudioAttributes(audio: HTMLAudioElement) {
  audio.loop = true;
  audio.preload = 'auto';
  audio.setAttribute('playsinline', 'true');
  audio.setAttribute('webkit-playsinline', 'true');
}

function getSessionAudio(src: string, muted: boolean, volume: number) {
  if (typeof document === 'undefined') return null;

  if (!sessionAudio || sessionAudioSrc !== src) {
    sessionAudio?.pause();
    sessionAudio = new Audio();
    applyMobileAudioAttributes(sessionAudio);
    sessionAudio.src = src;
    sessionAudio.load();
    sessionAudioSrc = src;
  }

  sessionAudio.muted = muted;
  sessionAudio.volume = muted ? 0 : normalizeVolume(volume);
  return sessionAudio;
}

function destroySessionAudio() {
  sessionAudio?.pause();
  if (sessionAudio) {
    sessionAudio.removeAttribute('src');
    sessionAudio.load();
  }
  sessionAudio = null;
  sessionAudioSrc = null;
}

function playAudio(audio: HTMLAudioElement) {
  const playPromise = audio.play();
  return playPromise === undefined ? Promise.resolve() : playPromise;
}

let audioCtx: AudioContext | null = null;
let synthOsc1: OscillatorNode | null = null;
let synthOsc2: OscillatorNode | null = null;
let synthGain: GainNode | null = null;

function startWebAudioTone(volume = 35) {
  if (typeof window === 'undefined') return;
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioCtxClass();
    }
    if (audioCtx.state === 'suspended') {
      void audioCtx.resume();
    }

    stopWebAudioTone();

    // 432 Hz Solfeggio Harmonic Frequency Pair for Parasympathetic Grounding
    synthOsc1 = audioCtx.createOscillator();
    synthOsc2 = audioCtx.createOscillator();
    synthGain = audioCtx.createGain();

    synthOsc1.type = 'sine';
    synthOsc1.frequency.setValueAtTime(432, audioCtx.currentTime); // 432Hz fundamental calm tone

    synthOsc2.type = 'sine';
    synthOsc2.frequency.setValueAtTime(436, audioCtx.currentTime); // 4Hz binaural theta delta beat

    const targetGain = (volume / 100) * 0.15;
    synthGain.gain.setValueAtTime(0, audioCtx.currentTime);
    synthGain.gain.linearRampToValueAtTime(targetGain, audioCtx.currentTime + 2);

    synthOsc1.connect(synthGain);
    synthOsc2.connect(synthGain);
    synthGain.connect(audioCtx.destination);

    synthOsc1.start();
    synthOsc2.start();
  } catch (err) {
    console.warn('Web Audio Synthesizer init warning:', err);
  }
}

function stopWebAudioTone() {
  try {
    if (synthGain && audioCtx) {
      synthGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
    }
    setTimeout(() => {
      synthOsc1?.stop();
      synthOsc2?.stop();
      synthOsc1?.disconnect();
      synthOsc2?.disconnect();
      synthOsc1 = null;
      synthOsc2 = null;
    }, 500);
  } catch {}
}

export function primeAmbientPlayback({
  sound,
  muted = false,
  volume = 35,
}: Omit<AmbientSoundOptions, 'active'>) {
  const src = getAudioSource(sound);
  if (!src || muted) return Promise.resolve(false);

  const audio = getSessionAudio(src, false, volume);
  if (!audio) return Promise.resolve(false);

  return playAudio(audio)
    .then(() => true)
    .catch(() => {
      startWebAudioTone(volume);
      return true;
    });
}

export function useAmbientSound({
  active,
  sound,
  muted = false,
  volume = 35,
}: AmbientSoundOptions) {
  const src = useMemo(() => getAudioSource(sound), [sound]);
  const interactionRef = useRef<InteractionEntry[] | null>(null);

  const clearInteractionHandlers = () => {
    if (!interactionRef.current || typeof document === 'undefined') return;

    for (const entry of interactionRef.current) {
      document.removeEventListener(entry.type, entry.handler);
    }
    interactionRef.current = null;
  };

  useEffect(() => {
    return () => {
      clearInteractionHandlers();
      destroySessionAudio();
      stopWebAudioTone();
    };
  }, []);

  useEffect(() => {
    if (!src) {
      destroySessionAudio();
      stopWebAudioTone();
      return;
    }

    getSessionAudio(src, muted, volume);
  }, [muted, src, volume]);

  useEffect(() => {
    clearInteractionHandlers();

    if (!src) {
      stopWebAudioTone();
      return;
    }

    const audio = getSessionAudio(src, muted, volume);
    if (!audio) return;

    if (active && !muted) {
      void playAudio(audio).catch(() => {
        // Fallback to Web Audio Synthesizer if HTML5 Audio fails
        startWebAudioTone(volume);

        if (typeof document === 'undefined') return;

        const retry = () => {
          void playAudio(audio)
            .then(() => {
              stopWebAudioTone();
              clearInteractionHandlers();
            })
            .catch(() => {});
        };

        interactionRef.current = [
          { handler: retry, type: 'pointerdown' },
          { handler: retry, type: 'touchend' },
          { handler: retry, type: 'click' },
          { handler: retry, type: 'keydown' },
        ];

        for (const entry of interactionRef.current) {
          document.addEventListener(entry.type, entry.handler, { once: true });
        }
      });
    } else {
      audio.pause();
      stopWebAudioTone();
    }
  }, [active, muted, src, volume]);

  return null;
}

export function useAudioPreview() {
  const previewRef = useRef<HTMLAudioElement | null>(null);
  const [previewing, setPreviewing] = useState<AmbientSoundPreference>('none');

  const stopPreview = () => {
    previewRef.current?.pause();
    previewRef.current = null;
    setPreviewing('none');
  };

  const playPreview = (sound: AmbientSoundPreference, volume = 35) => {
    stopPreview();
    const src = getAudioSource(sound);
    if (!src) return;

    const audio = new Audio();
    applyMobileAudioAttributes(audio);
    audio.src = src;
    audio.volume = normalizeVolume(volume);
    audio.load();
    previewRef.current = audio;
    setPreviewing(sound);
    void audio.play().catch(stopPreview);
  };

  useEffect(() => stopPreview, []);

  return { previewing, playPreview, stopPreview };
}
