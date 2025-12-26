import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Bot, User, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { TacticalButton } from '../ui/TacticalButton';

type Sender = 'ai' | 'user';

type Message = {
    id: string;
    sender: Sender;
    text: string;
    isProtocol?: boolean;
};

type TriageNode = {
    id: string;
    text: string;
    options: { label: string; nextId: string; style?: 'primary' | 'danger' | 'secondary' }[];
    protocol?: string[];
};

// Simple Decision Tree
const TRIAGE_TREE: Record<string, TriageNode> = {
    'root': {
        id: 'root',
        text: "I am Emerge AI. What is the primary emergency?",
        options: [
            { label: "Significant Bleeding", nextId: 'bleed_1', style: 'danger' },
            { label: "Breathing Difficulty", nextId: 'breath_1', style: 'danger' },
            { label: "Bone Fracture", nextId: 'bone_1', style: 'secondary' },
            { label: "Burn Injury", nextId: 'burn_1', style: 'secondary' }
        ]
    },
    // Bleeding Branch
    'bleed_1': {
        id: 'bleed_1',
        text: "Is the blood bright red and spurting (pulsing with heartbeat)?",
        options: [
            { label: "Yes, Spurting", nextId: 'bleed_arterial', style: 'danger' },
            { label: "No, Oozing/Flowing", nextId: 'bleed_venous', style: 'secondary' }
        ]
    },
    'bleed_arterial': {
        id: 'bleed_arterial',
        text: "CRITICAL: Arterial Bleeding detected. Initiating Hemorrhage Control.",
        options: [{ label: "Protocol Complete", nextId: 'root', style: 'primary' }],
        protocol: [
            "Apply direct pressure IMMEDIATELY.",
            "Apply Tourniquet 2-3 inches above wound.",
            "Tighten until bleeding STOPS completely.",
            "Note time of application."
        ]
    },
    'bleed_venous': {
        id: 'bleed_venous',
        text: "Standard bleeding protocol initiated.",
        options: [{ label: "Bleeding Stopped", nextId: 'root', style: 'primary' }],
        protocol: [
            "Apply firm direct pressure with clean cloth.",
            "Elevate the limb above heart level.",
            "Apply pressure bandage."
        ]
    },
    // Breathing Branch
    'breath_1': {
        id: 'breath_1',
        text: "Is the airway completely blocked (choking)?",
        options: [
            { label: "Yes, Can't Speak", nextId: 'breath_choke', style: 'danger' },
            { label: "No, Wheezing", nextId: 'breath_asthma', style: 'secondary' }
        ]
    },
    'breath_choke': {
        id: 'breath_choke',
        text: "Initiate Heimlich Maneuver sequence.",
        options: [{ label: "Airway Clear", nextId: 'root', style: 'primary' }],
        protocol: [
            "Stand behind patient.",
            "Make fist above navel.",
            "Thrust inward and upward aggressively.",
            "Repeat until object creates exit."
        ]
    },
    'breath_asthma': {
        id: 'breath_asthma',
        text: "Assisting respiration.",
        options: [{ label: "Return to Menu", nextId: 'root', style: 'secondary' }],
        protocol: [
            "Sit patient upright (Tripod position).",
            "Loosen tight clothing.",
            "Assist with inhaler if available.",
            "Box breathing: In 4s, Hold 4s, Out 4s."
        ]
    },
    // Placeholders for others
    'bone_1': {
        id: 'bone_1',
        text: "Do not move the patient. Is the bone visible (Compound)?",
        options: [
            { label: "Yes, Bone Visible", nextId: 'bone_compound', style: 'danger' },
            { label: "No, Swelling/Pain", nextId: 'bone_simple', style: 'secondary' }
        ]
    },
    'bone_compound': {
        id: 'bone_compound',
        text: "CRITICAL: Component Fracture.",
        options: [{ label: "Understood", nextId: 'root', style: 'primary' }],
        protocol: ["Control bleeding around bone.", "Do NOT push bone back in.", "Cover with sterile dressing.", "Splint in position found."]
    },
    'bone_simple': {
        id: 'bone_simple',
        text: "Fracture Management.",
        options: [{ label: "Understood", nextId: 'root', style: 'primary' }],
        protocol: ["Immobilize joint above and below.", "Apply ice packs (max 20 mins).", "Elevate limb."]
    },
    'burn_1': {
        id: 'burn_1',
        text: "Burn Severity Check. Is skin charred, white, or leathery?",
        options: [
            { label: "Yes (3rd Degree)", nextId: 'burn_major', style: 'danger' },
            { label: "No (Red/Blistered)", nextId: 'burn_minor', style: 'secondary' }
        ]
    },
    'burn_major': {
        id: 'burn_major',
        text: "Major Burn Protocol.",
        options: [{ label: "Done", nextId: 'root', style: 'primary' }],
        protocol: ["Cover with sterile, non-stick bandage.", "Elevate burned area.", "Treat for shock.", "Do NOT apply water."]
    },
    'burn_minor': {
        id: 'burn_minor',
        text: "Minor Burn Protocol.",
        options: [{ label: "Done", nextId: 'root', style: 'primary' }],
        protocol: ["Run cool (not cold) water for 20 mins.", "Remove rings/items before swelling.", "Apply antibiotic ointment."]
    }
};

const INITIAL_MESSAGES: Message[] = [
    { id: '1', sender: 'ai', text: TRIAGE_TREE['root'].text }
];

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [currentNodeId, setCurrentNodeId] = useState<string>('root');
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const currentNode = TRIAGE_TREE[currentNodeId];

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const addMessage = (text: string, sender: Sender, isProtocol = false) => {
        setMessages(prev => [...prev, { id: Date.now().toString(), sender, text, isProtocol }]);
    };

    const handleOptionClick = (nextId: string, label: string) => {
        // User selection
        addMessage(label, 'user');
        setIsTyping(true);

        // AI Response delay
        setTimeout(() => {
            const nextNode = TRIAGE_TREE[nextId];
            if (nextNode) {
                setCurrentNodeId(nextId);
                addMessage(nextNode.text, 'ai');

                // If node has specific protocol steps, add them nicely
                if (nextNode.protocol) {
                    setTimeout(() => {
                        addMessage("PROTOCOL STEPS:\n" + nextNode.protocol?.map(s => `• ${s}`).join("\n"), 'ai', true);
                    }, 600);
                }
            }
            setIsTyping(false);
        }, 600);
    };

    const handleManualSend = () => {
        if (!inputValue.trim()) return;
        addMessage(inputValue, 'user');
        setInputValue("");
        // Fallback response for manual input since we are tree-driven
        setIsTyping(true);
        setTimeout(() => {
            addMessage("I am optimizing for specific protocols. Please select an option above for accurate triage, or type 'Reset' to start over.", 'ai');
            if (inputValue.toLowerCase().includes("reset")) {
                setCurrentNodeId('root');
                addMessage(TRIAGE_TREE['root'].text, 'ai');
            }
            setIsTyping(false);
        }, 1000);
    };

    return (
        <div className="flex flex-col flex-1 min-h-[60vh] glass-panel rounded-2xl overflow-hidden relative">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "flex gap-3 max-w-[85%]",
                            msg.sender === 'user' ? "ml-auto flex-row-reverse" : ""
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/10",
                            msg.sender === 'ai' ? "bg-emerge-green/20 text-emerge-green" : "bg-neutral-800 text-gray-400"
                        )}>
                            {msg.sender === 'ai' ? <Bot size={16} /> : <User size={16} />}
                        </div>

                        <div className={cn(
                            "p-3 rounded-2xl text-sm leading-relaxed",
                            msg.sender === 'ai'
                                ? "bg-neutral-800/80 text-white rounded-tl-none border border-white/5"
                                : "bg-white/10 text-white font-medium rounded-tr-none backdrop-blur-md"
                        )}>
                            {msg.isProtocol ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-emerge-green font-bold text-xs uppercase tracking-wider mb-2 border-b border-white/10 pb-1">
                                        <AlertCircle size={14} /> Medical Protocol
                                    </div>
                                    <div className="whitespace-pre-wrap font-mono text-gray-300 text-xs">{msg.text.replace("PROTOCOL STEPS:\n", "")}</div>
                                </div>
                            ) : (
                                msg.text
                            )}
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerge-green/20 flex items-center justify-center">
                            <Bot size={16} className="text-emerge-green" />
                        </div>
                        <div className="bg-neutral-800 px-4 py-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-75" />
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-150" />
                        </div>
                    </motion.div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Dynamic Options Layer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent pt-12">
                <div className="flex flex-wrap gap-2 justify-end mb-4">
                    <AnimatePresence mode='wait'>
                        {currentNode.options.map((opt) => (
                            <motion.div
                                key={opt.nextId}
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <TacticalButton
                                    variant={opt.style === 'danger' ? 'danger' : opt.style === 'secondary' ? 'secondary' : 'primary'}
                                    onClick={() => handleOptionClick(opt.nextId, opt.label)}
                                    className="text-xs px-4 py-2"
                                >
                                    {opt.label}
                                </TacticalButton>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Manual Input Fallback */}
                <div className="flex gap-2 items-center">
                    <div className="glass-panel flex-1 rounded-xl flex items-center px-3 py-2 border-white/10">
                        <input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleManualSend()}
                            className="bg-transparent border-none focus:outline-none text-sm text-white w-full placeholder:text-gray-600"
                            placeholder="Type 'Reset' to restart..."
                        />
                        <Mic size={16} className="text-gray-500" />
                    </div>
                    <button onClick={handleManualSend} className="bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-colors text-white">
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
