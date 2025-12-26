import { createContext, useContext, useState, type ReactNode } from 'react';

interface PanicContextType {
    isPanicMode: boolean;
    togglePanicMode: () => void;
    activatePanicMode: () => void;
    deactivatePanicMode: () => void;
}

const PanicContext = createContext<PanicContextType | undefined>(undefined);

export function PanicProvider({ children }: { children: ReactNode }) {
    const [isPanicMode, setIsPanicMode] = useState(false);

    const togglePanicMode = () => setIsPanicMode(prev => !prev);
    const activatePanicMode = () => setIsPanicMode(true);
    const deactivatePanicMode = () => setIsPanicMode(false);

    return (
        <PanicContext.Provider value={{ isPanicMode, togglePanicMode, activatePanicMode, deactivatePanicMode }}>
            {children}
        </PanicContext.Provider>
    );
}

export function usePanic() {
    const context = useContext(PanicContext);
    if (context === undefined) {
        throw new Error('usePanic must be used within a PanicProvider');
    }
    return context;
}
