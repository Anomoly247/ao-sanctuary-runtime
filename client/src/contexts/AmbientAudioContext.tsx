import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

type AmbientAudioContextValue = {
  enabled: boolean;
  isActive: boolean;
  volume: number;
  activate: () => void;
  toggleEnabled: () => void;
  setVolume: (value: number) => void;
};

const AmbientAudioContext = createContext<AmbientAudioContextValue | null>(null);
const ENABLED_KEY = "ao_ambient_enabled";
const VOLUME_KEY = "ao_ambient_volume";

function readEnabled() {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(ENABLED_KEY) !== "false";
}

function readVolume() {
  if (typeof window === "undefined") return 0.28;
  const stored = Number(window.localStorage.getItem(VOLUME_KEY));
  return Number.isFinite(stored) ? Math.min(1, Math.max(0, stored)) : 0.28;
}

export function AmbientAudioProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(readEnabled);
  const [volume, setVolumeState] = useState(readVolume);
  const [isActive, setIsActive] = useState(false);
  const audioRef = useRef<{
    context: AudioContext;
    master: GainNode;
    nodes: AudioNode[];
  } | null>(null);

  const updateMaster = useCallback((nextVolume: number, nextEnabled: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;
    const target = nextEnabled ? nextVolume * 0.16 : 0;
    audio.master.gain.cancelScheduledValues(audio.context.currentTime);
    audio.master.gain.setTargetAtTime(target, audio.context.currentTime, 0.18);
  }, []);

  const activate = useCallback(() => {
    if (audioRef.current || typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const master = context.createGain();
    master.gain.value = enabled ? volume * 0.16 : 0;
    master.connect(context.destination);

    const low = context.createOscillator();
    low.type = "sine";
    low.frequency.value = 98;
    const lowGain = context.createGain();
    lowGain.gain.value = 0.34;
    low.connect(lowGain).connect(master);

    const high = context.createOscillator();
    high.type = "sine";
    high.frequency.value = 147;
    const highGain = context.createGain();
    highGain.gain.value = 0.12;
    high.connect(highGain).connect(master);

    const lfo = context.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.08;
    const lfoGain = context.createGain();
    lfoGain.gain.value = 22;
    lfo.connect(lfoGain).connect(low.frequency);
    lfo.connect(lfoGain).connect(high.frequency);

    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) {
      data[index] = (Math.random() * 2 - 1) * 0.16;
    }
    const wind = context.createBufferSource();
    wind.buffer = buffer;
    wind.loop = true;
    const windFilter = context.createBiquadFilter();
    windFilter.type = "lowpass";
    windFilter.frequency.value = 420;
    const windGain = context.createGain();
    windGain.gain.value = 0.035;
    wind.connect(windFilter).connect(windGain).connect(master);

    low.start();
    high.start();
    lfo.start();
    wind.start();
    audioRef.current = { context, master, nodes: [low, high, lfo, wind] };
    setIsActive(true);
  }, [enabled, volume]);

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
  }, [enabled, updateMaster]);

  useEffect(() => {
    window.localStorage.setItem(ENABLED_KEY, String(enabled));
  }, [enabled]);

  useEffect(() => {
    window.localStorage.setItem(VOLUME_KEY, String(volume));
  }, [volume]);

  useEffect(() => {
    const onFirstInteraction = () => {
      activate();
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
    window.addEventListener("pointerdown", onFirstInteraction, { once: true, passive: true });
    window.addEventListener("keydown", onFirstInteraction, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
  }, [activate]);

  useEffect(() => () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.nodes.forEach((node) => {
      try {
        (node as OscillatorNode | AudioBufferSourceNode).stop?.();
      } catch {
        // The node may already be stopped during hot reload.
      }
      node.disconnect();
    });
    audio.master.disconnect();
    void audio.context.close();
  }, []);

  const value = useMemo(() => ({ enabled, isActive, volume, activate, toggleEnabled, setVolume }), [activate, enabled, isActive, setVolume, toggleEnabled, volume]);

  return (
    <AmbientAudioContext.Provider value={value}>
      {children}
      <div className="ao-ambient-control" aria-label="Ambient Sanctuary sound controls">
        {!isActive && <span className="ao-ambient-hint">Click anywhere to hear Sanctuary</span>}
        <button type="button" className="ao-ambient-toggle" onClick={toggleEnabled} aria-pressed={enabled}>
          {enabled ? "Ambient on" : "Ambient off"}
        </button>
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
