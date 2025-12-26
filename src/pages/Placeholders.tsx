export function Triage() {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">AI Triage Engine</h2>
            <div className="bg-neutral-900 rounded-xl p-8 text-center border-2 border-dashed border-neutral-700">
                <p className="text-gray-500">Camera Interface Placeholder</p>
            </div>
            <div className="space-y-2">
                <div className="bg-neutral-800 p-4 rounded-lg">
                    <p className="font-mono text-emerge-green">System: Describe your symptoms or scan injury.</p>
                </div>
            </div>
        </div>
    );
}

export function Guardian() {
    return <h2 className="text-2xl font-bold">Guardian Survival Tutor</h2>;
}

export function Shield() {
    return <h2 className="text-2xl font-bold text-amber-500">Seismic Shield Network</h2>;
}

export function Sentinel() {
    return <h2 className="text-2xl font-bold text-red-500">Sentinel Threat Map</h2>;
}
