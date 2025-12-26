import { useState } from 'react';
import { CameraView } from '../components/triage/CameraView';
import { ChatInterface } from '../components/triage/ChatInterface';
import { Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Triage() {
    const [showCamera, setShowCamera] = useState(false);

    return (
        <div className="space-y-4 w-full max-w-4xl mx-auto pb-6 h-full flex flex-col">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">AI Doctor</h2>
                    <p className="text-gray-400 text-xs font-mono">V2.4 • OFFLINE READY</p>
                </div>
                <button
                    onClick={() => setShowCamera(!showCamera)}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border border-white/10"
                >
                    <Camera size={16} className="text-emerge-green" />
                    {showCamera ? 'Hide Vision' : 'Open Vision'}
                </button>
            </header>

            <AnimatePresence>
                {showCamera && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <CameraView onClose={() => setShowCamera(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            <ChatInterface />
        </div>
    );
}
