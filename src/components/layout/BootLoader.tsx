import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Radio, Cpu, Wifi } from 'lucide-react';
import { useSound } from '../../context/SoundContext';

interface BootLoaderProps {
    children: React.ReactNode;
}

export function BootLoader({ children }: BootLoaderProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState(0);
    const { playClick, playBoot } = useSound();

    // Boot sequence steps
    const steps = [
        { text: "INITIALIZING KERNEL...", delay: 500, icon: Cpu },
        { text: "CHECKING INTEGRITY...", delay: 800, icon: Shield },
        { text: "ESTABLISHING SAT-LINK...", delay: 1500, icon: Wifi },
        { text: "HANDSHAKE COMPLETE. WELCOME.", delay: 800, icon: Radio },
    ];

    useEffect(() => {
        // Play boot sound on mount
        const timer = setTimeout(() => playBoot(), 300);

        let currentDelay = 0;
        steps.forEach((_, index) => {
            currentDelay += steps[index].delay;
            setTimeout(() => {
                setStep(index + 1);
                playClick();
            }, currentDelay);
        });

        // Finish loading
        setTimeout(() => {
            setIsLoading(false);
        }, currentDelay + 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono text-emerge-green"
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="w-64 space-y-4">
                            {/* Logo Glitch Effect */}
                            <motion.div
                                className="text-4xl font-black text-center mb-8 text-white tracking-tighter"
                                animate={{ opacity: [0.8, 1, 0.8] }}
                                transition={{ repeat: Infinity, duration: 0.1 }}
                            >
                                EMERGE<span className="text-emerge-red">+</span>
                            </motion.div>

                            {/* Terminal Output */}
                            <div className="space-y-2 text-xs h-32 border-l-2 border-emerge-green/30 pl-4">
                                {steps.map((s, i) => (
                                    i < step && (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            {s.icon && <s.icon size={12} />}
                                            <span>{s.text}</span>
                                            {i === step - 1 && <span className="animate-pulse">_</span>}
                                        </motion.div>
                                    )
                                ))}
                            </div>

                            {/* Progress Bar */}
                            <div className="h-1 bg-white/10 w-full overflow-hidden rounded-full">
                                <motion.div
                                    className="h-full bg-emerge-green"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 4, ease: "linear" }}
                                />
                            </div>

                            <div className="flex justify-between text-[10px] text-gray-500 uppercase">
                                <span>Bios v4.0.1</span>
                                <span>Secure Boot: Enabled</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main App Content - Only show when not loading to prevent flash? 
                Actually nice to mount it behind so it's ready. 
                But let's hide it visually or pointer-events-none until loaded.
            */}
            <div className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-1000"}>
                {children}
            </div>
        </>
    );
}
