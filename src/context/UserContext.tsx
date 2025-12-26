import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface UserContextType {
    userName: string;
    setUserName: (name: string) => void;
    userLocation: string;
    setUserLocation: (loc: string) => void;
    guardianProgress: number; // 0-100
    updateGuardianProgress: (newProgress: number) => void;
    activeThreats: number;
    updateThreatCount: (count: number) => void;
    achievements: string[];
    unlockAchievement: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    // Identity
    const [userName, setUserName] = useState(() => localStorage.getItem('user_name') || 'Survivor');
    const [userLocation, setUserLocation] = useState(() => localStorage.getItem('user_location') || 'Sector 7 (Unknown)');

    // Stats
    const [guardianProgress, setGuardianProgress] = useState(0);
    const [activeThreats, setActiveThreats] = useState(3); // Start with some mock data

    // Persistence for Identity
    useEffect(() => {
        localStorage.setItem('user_name', userName);
    }, [userName]);

    useEffect(() => {
        localStorage.setItem('user_location', userLocation);
    }, [userLocation]);

    // Check Guardian Progress on Mount (Aggregated from local storage keys)
    useEffect(() => {
        try {
            const saved = localStorage.getItem('guardian_progress');
            if (saved) {
                const data = JSON.parse(saved);
                // Calculate simplistic total progress (ratio of checked items)
                // This is a rough heuristic since we don't strictly track total possible items globally yet
                const totalChecked = Object.values(data).filter(Boolean).length;
                // Assuming roughly 12 steps total across 4 modules for now
                const computed = Math.min(100, Math.round((totalChecked / 12) * 100));
                setGuardianProgress(computed);
            }
        } catch (e) {
            console.error("Failed to load progress", e);
        }
    }, []);

    // Achievements
    const [achievements, setAchievements] = useState<string[]>(() => {
        const saved = localStorage.getItem('user_achievements');
        return saved ? JSON.parse(saved) : [];
    });

    // Persistence for Achievements
    useEffect(() => {
        localStorage.setItem('user_achievements', JSON.stringify(achievements));
    }, [achievements]);

    const unlockAchievement = (id: string) => {
        if (!achievements.includes(id)) {
            setAchievements(prev => [...prev, id]);
            // Could trigger a toast/sound here
        }
    };

    // Auto-unlock mastery achievement
    useEffect(() => {
        if (guardianProgress >= 100) unlockAchievement('master_survivor');
        if (guardianProgress >= 50) unlockAchievement('apprentice');
    }, [guardianProgress]);

    const updateGuardianProgress = (newProgress: number) => setGuardianProgress(newProgress);
    const updateThreatCount = (count: number) => setActiveThreats(count);

    return (
        <UserContext.Provider value={{
            userName, setUserName,
            userLocation, setUserLocation,
            guardianProgress, updateGuardianProgress,
            activeThreats, updateThreatCount,
            achievements, unlockAchievement
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
