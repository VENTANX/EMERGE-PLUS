import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Radio, Activity, Volume2, Lock, Play, Pause } from 'lucide-react';
import { TacticalButton } from '../components/ui/TacticalButton';
import { useSound } from '../context/SoundContext';
import { cn } from '../lib/utils';

// Canvas Waveform Visualizer
function Waveform({ isActive }: { isActive: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let time = 0;

        const animate = () => {
            time += 0.05;
            const width = canvas.width;
            const height = canvas.height;

            ctx.clearRect(0, 0, width, height);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#34C759'; // Emerge Green

            ctx.beginPath();
            for (let x = 0; x < width; x++) {
                // Combine sine waves to create "voice-like" pattern
                const y = height / 2 +
                    Math.sin(x * 0.02 + time * 5) * (isActive ? 30 : 2) * Math.sin(time) +
                    Math.cos(x * 0.05 + time) * (isActive ? 10 : 1);

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Reflection (faint)
            ctx.globalAlpha = 0.2;
            ctx.beginPath();
            for (let x = 0; x < width; x++) {
                const y = height / 2 -
                    (Math.sin(x * 0.02 + time * 5) * (isActive ? 30 : 2) * Math.sin(time)) * 0.5;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.globalAlpha = 1.0;

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isActive]);

    return (
        <canvas
            ref={canvasRef}
            width={600}
            height={200}
            className="w-full h-48 bg-black/50 rounded-xl border border-emerge-green/30 shadow-[inset_0_0_20px_rgba(52,199,89,0.1)]"
        />
    );
}

const CHANNELS = [
    { id: 'police', name: 'PD DISPATCH [SECURE]', freq: '460.025', active: true, desc: 'Central Command - Sector 4 Traffic' },
    { id: 'fire', name: 'FD RESCUE 1', freq: '154.325', active: false, desc: 'Structure Fire - 5th Ave' },
    { id: 'noaa', name: 'NOAA WEATHER', freq: '162.550', active: true, desc: 'Severe Storm Warning in effect' },
    { id: 'mil', name: 'NAT. GUARD [ENCRYPTED]', freq: '38.900', active: false, desc: 'Signal Locked' },
];

export function Comms() {
    const [activeChannel, setActiveChannel] = useState(CHANNELS[0].id);
    const [isScanning, setIsScanning] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const { playClick } = useSound();

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isScanning) {
            interval = setInterval(() => {
                const idx = Math.floor(Math.random() * CHANNELS.length);
                setActiveChannel(CHANNELS[idx].id);
                playClick();
            }, 1000); // Fast scan
        }
        return () => clearInterval(interval);
    }, [isScanning]);

    const currentChannel = CHANNELS.find(c => c.id === activeChannel);

    return (
        <div className="space-y-6 pb-12 h-full flex flex-col">
            <header>
                <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Radio className="text-emerge-green" /> COMMS LINK
                </h2>
                <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerge-green animate-pulse" />
                    SIGNAL STRENGTH: 94% • ENCRYPTION: AES-256
                </div>
            </header>

            {/* Main Visualizer */}
            <section className="relative group">
                <Waveform isActive={isPlaying && !isScanning} />

                {/* Overlay Info */}
                <div className="absolute top-4 left-4 font-mono text-xs text-emerge-green/80">
                    <div>FREQ: {isScanning ? 'SCANNING...' : currentChannel?.freq} MHz</div>
                    <div>MOD: FM-N</div>
                </div>

                <div className="absolute bottom-4 right-4 flex gap-2">
                    <button
                        onClick={() => { setIsPlaying(!isPlaying); playClick(); }}
                        className="p-2 bg-emerge-green text-black rounded-full hover:bg-white transition-colors"
                    >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                </div>
            </section>

            {/* Controls */}
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-black/50 rounded-lg">
                        <Activity size={24} className={isScanning ? "animate-spin text-emerge-red" : "text-gray-400"} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Scanner Mode</h3>
                        <p className="text-[10px] text-gray-400">Auto-cycle active frequencies</p>
                    </div>
                </div>
                <TacticalButton
                    variant={isScanning ? "danger" : "secondary"}
                    onClick={() => setIsScanning(!isScanning)}
                    className="text-xs"
                >
                    {isScanning ? "STOP SCAN" : "START SCAN"}
                </TacticalButton>
            </div>

            {/* Frequency List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {CHANNELS.map(channel => (
                    <motion.div
                        key={channel.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => {
                            if (!channel.name.includes('ENCRYPTED')) {
                                setActiveChannel(channel.id);
                                setIsScanning(false);
                                playClick();
                            }
                        }}
                        className={cn(
                            "p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group",
                            activeChannel === channel.id && !isScanning
                                ? "bg-emerge-green/10 border-emerge-green"
                                : "bg-black/40 border-white/5 hover:bg-white/5"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            {channel.name.includes('ENCRYPTED') ? <Lock size={16} className="text-gray-500" /> : <Volume2 size={16} className={activeChannel === channel.id ? "text-emerge-green" : "text-gray-500"} />}
                            <div>
                                <h4 className={cn("font-bold text-sm", activeChannel === channel.id ? "text-white" : "text-gray-400")}>{channel.name}</h4>
                                <p className="text-[10px] text-gray-500 font-mono">{channel.desc}</p>
                            </div>
                        </div>
                        <div className="font-mono text-xs text-gray-500 group-hover:text-emerge-green transition-colors">
                            {channel.freq}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
