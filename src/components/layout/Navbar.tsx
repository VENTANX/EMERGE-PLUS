import { NavLink } from 'react-router-dom';
import { Stethoscope, Compass, Activity, Map, Radio, User } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Navbar() {
    const navItems = [
        { name: 'Triage', path: '/triage', icon: Stethoscope },
        { name: 'Guardian', path: '/guardian', icon: Compass },
        { name: 'Shield', path: '/shield', icon: Activity },
        { name: 'Sentinel', path: '/sentinel', icon: Map },
        { name: 'Comms', path: '/comms', icon: Radio },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-emerge-dark border-t border-white/10 pb-safe z-40">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex flex-col items-center justify-center w-full h-full transition-colors duration-200",
                            isActive ? "text-emerge-green" : "text-gray-500 hover:text-gray-300"
                        )}
                    >
                        <item.icon size={24} strokeWidth={2.5} />
                        <span className="text-[10px] uppercase font-bold tracking-wider mt-1">{item.name}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}

export function SatelliteStatus() {
    return (
        <div className="fixed top-0 left-0 right-0 h-10 bg-black/80 backdrop-blur-md z-30 flex items-center justify-between px-4 border-b border-white/5">
            <div className="flex items-center gap-2 text-emerge-green">
                <Radio size={14} className="animate-pulse" />
                <span className="text-xs font-mono font-bold">SAT-LINK: ACTIVE</span>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 hidden sm:block">
                <span className="text-[10px] text-white/20 font-mono tracking-widest uppercase">System by Oussama Aslouj</span>
            </div>
            {/* Global Settings Trigger */}
            <button className="flex items-center gap-2 hover:bg-white/5 py-1 px-2 rounded transition-colors group" onClick={() => window.dispatchEvent(new CustomEvent('open-settings'))}>
                <span className="text-[10px] font-mono font-bold text-gray-400 group-hover:text-white uppercase">Profile</span>
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:border-emerge-green/50">
                    <User size={12} className="text-gray-400 group-hover:text-emerge-green" />
                </div>
            </button>
        </div>
    );
}
