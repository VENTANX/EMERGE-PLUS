import { Scan, X } from 'lucide-react';
import { motion } from 'framer-motion';

export function CameraView({ onClose }: { onClose: () => void }) {
    return (
        <div className="relative w-full h-80 bg-neutral-900 rounded-2xl overflow-hidden border border-white/10 shadow-inner group">
            {/* Fake Camera Feed */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542736667-069246bdbc6d?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-40 grayscale group-hover:opacity-60 transition-opacity" />

            {/* Scanning Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />

            {/* Scanner Bar Animation */}
            <motion.div
                className="absolute top-0 left-0 right-0 h-1 bg-emerge-green/50 shadow-[0_0_20px_rgba(52,199,89,0.8)] z-10"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />

            {/* HUD Elements */}
            <div className="absolute inset-4 pointer-events-none flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <span className="bg-black/50 backdrop-blur-md px-2 py-1 text-[10px] font-mono text-emerge-green border border-emerge-green/30 rounded">
                        AI VISION: ACTIVE
                    </span>
                    <button onClick={onClose} className="pointer-events-auto bg-black/50 p-2 rounded-full hover:bg-white/10">
                        <X size={16} />
                    </button>
                </div>

                <div className="flex justify-between items-end">
                    <div className="text-[10px] font-mono text-white/50 space-y-1">
                        <p>ISO: 800</p>
                        <p>EXP: +0.2</p>
                    </div>
                    <Scan size={24} className="text-white/50 animate-pulse" />
                </div>

                {/* Center Reticle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/20 rounded-lg flex items-center justify-center">
                    <div className="w-2 h-0.5 bg-white/50 absolute top-0 left-1/2 -translate-x-1/2" />
                    <div className="w-2 h-0.5 bg-white/50 absolute bottom-0 left-1/2 -translate-x-1/2" />
                    <div className="h-2 w-0.5 bg-white/50 absolute left-0 top-1/2 -translate-y-1/2" />
                    <div className="h-2 w-0.5 bg-white/50 absolute right-0 top-1/2 -translate-y-1/2" />
                </div>
            </div>
        </div>
    );
}
