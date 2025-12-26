import { Shield, AlertTriangle, ChevronRight, User } from 'lucide-react';
import { TacticalButton } from '../components/ui/TacticalButton';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export function Home() {
    const { userName, userLocation, guardianProgress, activeThreats } = useUser();
    const navigate = useNavigate();

    return (
        <div className="space-y-6 pb-12">
            <header className="mb-8 mt-4 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter">EMERGE<span className="text-emerge-red">+</span></h1>
                    <p className="text-gray-400 font-mono text-sm leading-tight">SYSTEM ONLINE <br /> {userLocation.toUpperCase()}</p>
                </div>
                <div className="flex flex-col items-end">
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('open-settings'))}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 transition-colors"
                    >
                        <User size={14} className="text-emerge-green" />
                        <span className="text-xs font-mono font-bold text-white uppercase">{userName}</span>
                    </button>
                </div>
            </header>

            {/* Quick Action Cards */}
            <section className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-4 rounded-2xl space-y-3 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 h-1 bg-emerge-green transition-all duration-1000" style={{ width: `${guardianProgress}%` }} />
                    <div className="bg-emerge-green/20 w-10 h-10 rounded-full flex items-center justify-center text-emerge-green">
                        <Shield size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold">Survival Mastery</h3>
                        <p className="text-xs text-gray-400 mt-1">{guardianProgress}% Complete</p>
                    </div>
                    <TacticalButton variant="secondary" className="w-full text-xs py-2" onClick={() => navigate('/guardian')}>
                        {guardianProgress === 100 ? 'Review Modules' : 'Resume Training'}
                    </TacticalButton>
                </div>

                <div className="glass-panel p-4 rounded-2xl space-y-3">
                    <div className="bg-amber-500/20 w-10 h-10 rounded-full flex items-center justify-center text-amber-500">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold">Active Threats</h3>
                        <p className="text-xs text-gray-400 mt-1">{activeThreats} Threats in Sector</p>
                    </div>
                    <TacticalButton variant="secondary" className="w-full text-xs py-2" onClick={() => navigate('/sentinel')}>
                        View Intel Map
                    </TacticalButton>
                </div>
            </section>

            {/* Hero: Survival Tutor */}
            <section className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533513364243-157949162985?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />

                <div className="relative z-10 space-y-4">
                    <span className="bg-emerge-green text-black text-xs font-bold px-2 py-1 rounded">DAILY DRILL</span>
                    <h2 className="text-3xl font-black uppercase max-w-[200px] leading-none">Shelter Building 101</h2>
                    <p className="text-sm text-gray-300 max-w-[250px]">Master the lean-to structure before nightfall.</p>
                    <TacticalButton glow className="mt-2" onClick={() => navigate('/guardian')}>
                        Start Simulation <ChevronRight size={16} />
                    </TacticalButton>
                </div>
            </section>

            {/* Threat Ticker */}
            <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4 flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <div className="flex-1">
                    <h4 className="font-bold text-red-400 text-sm uppercase">Threat Alert</h4>
                    <p className="text-xs text-red-300/80">Civil unrest reported 2.4mi North. Avoid downtown sector.</p>
                </div>
            </div>

        </div>
    );
}
