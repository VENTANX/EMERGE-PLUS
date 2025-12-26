/**
 * @author Oussama Aslouj
 * @description Main Application Entry Point
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PanicProvider } from './context/PanicContext';
import { RootLayout } from './components/layout/RootLayout';
import { Home } from './pages/Home';
import { Triage } from './pages/Triage';
import { Guardian } from './pages/Guardian';
import { Shield } from './pages/Shield';
import { Sentinel } from './pages/Sentinel';
import { Comms } from './pages/Comms';

import { UserProvider } from './context/UserContext';
import { SoundProvider } from './context/SoundContext';
import { BootLoader } from './components/layout/BootLoader';

export default function App() {
    return (
        <UserProvider>
            <PanicProvider>
                <SoundProvider>
                    <BootLoader>
                        <BrowserRouter>
                            <Routes>
                                <Route element={<RootLayout />}>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/triage" element={<Triage />} />
                                    <Route path="/guardian" element={<Guardian />} />
                                    <Route path="/shield" element={<Shield />} />
                                    <Route path="/sentinel" element={<Sentinel />} />
                                    <Route path="/comms" element={<Comms />} />
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Route>
                            </Routes>
                        </BrowserRouter>
                    </BootLoader>
                </SoundProvider>
            </PanicProvider>
        </UserProvider>
    );
}
