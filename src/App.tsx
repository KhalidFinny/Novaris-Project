import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Financial from './pages/Financial';
import Delay from './pages/Delay';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-brand-bg text-brand-slate font-sans selection:bg-brand-light-blue selection:text-white">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/financial" element={<Financial />} />
                    <Route path="/delay" element={<Delay />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
