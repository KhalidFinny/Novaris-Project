import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Clock, ShieldAlert } from 'lucide-react';
import { animate, stagger } from 'animejs';

export default function LandingPage() {
    const heroRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Simple entrance animation for that high-aesthetic feel
        animate('.hero-element', {
            y: [30, 0],
            opacity: [0, 1],
            duration: 800,
            delay: stagger(150),
            ease: 'outExpo'
        });

        animate('.feature-card', {
            y: [40, 0],
            opacity: [0, 1],
            duration: 800,
            delay: stagger(150, { start: 400 }),
            ease: 'outElastic(1, .8)'
        });
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden bg-brand-bg">
            {/* Minimalist Gradient Background */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-light-blue rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-blue rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

            <nav className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex justify-between items-center hero-element opacity-0">
                <div className="flex items-center gap-2">
                    <ShieldAlert className="text-brand-light-blue w-8 h-8" />
                    <span className="font-bold text-2xl tracking-tight text-white">Novaris</span>
                </div>
                <div>
                    <span className="text-sm font-medium text-brand-muted bg-brand-surface/50 px-3 py-1 rounded-full border border-gray-700">Competition Build</span>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32" ref={heroRef}>
                <div className="max-w-3xl">
                    <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6 hero-element opacity-0">
                        Operational Risk <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light-blue to-brand-blue">
                            Simulated.
                        </span>
                    </h1>
                    <p className="text-xl text-brand-muted mb-10 max-w-2xl leading-relaxed hero-element opacity-0">
                        Stop guessing your runway and delays. Novaris runs hundreds of Monte-Carlo scenarios to quantify your financial survival and project bottlenecks in plain English.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 hero-element opacity-0">
                        <Link to="/financial" className="group flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/80 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-brand-primary/20">
                            Run Financial Simulation
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/delay" className="group flex items-center justify-center gap-2 bg-brand-surface hover:bg-gray-800 text-white border border-gray-700 px-8 py-4 rounded-xl font-medium transition-all duration-300">
                            Run Delay Simulation
                        </Link>
                    </div>
                </div>

                <div className="mt-32 grid md:grid-cols-2 gap-6" ref={cardsRef}>
                    <div className="feature-card opacity-0 bg-white/60 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-xl shadow-brand-blue/5 group hover:-translate-y-2 transition-transform duration-300 cursor-default">
                        <div className="bg-brand-bg w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-brand-light-blue group-hover:scale-110 transition-transform">
                            <Activity className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Financial Stability</h3>
                        <p className="text-brand-muted leading-relaxed">
                            Input your revenue and burn rate. We simulate 500 potential futures to chart your precise cash runway and calculate a robust survival probability score.
                        </p>
                    </div>

                    <div className="feature-card opacity-0 bg-white/60 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-xl shadow-brand-blue/5 group hover:-translate-y-2 transition-transform duration-300 cursor-default">
                        <div className="bg-brand-bg w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-brand-blue group-hover:scale-110 transition-transform">
                            <Clock className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Project Bottlenecks</h3>
                        <p className="text-brand-muted leading-relaxed">
                            Map your team size, complexity, and dependencies. Our weighted model uncovers exactly where your timeline will break and by how many days.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
