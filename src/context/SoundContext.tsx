import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface SoundContextType {
    playClick: () => void;
    playHover: () => void;
    playAlert: () => void;
    playBoot: () => void;
    isMuted: boolean;
    toggleMute: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function useSound() {
    const context = useContext(SoundContext);
    if (context === undefined) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
}

// Procedural Audio Generation using Web Audio API
// No external assets required.
class SoundEngine {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;

    constructor() {
        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            this.ctx = new AudioContextClass();
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
            this.masterGain.gain.value = 0.3; // Default volume
        } catch (e) {
            console.error('Web Audio API not supported', e);
        }
    }

    private createOscillator(type: OscillatorType, freq: number, duration: number, startTime: number) {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    click() {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        // High pitch chirp
        this.createOscillator('sine', 2000, 0.05, t);
        // Underlying click
        this.createOscillator('square', 100, 0.03, t);
    }

    hover() {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        // Very subtle high tick
        this.createOscillator('sine', 4000, 0.01, t);
    }

    alert() {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        // Dual tone dissonance
        this.createOscillator('sawtooth', 440, 0.3, t);
        this.createOscillator('sawtooth', 450, 0.3, t); // Beat frequency
    }

    boot() {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        // Rising power-up sound
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.frequency.setValueAtTime(100, t);
        osc.frequency.exponentialRampToValueAtTime(1000, t + 1.5);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.linearRampToValueAtTime(0, t + 2);

        osc.connect(gain);
        gain?.connect(this.masterGain!);
        osc.start(t);
        osc.stop(t + 2);
    }

    resume() {
        if (this.ctx?.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setVolume(val: number) {
        if (this.masterGain) this.masterGain.gain.value = val;
    }
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
    const engine = useRef<SoundEngine | null>(null);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        engine.current = new SoundEngine();

        // Resume audio context on first interaction
        const handleInteraction = () => {
            engine.current?.resume();
            window.removeEventListener('click', handleInteraction);
        };
        window.addEventListener('click', handleInteraction);

        return () => window.removeEventListener('click', handleInteraction);
    }, []);

    const toggleMute = () => {
        setIsMuted(prev => {
            const next = !prev;
            engine.current?.setVolume(next ? 0 : 0.3);
            return next;
        });
    };

    const playClick = () => !isMuted && engine.current?.click();
    const playHover = () => !isMuted && engine.current?.hover();
    const playAlert = () => !isMuted && engine.current?.alert();
    const playBoot = () => !isMuted && engine.current?.boot();

    return (
        <SoundContext.Provider value={{ playClick, playHover, playAlert, playBoot, isMuted, toggleMute }}>
            {children}
        </SoundContext.Provider>
    );
}
