import { Map as MapIcon, ShieldAlert, Navigation, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix for default marker icon in leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const THREATS = [
    { id: 1, type: 'civil_unrest', position: [40.715, -74.009] as [number, number], severity: 'high', label: 'Civil Disturbance' },
    { id: 2, type: 'active_shooter', position: [40.711, -74.003] as [number, number], severity: 'critical', label: 'Active Shooter' },
    { id: 3, type: 'police_activity', position: [40.716, -74.004] as [number, number], severity: 'medium', label: 'Police Operation' },
    { id: 4, type: 'fire', position: [40.710, -74.008] as [number, number], severity: 'high', label: 'Structure Fire' },
];

const createCustomIcon = (severity: string) => {
    const colorClass = severity === 'critical' ? 'text-emerge-red border-emerge-red' :
        severity === 'high' ? 'text-amber-600 border-amber-600' : 'text-blue-500 border-blue-500';

    const bgClass = severity === 'critical' ? 'bg-emerge-red' :
        severity === 'high' ? 'bg-amber-600' : 'bg-blue-500';

    const iconMarkup = renderToStaticMarkup(
        <div className="relative flex items-center justify-center w-12 h-12">
            <div className={cn("absolute inset-0 rounded-full opacity-30 animate-ping", bgClass)} />
            <div className={cn("absolute inset-0 rounded-full opacity-20", bgClass)} />
            <div className={cn("relative z-10 p-2 rounded-full border shadow-xl backdrop-blur-md bg-black/60", colorClass)}>
                <ShieldAlert size={20} />
            </div>
        </div>
    );

    return L.divIcon({
        html: iconMarkup,
        className: 'bg-transparent',
        iconSize: [48, 48],
        iconAnchor: [24, 24],
        popupAnchor: [0, -24]
    });
};

export function Sentinel() {
    const { updateThreatCount } = useUser();
    const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'high' | 'medium'>('all');
    const [showFilters, setShowFilters] = useState(false);

    const filteredThreats = THREATS.filter(t => {
        if (activeFilter === 'all') return true;
        return t.severity === activeFilter;
    });

    useEffect(() => {
        updateThreatCount(filteredThreats.length);
    }, [filteredThreats.length]);

    return (
        <div className="relative h-[calc(100vh-140px)] rounded-3xl overflow-hidden border border-white/10 group bg-black">

            <MapContainer
                center={[40.7128, -74.006]}
                zoom={14}
                className="h-full w-full z-0"
                zoomControl={false}
                attributionControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {filteredThreats.map((threat) => (
                    <Marker
                        key={threat.id}
                        position={threat.position}
                        icon={createCustomIcon(threat.severity)}
                    >
                        <Popup className="sentinel-popup">
                            <div className="bg-black/90 p-2 text-white border border-white/20 rounded text-xs font-mono">
                                <strong className="block text-emerge-red mb-1 uppercase">{threat.label}</strong>
                                <span>Severity: {threat.severity}</span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Grid Overlay for Texture */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-[400]" />

            {/* HUD Controls */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-[500]">
                <div className="bg-black/60 backdrop-blur-xl p-3 rounded-2xl border border-white/10 pointer-events-auto shadow-2xl">
                    <h2 className="font-bold text-emerge-red flex items-center gap-2">
                        <MapIcon size={18} /> SENTINEL
                    </h2>
                    <p className="text-[10px] text-gray-400 font-mono mt-1">
                        {filteredThreats.length} THREATS IN SECTOR
                    </p>
                </div>

                <div className="flex gap-2 pointer-events-auto flex-col items-end">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={cn(
                                "p-3 backdrop-blur-xl rounded-full border transition-colors shadow-lg",
                                showFilters ? "bg-white text-black border-white" : "bg-black/60 text-white border-white/10 hover:bg-white/10"
                            )}
                        >
                            <Filter size={20} />
                        </button>
                        <button className="p-3 bg-emerge-green text-black rounded-full hover:bg-emerge-green/90 shadow-lg glow-green">
                            <Navigation size={20} />
                        </button>
                    </div>

                    {/* Filter Menu */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                className="bg-black/80 backdrop-blur-md rounded-xl border border-white/10 p-2 flex flex-col gap-1 w-32"
                            >
                                <button onClick={() => setActiveFilter('all')} className={cn("text-xs text-left px-3 py-2 rounded-lg transition-colors", activeFilter === 'all' ? "bg-white/20 text-white" : "text-gray-400 hover:text-white")}>All Layers</button>
                                <button onClick={() => setActiveFilter('critical')} className={cn("text-xs text-left px-3 py-2 rounded-lg transition-colors", activeFilter === 'critical' ? "bg-emerge-red/20 text-emerge-red" : "text-gray-400 hover:text-white")}>Critical Only</button>
                                <button onClick={() => setActiveFilter('high')} className={cn("text-xs text-left px-3 py-2 rounded-lg transition-colors", activeFilter === 'high' ? "bg-amber-500/20 text-amber-500" : "text-gray-400 hover:text-white")}>High Priority</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Bottom Ticker */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-3 flex items-center gap-3 z-[500]">
                <div className="text-emerge-red font-bold text-xs shrink-0 whitespace-nowrap">LIVE FEED</div>
                <div className="h-4 w-[1px] bg-white/20" />
                <div className="overflow-hidden relative flex-1 h-5">
                    <motion.div
                        animate={{ y: ['0%', '-100%'] }}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                        className="absolute top-0 left-0 w-full space-y-2 text-xs text-gray-300 font-mono"
                    >
                        <p>• 12:42 PM - Gunshot reported at 5th & Main (Confirmed)</p>
                        <p>• 12:40 PM - Large crowd forming at Central Park</p>
                        <p>• 12:38 PM - Police perimeter established on 3rd Ave</p>
                        <p>• 12:42 PM - Gunshot reported at 5th & Main (Confirmed)</p>
                        <p>• 12:35 PM - Fire units responding to Sector 4</p>
                        <p>• 12:30 PM - UAV surveillance drone online</p>
                    </motion.div>
                </div>
            </div>

            <style>{`
                .leaflet-container {
                    background: #000;
                }
                .sentinel-popup .leaflet-popup-content-wrapper {
                    background: transparent;
                    box-shadow: none;
                    padding: 0;
                }
                .sentinel-popup .leaflet-popup-tip {
                    background: rgba(0,0,0,0.9);
                }
            `}</style>
        </div>
    );
}
