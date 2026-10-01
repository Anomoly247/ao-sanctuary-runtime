import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

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
  context: AudioContext;
  master: GainNode;
  nodes: AudioNode[];
  timers: number[];
};

const AmbientAudioContext = createContext<AmbientAudioContextValue | null>(null);
const ENABLED_KEY = "ao_ambient_enabled";
const VOLUME_KEY = "ao_ambient_volume";
const SOUNDSCAPE_KEY = "ao_ambient_soundscape";

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
  const audioRef = useRef<AudioState | null>(null);

  const updateMaster = useCallback((nextVolume: number, nextEnabled: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;
    const target = nextEnabled ? nextVolume * 0.28 : 0;
    audio.master.gain.cancelScheduledValues(audio.context.currentTime);
    audio.master.gain.setTargetAtTime(target, audio.context.currentTime, 0.3);
  }, []);

  const stopAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.timers.forEach((timer) => window.clearInterval(timer));
    audio.nodes.forEach((node) => {
      try {
        (node as OscillatorNode | AudioBufferSourceNode).stop?.();
      } catch {
        // The node may already be stopped during a route refresh or hot reload.
      }
      node.disconnect();
    });
    audio.master.disconnect();
    void audio.context.close();
    audioRef.current = null;
    setIsActive(false);
  }, []);

  const startAudio = useCallback((selectedSoundscape: Soundscape, nextEnabled = enabled, nextVolume = volume) => {
    if (audioRef.current || typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) {
      setAudioError("This browser does not support ambient sound.");
      return;
    }

    const context = new AudioContextClass();
    void context.resume().catch(() => setAudioError("Tap Ambient on to allow Sanctuary sound."));
    const master = context.createGain();
    master.gain.value = nextEnabled ? nextVolume * 0.28 : 0;
    master.connect(context.destination);
    const nodes: AudioNode[] = [];
    const timers: number[] = [];

    const low = context.createOscillator();
    low.type = selectedSoundscape === "soft-lantern" ? "triangle" : "sine";
    low.frequency.value = selectedSoundscape === "still-water" ? 82.41 : selectedSoundscape === "night-garden" ? 98 : 110;
    const lowGain = context.createGain();
    lowGain.gain.value = 0.22;
    low.connect(lowGain).connect(master);
    nodes.push(low, lowGain);

    const breath = context.createOscillator();
    breath.type = "sine";
    breath.frequency.value = 0.055;
    const breathGain = context.createGain();
    breathGain.gain.value = selectedSoundscape === "still-water" ? 12 : 8;
    breath.connect(breathGain).connect(low.frequency);
    nodes.push(breath, breathGain);

    const high = context.createOscillator();
    high.type = "sine";
    high.frequency.value = selectedSoundscape === "soft-lantern" ? 164.81 : 146.83;
    const highGain = context.createGain();
    highGain.gain.value = 0.045;
    high.connect(highGain).connect(master);
    nodes.push(high, highGain);

    const noise = context.createBufferSource();
    noise.buffer = makeNoiseBuffer(context, 3, selectedSoundscape === "still-water" ? 0.09 : 0.045);
    noise.loop = true;
    const noiseFilter = context.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.value = selectedSoundscape === "still-water" ? 280 : 520;
    const noiseGain = context.createGain();
    noiseGain.gain.value = selectedSoundscape === "still-water" ? 0.045 : 0.022;
    noise.connect(noiseFilter).connect(noiseGain).connect(master);
    nodes.push(noise, noiseFilter, noiseGain);

    const noteSets: Record<Soundscape, number[]> = {
      "still-water": [261.63, 329.63, 392, 523.25],
      "night-garden": [220, 261.63, 329.63, 392, 493.88],
      "soft-lantern": [196, 246.94, 293.66, 369.99, 440],
    };
    const notes = noteSets[selectedSoundscape];
    let noteIndex = 0;
    const playInstrumentNote = () => {
      const now = context.currentTime;
      const oscillator = context.createOscillator();
      oscillator.type = selectedSoundscape === "soft-lantern" ? "sine" : "triangle";
      oscillator.frequency.value = notes[noteIndex % notes.length] * (noteIndex % 5 === 4 ? 2 : 1);
      const noteGain = context.createGain();
      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.exponentialRampToValueAtTime(selectedSoundscape === "still-water" ? 0.035 : 0.052, now + 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + (selectedSoundscape === "soft-lantern" ? 3.4 : 2.6));
      oscillator.connect(noteGain).connect(master);
      oscillator.start(now);
      oscillator.stop(now + 3.6);
      nodes.push(oscillator, noteGain);
      noteIndex += selectedSoundscape === "night-garden" ? 2 : 1;
    };

    low.start();
    high.start();
    breath.start();
    noise.start();
    nodes.push(low, high, breath, noise);
    playInstrumentNote();
    timers.push(window.setInterval(playInstrumentNote, selectedSoundscape === "still-water" ? 8600 : selectedSoundscape === "soft-lantern" ? 5200 : 6800));

    audioRef.current = { context, master, nodes, timers };
    setAudioError(null);
    setIsActive(true);
  }, [enabled, volume]);

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
    if (!audioRef.current) {
      activate();
      return;
    }
    setEnabled((current) => {
      const next = !current;
      window.localStorage.setItem(ENABLED_KEY, String(next));
      updateMaster(volume, next);
      return next;
    });
  }, [activate, updateMaster, volume]);

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

  useEffect(() => {
    const onFirstInteraction = () => {
      if (enabled && volume > 0) activate();
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
    window.addEventListener("pointerdown", onFirstInteraction, { once: true, passive: true });
    window.addEventListener("keydown", onFirstInteraction, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
  }, [activate, enabled, volume]);

  useEffect(() => stopAudio, [stopAudio]);

  const value = useMemo(() => ({ enabled, isActive, volume, soundscape, activate, toggleEnabled, setVolume, setSoundscape }), [activate, enabled, isActive, setSoundscape, setVolume, soundscape, toggleEnabled, volume]);

  return (
    <AmbientAudioContext.Provider value={value}>
      {children}
      <div className="ao-ambient-control" aria-label="Ambient Sanctuary sound controls">
        {!isActive && <span className="ao-ambient-hint" role="status">{audioError ?? (volume === 0 ? "Raise volume to hear Sanctuary" : "Click anywhere to hear Sanctuary")}</span>}
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
