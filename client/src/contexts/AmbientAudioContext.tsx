import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

type Soundscape = "still-water" | "night-garden" | "soft-lantern";

type AmbientAudioContextValue = {
  enabled: boolean;
  isActive: boolean;
  volume: number;
  soundscape: Soundscape;
  activate: () => void;
  toggleEnabled: () => void;
  setVolume: (value: number) => void;
  setSoundscape: (value: Soundscape) => void;
};

type AudioState = {
  element: HTMLAudioElement;
  timers: number[];
  animationFrame: number;
};

const AmbientAudioContext = createContext<AmbientAudioContextValue | null>(null);
const ENABLED_KEY = "ao_ambient_enabled";
const VOLUME_KEY = "ao_ambient_volume";
const SOUNDSCAPE_KEY = "ao_ambient_soundscape";
const ORIGINALS_AUDIO_BASE = "https://anomoriginals.lol/manus-storage";
const AMBIENT_SOURCES: Record<Soundscape, string> = {
  "still-water": `${ORIGINALS_AUDIO_BASE}/ao-ambient-minimal_dd7f1b9b.mp3`,
  "night-garden": `${ORIGINALS_AUDIO_BASE}/ao-ambient-sanctuary_209ee8e9.mp3`,
  "soft-lantern": `${ORIGINALS_AUDIO_BASE}/ao-ambient-sanctuary_209ee8e9.mp3`,
};

export const SOUNDSCAPES: Array<{ value: Soundscape; label: string; detail: string }> = [
  { value: "still-water", label: "Still Water", detail: "soft drone + distant bells" },
  { value: "night-garden", label: "Night Garden", detail: "warm pad + gentle harp tones" },
  { value: "soft-lantern", label: "Soft Lantern", detail: "low glow + quiet piano notes" },
];

function readEnabled() {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(ENABLED_KEY) !== "false";
}

function readVolume() {
  if (typeof window === "undefined") return 0.22;
  const stored = Number(window.localStorage.getItem(VOLUME_KEY));
  return Number.isFinite(stored) ? Math.min(1, Math.max(0, stored)) : 0.22;
}

function readSoundscape(): Soundscape {
  if (typeof window === "undefined") return "night-garden";
  const stored = window.localStorage.getItem(SOUNDSCAPE_KEY);
  return stored === "still-water" || stored === "soft-lantern" ? stored : "night-garden";
}

function makeNoiseBuffer(context: AudioContext, seconds: number, amount: number) {
  const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) {
    data[index] = (Math.random() * 2 - 1) * amount;
  }
  return buffer;
}

export function AmbientAudioProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(readEnabled);
  const [volume, setVolumeState] = useState(readVolume);
  const [soundscape, setSoundscapeState] = useState<Soundscape>(readSoundscape);
  const [isActive, setIsActive] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [equalizerBars, setEqualizerBars] = useState<number[]>(() => Array.from({ length: 12 }, () => 0.16));
  const audioRef = useRef<AudioState | null>(null);

  const updateMaster = useCallback((nextVolume: number, nextEnabled: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.element.volume = nextEnabled ? nextVolume : 0;
  }, []);

  const stopAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.timers.forEach((timer) => window.clearInterval(timer));
    window.cancelAnimationFrame(audio.animationFrame);
    audio.element.pause();
    audio.element.removeAttribute("src");
    audio.element.load();
    audio.element.remove();
    audioRef.current = null;
    setIsActive(false);
    setEqualizerBars(Array.from({ length: 12 }, () => 0.16));
  }, []);

  const startAudio = useCallback((selectedSoundscape: Soundscape, nextEnabled = enabled, nextVolume = volume) => {
    if (audioRef.current || typeof window === "undefined") return;
    const element = new Audio();
    element.crossOrigin = "anonymous";
    element.src = AMBIENT_SOURCES[selectedSoundscape];
    element.loop = true;
    element.preload = "auto";
    element.volume = nextEnabled ? nextVolume : 0;
    element.setAttribute("aria-hidden", "true");
    element.style.display = "none";
    document.body.appendChild(element);
    element.addEventListener("error", () => {
      setAudioError("The AO soundtrack could not load. Try Ambient on again.");
      stopAudio();
    }, { once: true });
    let lastPaint = 0;
    const samplePlayback = (timestamp: number) => {
      if (!audioRef.current) return;
      if (timestamp - lastPaint >= 33) {
        lastPaint = timestamp;
        setEqualizerBars(Array.from({ length: 12 }, (_, index) => {
          const wave = Math.sin(timestamp / 260 + index * 0.72);
          return Math.max(0.18, Math.min(1, 0.36 + (wave + 1) * 0.24));
        }));
      }
      audioRef.current.animationFrame = window.requestAnimationFrame(samplePlayback);
    };
    const animationFrame = window.requestAnimationFrame(samplePlayback);
    audioRef.current = { element, timers: [], animationFrame };
    void element.play()
      .then(() => {
        setAudioError(null);
        setIsActive(true);
      })
      .catch((error: unknown) => {
        const message = error instanceof DOMException && error.name === "NotAllowedError"
          ? "Tap Ambient on to allow Sanctuary sound."
          : "The AO soundtrack could not load. Try Ambient on again.";
        setAudioError(message);
        stopAudio();
      });
  }, [enabled, stopAudio, volume]);

  const activate = useCallback(() => {
    const nextVolume = volume > 0 ? volume : 0.22;
    if (volume === 0) {
      setVolumeState(nextVolume);
      window.localStorage.setItem(VOLUME_KEY, String(nextVolume));
    }
    setEnabled(true);
    window.localStorage.setItem(ENABLED_KEY, "true");
    startAudio(soundscape, true, nextVolume);
  }, [soundscape, startAudio, volume]);

  const toggleEnabled = useCallback(() => {
    if (!audioRef.current || !isActive) {
      stopAudio();
      activate();
      return;
    }
    setEnabled((current) => {
      const next = !current;
      window.localStorage.setItem(ENABLED_KEY, String(next));
      updateMaster(volume, next);
      return next;
    });
  }, [activate, isActive, stopAudio, updateMaster, volume]);

  const setVolume = useCallback((nextValue: number) => {
    const next = Math.min(1, Math.max(0, nextValue));
    setVolumeState(next);
    window.localStorage.setItem(VOLUME_KEY, String(next));
    updateMaster(next, enabled);
    if (next > 0 && enabled && !audioRef.current) startAudio(soundscape, true, next);
  }, [enabled, soundscape, startAudio, updateMaster]);

  const setSoundscape = useCallback((next: Soundscape) => {
    setSoundscapeState(next);
    window.localStorage.setItem(SOUNDSCAPE_KEY, next);
    if (audioRef.current) {
      stopAudio();
      window.setTimeout(() => startAudio(next), 40);
    }
  }, [startAudio, stopAudio]);

  useEffect(() => {
    window.localStorage.setItem(ENABLED_KEY, String(enabled));
  }, [enabled]);

  useEffect(() => {
    window.localStorage.setItem(VOLUME_KEY, String(volume));
  }, [volume]);

  useEffect(() => stopAudio, [stopAudio]);

  const value = useMemo(() => ({ enabled, isActive, volume, soundscape, activate, toggleEnabled, setVolume, setSoundscape }), [activate, enabled, isActive, setSoundscape, setVolume, soundscape, toggleEnabled, volume]);

  return (
    <AmbientAudioContext.Provider value={value}>
      {children}
      <div className="ao-ambient-control" aria-label="Ambient Sanctuary sound controls">
        {!isActive && <span className="ao-ambient-hint" role="status">{audioError ?? (volume === 0 ? "Raise volume to hear Sanctuary" : "Press Ambient on to hear the soundtrack")}</span>}
        <div className="ao-audio-equalizer" role="img" aria-label={isActive ? "Ambient soundtrack equalizer responding to playback" : "Ambient soundtrack equalizer idle"} data-active={isActive}>
          {equalizerBars.map((height, index) => <span key={index} style={{ "--ao-eq-height": `${height * 100}%` } as CSSProperties} aria-hidden="true" />)}
        </div>
        <button type="button" className="ao-ambient-toggle" onClick={toggleEnabled} aria-pressed={enabled}>
          {enabled ? "Ambient on" : "Ambient off"}
        </button>
        <label className="ao-ambient-soundscape">
          <span>Sound</span>
          <select value={soundscape} onChange={(event) => setSoundscape(event.target.value as Soundscape)} aria-label="Ambient soundscape">
            {SOUNDSCAPES.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label className="ao-ambient-volume">
          <span>Volume</span>
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => setVolume(Number(event.target.value))} aria-label="Ambient volume" />
        </label>
      </div>
    </AmbientAudioContext.Provider>
  );
}

export function useAmbientAudio() {
  const context = useContext(AmbientAudioContext);
  if (!context) throw new Error("useAmbientAudio must be used within AmbientAudioProvider");
  return context;
}
