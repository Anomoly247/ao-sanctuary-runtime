import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

type Soundscape = "still-water" | "night-garden" | "soft-lantern";
export type EqualizerTheme = "aurora" | "golden-hour" | "cyan-pulse" | "quiet-line";

type AmbientAudioContextValue = {
  enabled: boolean;
  isActive: boolean;
  volume: number;
  soundscape: Soundscape;
  equalizerTheme: EqualizerTheme;
  activate: () => void;
  activateFallback: () => void;
  toggleEnabled: () => void;
  setVolume: (value: number) => void;
  setSoundscape: (value: Soundscape) => void;
  setEqualizerTheme: (value: EqualizerTheme) => void;
};

type AudioState = {
  element?: HTMLAudioElement;
  context?: AudioContext;
  nodes?: OscillatorNode[];
  fallbackGain?: GainNode;
  timers: number[];
  animationFrame: number;
};

const AmbientAudioContext = createContext<AmbientAudioContextValue | null>(null);
const ENABLED_KEY = "ao_ambient_enabled";
const VOLUME_KEY = "ao_ambient_volume";
const SOUNDSCAPE_KEY = "ao_ambient_soundscape";
const EQUALIZER_THEME_KEY = "ao_equalizer_theme";
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

export const EQUALIZER_THEMES: Array<{ value: EqualizerTheme; label: string; detail: string }> = [
  { value: "aurora", label: "Aurora", detail: "cyan + gold constellation" },
  { value: "golden-hour", label: "Golden Hour", detail: "warm reward signal" },
  { value: "cyan-pulse", label: "Cyan Pulse", detail: "cool live signal" },
  { value: "quiet-line", label: "Quiet Line", detail: "low-contrast focus mode" },
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

function readEqualizerTheme(): EqualizerTheme {
  if (typeof window === "undefined") return "aurora";
  const stored = window.localStorage.getItem(EQUALIZER_THEME_KEY);
  return stored === "golden-hour" || stored === "cyan-pulse" || stored === "quiet-line" ? stored : "aurora";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [equalizerTheme, setEqualizerThemeState] = useState<EqualizerTheme>(readEqualizerTheme);
  const [isActive, setIsActive] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [equalizerBars, setEqualizerBars] = useState<number[]>(() => Array.from({ length: 12 }, () => 0.16));
  const audioRef = useRef<AudioState | null>(null);

  const updateMaster = useCallback((nextVolume: number, nextEnabled: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.element) audio.element.volume = nextEnabled ? nextVolume : 0;
    if (audio.fallbackGain) audio.fallbackGain.gain.value = nextEnabled ? nextVolume * 0.18 : 0;
  }, []);

  const stopAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.timers.forEach((timer) => window.clearInterval(timer));
    window.cancelAnimationFrame(audio.animationFrame);
    audio.element?.pause();
    audio.element?.removeAttribute("src");
    audio.element?.load();
    audio.element?.remove();
    audio.nodes?.forEach((node) => {
      try { node.stop(); } catch { /* already stopped */ }
      node.disconnect();
    });
    void audio.context?.close();
    audioRef.current = null;
    setIsActive(false);
    setEqualizerBars(Array.from({ length: 12 }, () => 0.16));
  }, []);

  const startBrowserFallback = useCallback((nextVolume = volume) => {
    if (audioRef.current || typeof window === "undefined" || !window.AudioContext) return;
    const context = new window.AudioContext();
    const fallbackGain = context.createGain();
    fallbackGain.gain.value = nextVolume * 0.18;
    fallbackGain.connect(context.destination);
    const frequencies = [174.61, 261.63, 349.23];
    const nodes = frequencies.map((frequency, index) => {
      const node = context.createOscillator();
      node.type = index === 1 ? "triangle" : "sine";
      node.frequency.value = frequency;
      node.detune.value = index === 2 ? 4 : 0;
      node.connect(fallbackGain);
      node.start();
      return node;
    });
    let lastPaint = 0;
    const sampleFallback = (timestamp: number) => {
      if (!audioRef.current) return;
      if (timestamp - lastPaint >= 33) {
        lastPaint = timestamp;
        setEqualizerBars(Array.from({ length: 12 }, (_, index) => Math.max(0.18, 0.42 + Math.sin(timestamp / 360 + index * 0.68) * 0.2)));
      }
      audioRef.current.animationFrame = window.requestAnimationFrame(sampleFallback);
    };
    audioRef.current = { context, nodes, fallbackGain, timers: [], animationFrame: window.requestAnimationFrame(sampleFallback) };
    setAudioError("Using the browser fallback tone. You can keep exploring while the soundtrack reconnects.");
    setIsActive(true);
    void context.resume();
  }, [volume]);

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
      setAudioError("The external soundtrack could not load. Use the browser fallback tone.");
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
        setAudioError(message === "Tap Ambient on to allow Sanctuary sound."
          ? message
          : "The external soundtrack could not load. Use the browser fallback tone.");
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

  const activateFallback = useCallback(() => {
    const nextVolume = volume > 0 ? volume : 0.22;
    if (volume === 0) {
      setVolumeState(nextVolume);
      window.localStorage.setItem(VOLUME_KEY, String(nextVolume));
    }
    setEnabled(true);
    window.localStorage.setItem(ENABLED_KEY, "true");
    startBrowserFallback(nextVolume);
  }, [startBrowserFallback, volume]);

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

  const setEqualizerTheme = useCallback((next: EqualizerTheme) => {
    setEqualizerThemeState(next);
    window.localStorage.setItem(EQUALIZER_THEME_KEY, next);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(ENABLED_KEY, String(enabled));
  }, [enabled]);

  useEffect(() => {
    window.localStorage.setItem(VOLUME_KEY, String(volume));
  }, [volume]);

  useEffect(() => stopAudio, [stopAudio]);

  const value = useMemo(() => ({ enabled, isActive, volume, soundscape, equalizerTheme, activate, activateFallback, toggleEnabled, setVolume, setSoundscape, setEqualizerTheme }), [activate, activateFallback, enabled, equalizerTheme, isActive, setEqualizerTheme, setSoundscape, setVolume, soundscape, toggleEnabled, volume]);

  return (
    <AmbientAudioContext.Provider value={value}>
      {children}
      <div className={`ao-ambient-control ${isExpanded ? "is-expanded" : "is-collapsed"}`} aria-label="Ambient Sanctuary sound controls">
        <div className="ao-ambient-header">
          <span className="ao-ambient-title">AO SOUNDTRACK</span>
          <div className="ao-audio-equalizer" role="img" aria-label={`${EQUALIZER_THEMES.find((theme) => theme.value === equalizerTheme)?.label} equalizer, ${isActive ? "responding to playback" : "idle"}`} data-active={isActive} data-theme={equalizerTheme}>
            {equalizerBars.map((height, index) => <span key={index} style={{ "--ao-eq-height": `${height * 100}%` } as CSSProperties} aria-hidden="true" />)}
          </div>
          <button type="button" className="ao-ambient-disclosure" onClick={() => setIsExpanded((current) => !current)} aria-expanded={isExpanded} aria-controls="ao-ambient-settings">
            {isExpanded ? "Minimize" : "Ambient"}
          </button>
        </div>
        {isExpanded && <div id="ao-ambient-settings" className="ao-ambient-settings">
          {!isActive && <span className="ao-ambient-hint" role="status">{audioError ?? (volume === 0 ? "Raise volume to hear Sanctuary" : "Press Ambient on to hear the soundtrack")}</span>}
          {!isActive && audioError && <button type="button" className="ao-ambient-fallback" onClick={activateFallback}>Use browser fallback</button>}
          <button type="button" className="ao-ambient-toggle" onClick={toggleEnabled} aria-pressed={enabled}>
            {enabled ? "Ambient on" : "Ambient off"}
          </button>
          <label className="ao-ambient-soundscape">
            <span>Sound</span>
            <select value={soundscape} onChange={(event) => setSoundscape(event.target.value as Soundscape)} aria-label="Ambient soundscape">
              {SOUNDSCAPES.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="ao-ambient-theme">
            <span>Visual</span>
            <select value={equalizerTheme} onChange={(event) => setEqualizerTheme(event.target.value as EqualizerTheme)} aria-label="Equalizer visual theme">
              {EQUALIZER_THEMES.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="ao-ambient-volume">
            <span>Volume</span>
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => setVolume(Number(event.target.value))} aria-label="Ambient volume" />
          </label>
        </div>}

      </div>
    </AmbientAudioContext.Provider>
  );
}

export function useAmbientAudio() {
  const context = useContext(AmbientAudioContext);
  if (!context) throw new Error("useAmbientAudio must be used within AmbientAudioProvider");
  return context;
}
