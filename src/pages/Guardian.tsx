import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Flame, Droplets, Tent, Compass, X, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { useUser } from '../context/UserContext';
import shelterImg from '../assets/shelter_building.png';

const MODULES = [
    {
        id: 'fire',
        title: 'Fire Starting',
        icon: Flame,
        level: 'Essential',
        image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2068&auto=format&fit=crop',
        content: 'Focus on the "Teepee" structure. Use tinder (dry grass/cotton) in the center. Build a cone of kindling (small twigs) around it.'
    },
    {
        id: 'water',
        title: 'Water Purification',
        icon: Droplets,
        level: 'Critical',
        image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1974&auto=format&fit=crop',
        content: 'Boiling is safer than filtering. Bring water to a rolling boil for at least 1 minute (3 minutes at elevations above 6,500ft).'
    },
    {
        id: 'shelter',
        title: 'Shelter Building',
        icon: Tent,
        level: 'Moderate',
        image: shelterImg,
        content: 'The "Lean-To" requires a strong crossbar between two trees. Lean poles against it at a 45-degree angle. Cover with foliage.'
    },
    {
        id: 'nav',
        title: 'Star Navigation',
        icon: Compass,
        level: 'Advanced',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop',
        content: 'Locate the Big Dipper. Follow the two outer stars of the bowl to find Polaris (The North Star).'
    }
];

export function Guardian() {
    const { updateGuardianProgress } = useUser();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
        // Load from local storage
        try {
            const saved = localStorage.getItem('guardian_progress');
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    const toggleCheck = (id: string, stepIndex: number) => {
        const key = `${id}_step_${stepIndex}`;
        setCheckedItems(prev => {
            const next = { ...prev, [key]: !prev[key] };
            localStorage.setItem('guardian_progress', JSON.stringify(next));
            return next;
        });
    };

    // Calculate progress for a module
    const getProgress = (moduleId: string) => {
        const total = 3; // Assuming 3 steps per module for now
        let completed = 0;
        for (let i = 1; i <= 3; i++) {
            if (checkedItems[`${moduleId}_step_${i}`]) completed++;
        }
        return (completed / total) * 100;
    };

    // Calculate and sync global progress
    useEffect(() => {
        let totalProgressSum = 0;
        MODULES.forEach(m => {
            totalProgressSum += getProgress(m.id);
        });
        const globalAverage = Math.round(totalProgressSum / MODULES.length);
        updateGuardianProgress(globalAverage);
    }, [checkedItems]);

    return (
        <div className="space-y-6 pb-12">
            <header>
                <h2 className="text-2xl font-bold tracking-tight">Guardian</h2>
                <p className="text-gray-400 text-xs font-mono">SURVIVAL LIBRARY • COMPRESSED</p>
            </header>

            {/* Horizontal Carousel */}
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar -mx-4 px-4 mask-gradient-right">
                {MODULES.map((module) => {
                    const progress = getProgress(module.id);
                    return (
                        <motion.div
                            key={module.id}
                            layoutId={`card-${module.id}`}
                            onClick={() => setSelectedId(module.id)}
                            className="snap-center shrink-0 w-[85vw] sm:w-[400px] h-[60vh] rounded-3xl overflow-hidden relative group cursor-pointer border border-white/10"
                        >
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${module.image})` }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="bg-emerge-green/20 p-2 rounded-full text-emerge-green backdrop-blur-sm">
                                        <module.icon size={20} />
                                    </div>
                                    <span className="text-xs font-mono bg-black/50 px-2 py-1 rounded backdrop-blur-sm uppercase">{module.level}</span>
                                </div>
                                <h3 className="text-3xl font-black uppercase leading-none mb-4">{module.title}</h3>

                                {/* Progress Bar in Card */}
                                <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-emerge-green transition-all duration-500" style={{ width: `${progress}%` }} />
                                </div>

                                <div className="flex items-center text-emerge-green text-sm font-bold gap-1 group-hover:gap-2 transition-all">
                                    {progress === 100 ? 'REVIEW LESSON' : 'CONTINUE LESSON'} <ChevronRight size={16} />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Expanded Modal */}
            <AnimatePresence>
                {selectedId && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none p-0 sm:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedId(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm pointer-events-auto"
                        />

                        <motion.div
                            layoutId={`card-${selectedId}`}
                            className="w-full max-w-lg bg-zinc-900 text-white rounded-t-3xl sm:rounded-3xl overflow-hidden pointer-events-auto border border-white/10 max-h-[90vh] flex flex-col relative z-10"
                        >
                            {/* Content */}
                            {(() => {
                                const module = MODULES.find(m => m.id === selectedId);
                                if (!module) return null;

                                return (
                                    <>
                                        <div className="relative h-64 shrink-0">
                                            <img src={module.image} alt={module.title} className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => setSelectedId(null)}
                                                className="absolute top-4 right-4 bg-black/50 p-2 rounded-full hover:bg-white/20 text-white"
                                            >
                                                <X size={24} />
                                            </button>
                                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-900 to-transparent">
                                                <h3 className="text-3xl font-black uppercase">{module.title}</h3>
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-6 overflow-y-auto">
                                            <div className="p-4 bg-white/5 rounded-xl border-l-4 border-emerge-green">
                                                <h4 className="font-bold text-emerge-green mb-1">CORE INSTRUCTION</h4>
                                                <p className="text-lg leading-relaxed">{module.content}</p>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="font-mono text-xs text-gray-400 uppercase">Interactive Checklist</h4>
                                                    <span className="text-xs text-emerge-green font-bold">{Math.round(getProgress(module.id))}% Complete</span>
                                                </div>

                                                {[1, 2, 3].map((step) => {
                                                    const isChecked = checkedItems[`${module.id}_step_${step}`];
                                                    return (
                                                        <div
                                                            key={step}
                                                            className={cn(
                                                                "flex gap-4 items-start p-3 rounded-xl transition-colors cursor-pointer select-none",
                                                                isChecked ? "bg-emerge-green/10 border border-emerge-green/30" : "bg-white/5 border border-transparent hover:bg-white/10"
                                                            )}
                                                            onClick={() => toggleCheck(module.id, step)}
                                                        >
                                                            <div className={cn(
                                                                "w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0 border transition-all mt-1",
                                                                isChecked ? "bg-emerge-green border-emerge-green text-black" : "border-white/20 text-gray-500"
                                                            )}>
                                                                {isChecked ? <Check size={14} /> : step}
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className={cn("font-medium transition-colors", isChecked ? "text-white" : "text-gray-300")}>
                                                                    Step {step} Protocol
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {step === 1 ? "Prepare necessary tools and clear area." :
                                                                        step === 2 ? "Execute primary action as described." :
                                                                            "Verify results and secure position."}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <div className="p-6 border-t border-white/10 bg-black/50">
                                            <button
                                                onClick={() => setSelectedId(null)}
                                                className="w-full bg-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/20 transition-colors border border-white/10"
                                            >
                                                Close Module
                                            </button>
                                        </div>
                                    </>
                                );
                            })()}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
