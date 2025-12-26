import { Outlet, useLocation } from 'react-router-dom';
import { Navbar, SatelliteStatus } from './Navbar';
import { PanicButton } from '../ui/PanicButton';
import { BackgroundCanvas } from './BackgroundCanvas';
import { AnimatePresence, motion } from 'framer-motion';
import { PageTransition } from './PageTransition';
import { usePanic } from '../../context/PanicContext';
import { AlertTriangle, Lock, User, X, Save, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { TacticalButton } from '../ui/TacticalButton';
import { cn } from '../../lib/utils';

export function RootLayout() {
    const location = useLocation();
    const { isPanicMode, deactivatePanicMode } = usePanic();

    // Global Settings State
    const { userName, setUserName, userLocation, setUserLocation, achievements } = useUser();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [tempName, setTempName] = useState(userName);
    const [tempLocation, setTempLocation] = useState(userLocation);

    useEffect(() => {
        const openSettings = () => {
            setTempName(userName);
            setTempLocation(userLocation);
            setIsSettingsOpen(true);
        };
        window.addEventListener('open-settings', openSettings);
        return () => window.removeEventListener('open-settings', openSettings);
    }, [userName, userLocation]);

    const handleSave = () => {
        setUserName(tempName);
        setUserLocation(tempLocation);
        setIsSettingsOpen(false);
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-[#050505] to-black pb-20 pt-12 relative overflow-hidden font-sans text-white selection:bg-emerge-green/30">
            <BackgroundCanvas />
            <SatelliteStatus />

            {/* Main Content */}
            <main className="px-4 relative z-10 container mx-auto max-w-5xl h-[calc(100vh-140px)]">
                <AnimatePresence mode="wait">
                    <PageTransition key={location.pathname}>
                        <Outlet />
                    </PageTransition>
                </AnimatePresence>
            </main>

            <PanicButton />
            <Navbar />

            {/* Global Settings Modal */}
            <AnimatePresence>
                {isSettingsOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSettingsOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-neutral-900 border border-white/10 w-full max-w-sm rounded-2xl p-6 relative z-10 shadow-2xl space-y-6"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-lg flex items-center gap-2"><User size={18} className="text-emerge-green" /> Identity Configuration</h3>
                                <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-gray-400 uppercase">Callsign</label>
                                    <input
                                        type="text"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerge-green font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-gray-400 uppercase">Sector / Location</label>
                                    <input
                                        type="text"
                                        value={tempLocation}
                                        onChange={(e) => setTempLocation(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerge-green font-mono"
                                    />
                                </div>
                            </div>

                            {/* Service Record / Achievements */}
                            <div className="space-y-3 pt-4 border-t border-white/10">
                                <h4 className="text-xs font-mono text-gray-400 uppercase">Service Record</h4>
                                <div className="grid grid-cols-4 gap-2">
                                    {['apprentice', 'master_survivor', 'medic', 'scout'].map((badge) => {
                                        const isUnlocked = achievements.includes(badge);
                                        return (
                                            <div key={badge} className={cn(
                                                "aspect-square rounded-lg flex items-center justify-center border transition-colors relative group",
                                                isUnlocked ? "bg-emerge-green/20 border-emerge-green" : "bg-black/40 border-white/5"
                                            )}>
                                                {badge === 'master_survivor' && <Shield size={16} className={isUnlocked ? "text-emerge-green" : "text-gray-700"} />}
                                                {badge === 'apprentice' && <User size={16} className={isUnlocked ? "text-emerge-green" : "text-gray-700"} />}
                                                {badge === 'medic' && <AlertTriangle size={16} className={isUnlocked ? "text-emerge-green" : "text-gray-700"} />}
                                                {badge === 'scout' && <Lock size={16} className={isUnlocked ? "text-emerge-green" : "text-gray-700"} />}

                                                {/* Tooltip */}
                                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black px-2 py-1 text-[10px] whitespace-nowrap border border-white/10 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                                                    {badge.replace('_', ' ').toUpperCase()}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <TacticalButton glow className="w-full justify-center" onClick={handleSave}>
                                <Save size={16} /> Save Changes
                            </TacticalButton>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Global Panic Overlay */}
            <AnimatePresence>
                {isPanicMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-red-950/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-6"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)] opacity-50" />
                        <div className="absolute inset-0 animate-pulse bg-red-500/10 pointer-events-none" />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative z-10 space-y-8 max-w-md"
                        >
                            <div className="mx-auto w-24 h-24 bg-red-600 rounded-full flex items-center justify-center animate-bounce shadow-[0_0_50px_rgba(220,38,38,0.5)]">
                                <AlertTriangle size={48} className="text-white" />
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Emergency Protocol</h1>
                                <p className="text-red-200 font-mono text-sm">ALL SYSTEMS LOCKED • AWAITING RESCUE</p>
                            </div>

                            <div className="bg-black/40 border border-red-500/30 p-6 rounded-2xl backdrop-blur-xl">
                                <div className="flex items-center gap-3 text-left mb-4">
                                    <Lock size={20} className="text-red-500" />
                                    <div>
                                        <h3 className="font-bold text-sm">Terminal Locked</h3>
                                        <p className="text-[10px] text-gray-400">Location beacon broadcasting on emergency frequency.</p>
                                    </div>
                                </div>
                                <div className="h-1 w-full bg-red-900/50 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-red-500"
                                        animate={{ width: ["0%", "100%"] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={deactivatePanicMode}
                                className="w-full bg-white text-red-600 font-black py-4 rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all text-lg tracking-wide uppercase"
                            >
                                I Am Safe (Override)
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
