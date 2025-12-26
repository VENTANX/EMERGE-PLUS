import { useEffect, useState } from 'react';
import { usePanic } from '../../context/PanicContext';
import { ShieldAlert, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function PanicButton() {
    const { isPanicMode, activatePanicMode, deactivatePanicMode } = usePanic();
    const [pressCount, setPressCount] = useState(0);

    // 5 rapid taps logic
    useEffect(() => {
        if (pressCount === 0) return;

        const timer = setTimeout(() => setPressCount(0), 1000);

        if (pressCount >= 5) {
            activatePanicMode();
            setPressCount(0);
        }

        return () => clearTimeout(timer);
    }, [pressCount, activatePanicMode]);

    return (
        <>
            {/* Floating Action Button (Always Visible) */}
            <button
                onClick={() => setPressCount(p => p + 1)}
                className={cn(
                    "fixed bottom-24 right-4 z-50 rounded-full p-4 shadow-2xl transition-all duration-300",
                    isPanicMode ? "bg-white text-emerge-red scale-0" : "bg-emerge-red text-white hover:scale-105 active:scale-95"
                )}
                aria-label="Emergency Panic Button"
            >
                <ShieldAlert size={32} />
            </button>

            {/* Full Screen Panic Overlay */}
            <AnimatePresence>
                {isPanicMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-emerge-red panic-active text-white p-6 text-center"
                    >
                        <h1 className="text-6xl font-black mb-8 animate-pulse">PANIC ACTIVE</h1>

                        <div className="grid gap-4 w-full max-w-md">
                            <button className="bg-white text-emerge-red text-2xl font-bold py-6 rounded-xl shadow-lg hover:bg-gray-100">
                                CALL 911
                            </button>
                            <button className="bg-black/20 text-white text-xl font-bold py-4 rounded-xl border-2 border-white/50">
                                SILENT ALARM
                            </button>
                            <button className="bg-black/20 text-white text-xl font-bold py-4 rounded-xl border-2 border-white/50">
                                SHARE LOCATION
                            </button>
                        </div>

                        <button
                            onClick={deactivatePanicMode}
                            className="mt-12 flex items-center gap-2 text-white/80 hover:text-white"
                        >
                            <X size={24} />
                            Deactivate (Hold 3s)
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
