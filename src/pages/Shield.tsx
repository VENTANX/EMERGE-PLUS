import { useEffect, useRef, useState } from 'react';
import { Activity, Wifi, ShieldCheck, AlertTriangle, Sliders } from 'lucide-react';
import { cn } from '../lib/utils';

export function Shield() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [status, setStatus] = useState<'safe' | 'warning' | 'critical'>('safe');
    const [nodes] = useState(1240);
    const [sensitivity, setSensitivity] = useState(50); // 0-100

    // Simulation Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const render = () => {
            time += 0.05;

            // Dynamic Resizing
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            const width = canvas.width;
            const height = canvas.height;

            ctx.clearRect(0, 0, width, height);

            // Draw Grid
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            const gridSize = 40;

            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Draw Wave
            ctx.beginPath();
            ctx.lineWidth = 3;

            // Dynamic Color based on status
            const color = status === 'safe' ? '#34C759' /* green */ : status === 'warning' ? '#F59E0B' /* amber */ : '#FF3B30' /* red */;
            ctx.strokeStyle = color;

            // Gradient Fill
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, `${color}00`);
            gradient.addColorStop(0.5, `${color}40`);
            gradient.addColorStop(1, `${color}00`);
            ctx.fillStyle = gradient;

            // Wave Logic - modulated by sensitivity
            // Higher sensitivity = larger baseline noise even when safe
            const sensitivityFactor = sensitivity / 50;

            const baseAmp = status === 'safe' ? 20 : status === 'warning' ? 60 : 150;
            const amplitude = baseAmp * sensitivityFactor;

            const frequency = (status === 'safe' ? 0.02 : 0.05) * sensitivityFactor;
            const speed = status === 'safe' ? 1 : 3;

            ctx.moveTo(0, height / 2);

            for (let x = 0; x < width; x++) {
                // Multi-sine wave for realism
                const y = height / 2 +
                    Math.sin(x * frequency + time * speed) * amplitude * 0.5 +
                    Math.sin(x * 0.01 - time * 2) * amplitude * 0.3 +
                    (Math.random() - 0.5) * (status === 'safe' ? 2 : 10) * sensitivityFactor; // Noise

                ctx.lineTo(x, y);
            }

            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [status, sensitivity]);

    const triggerSimulation = () => {
        setStatus('warning');
        setTimeout(() => setStatus('critical'), 2000);
        setTimeout(() => setStatus('safe'), 6000);
    };

    return (
        <div className="relative h-[calc(100vh-140px)] flex flex-col gap-4">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-amber-500">Seismic Shield</h2>
                    <p className="text-gray-400 text-xs font-mono">GLOBAL SENSOR MESH</p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Sensitivity Slider */}
                    <div className="flex items-center gap-2 bg-neutral-900 px-4 py-2 rounded-full border border-white/10">
                        <Sliders size={14} className="text-gray-400" />
                        <span className="text-xs font-mono text-gray-400">GAIN</span>
                        <input
                            type="range"
                            min="10"
                            max="200"
                            value={sensitivity}
                            onChange={(e) => setSensitivity(Number(e.target.value))}
                            className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerge-green [&::-webkit-slider-thumb]:rounded-full"
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                        <Wifi size={14} className="text-amber-500 animate-pulse" />
                        <span className="text-xs font-mono tabular-nums">{nodes.toLocaleString()} NODES</span>
                    </div>
                </div>
            </header>

            {/* Main Graph Panel */}
            <div className="flex-1 relative rounded-3xl overflow-hidden glass-panel border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

                {/* Live Value Overlay */}
                <div className="absolute top-6 left-6 flex flex-col">
                    <span className="text-xs font-mono text-gray-500">PEAK ACCELERATION</span>
                    <span className={cn(
                        "text-4xl font-black tabular-nums transition-colors duration-300",
                        status === 'safe' ? "text-emerge-green" : status === 'warning' ? "text-amber-500" : "text-emerge-red"
                    )}>
                        {status === 'safe' ? (0.04 * (sensitivity / 50)).toFixed(2) + 'g' : status === 'warning' ? '0.32g' : '1.24g'}
                    </span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
                    <div className={cn(
                        "px-4 py-2 rounded-xl border flex items-center gap-2 font-bold uppercase text-sm shadow-xl backdrop-blur-md transition-colors",
                        status === 'safe' ? "bg-emerge-green/10 border-emerge-green/30 text-emerge-green" :
                            status === 'warning' ? "bg-amber-500/10 border-amber-500/30 text-amber-500" :
                                "bg-emerge-red/10 border-emerge-red/30 text-emerge-red animate-pulse"
                    )}>
                        {status === 'safe' ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
                        {status === 'safe' ? 'Stable' : status === 'warning' ? 'Tremor Warning' : 'EARTHQUAKE DETECTED'}
                    </div>

                    {/* Manual Trigger for Demo */}
                    {status === 'safe' && (
                        <button
                            onClick={triggerSimulation}
                            className="text-xs bg-white/5 hover:bg-white/10 text-white px-3 py-1 rounded-lg border border-white/5 transition-colors"
                        >
                            Simulate Tremor
                        </button>
                    )}
                </div>
            </div>

            {/* Alert Component (Only shows in warning/critical) */}
            <div className={cn(
                "bg-neutral-900 border transition-all duration-500 overflow-hidden rounded-2xl",
                status === 'safe' ? "h-0 border-transparent opacity-0" : "h-auto p-4 border-amber-500/30 opacity-100"
            )}>
                <div className="flex gap-4 items-center">
                    <div className="bg-amber-500/20 p-3 rounded-full text-amber-500 shrink-0">
                        <Activity size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-amber-500">P-Wave Signature Detected</h4>
                        <p className="text-sm text-gray-400">Time to S-Wave impact: <span className="text-white font-mono font-bold">14s</span></p>
                    </div>
                    <button className="ml-auto bg-amber-500 text-black font-bold px-4 py-2 rounded-lg text-sm">
                        View Safe Zones
                    </button>
                </div>
            </div>
        </div>
    );
}
