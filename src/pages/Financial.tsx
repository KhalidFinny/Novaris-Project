import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Slider } from '../components/ui/Slider';
import { Badge } from '../components/ui/Badge';
import { TutorialOverlay } from '../components/ui/TutorialOverlay';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { FinancialInput, FinancialOutput } from '../lib/financial/financial.types';
import { Activity, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

const TUTORIAL_STEPS = [
    { targetId: 'step-inputs', title: '1. Enter Financial Data', description: 'Input your current monthly revenue, costs, and reserves. This forms the baseline for our Monte Carlo simulations.', position: 'right' as const },
    { targetId: 'step-results', title: '2. Review Risk Score', description: 'After running the simulation, your Survival Probability and Cash Runway will appear here. The chart shows your 12-month trajectory.', position: 'bottom' as const },
    { targetId: 'step-mitigations', title: '3. Actionable Insights', description: 'We identify your top risk drivers and provide specific mitigation strategies to improve your runway.', position: 'left' as const }
];

export default function Financial() {
    const [showTutorial, setShowTutorial] = useState(true);
    const [form, setForm] = useState<FinancialInput>({
        monthlyRevenue: 50000,
        fixedCosts: 20000,
        variableCostPercentage: 40,
        monthlyDebtObligations: 5000,
        seasonalityFactor: 0.1,
        projectedGrowthRate: 5,
        currentCashReserves: 100000,
        emergencyBufferSize: 30000
    });

    const mutation = useMutation({
        mutationFn: async (data: FinancialInput): Promise<FinancialOutput> => {
            const res = await fetch('/api/financial', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Simulation failed');
            return res.json();
        }
    });

    const handleRun = () => mutation.mutate(form);

    const data = mutation.data;

    const getScoreColor = (score: number) => {
        if (score > 70) return 'text-brand-risk';
        if (score > 40) return 'text-brand-caution';
        return 'text-brand-safe';
    };

    return (
        <div className="min-h-screen bg-brand-bg text-gray-100 p-6 font-sans">
            {showTutorial && <TutorialOverlay steps={TUTORIAL_STEPS} onComplete={() => setShowTutorial(false)} />}

            <header className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
                <Link to="/" className="text-xl font-bold text-white flex items-center gap-2 hover:text-brand-primary transition-colors">
                    &larr; <ShieldAlert className="w-5 h-5 text-brand-primary" /> Novaris
                </Link>
                <div className="flex gap-4 items-center">
                    <button onClick={() => setShowTutorial(true)} className="text-sm text-brand-muted hover:text-white underline underline-offset-4 mr-4">How to Use</button>
                    <div className="flex gap-2 rounded-lg bg-brand-surface p-1 border border-gray-800">
                        <Link to="/delay" className="px-4 py-1.5 text-sm rounded-md text-brand-muted hover:text-white transition-colors">Delay Module</Link>
                        <span className="px-4 py-1.5 text-sm rounded-md bg-brand-primary/20 text-brand-primary font-medium">Financial Module</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">

                {/* LEFT PANEL: Inputs */}
                <Card className="lg:col-span-3 transition-opacity duration-300" id="step-inputs">
                    <CardHeader className="border-b border-gray-800/50 pb-4 mb-4">
                        <CardTitle className="flex items-center gap-2"><Activity className="w-4 h-4 text-brand-primary" /> Input Parameters</CardTitle>
                        <p className="text-xs text-brand-muted mt-1">Configure your business baseline</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input label="Monthly Rev ($)" type="number" value={form.monthlyRevenue} onChange={e => setForm({ ...form, monthlyRevenue: +e.target.value })} />
                        <Input label="Fixed Costs ($)" type="number" value={form.fixedCosts} onChange={e => setForm({ ...form, fixedCosts: +e.target.value })} />
                        <Slider label="Var. Cost %" value={form.variableCostPercentage} onChange={e => setForm({ ...form, variableCostPercentage: +e.target.value })} min={0} max={100} />
                        <Input label="Debt Oblig. ($)" type="number" value={form.monthlyDebtObligations} onChange={e => setForm({ ...form, monthlyDebtObligations: +e.target.value })} />
                        <Input label="Cash Reserves ($)" type="number" value={form.currentCashReserves} onChange={e => setForm({ ...form, currentCashReserves: +e.target.value })} />
                        <Input label="Emergency Buffer ($)" type="number" value={form.emergencyBufferSize} onChange={e => setForm({ ...form, emergencyBufferSize: +e.target.value })} />

                        <Button className="w-full mt-6" onClick={handleRun} disabled={mutation.isPending}>
                            {mutation.isPending ? 'Simulating 500 Futures...' : 'Run Simulation'}
                        </Button>
                    </CardContent>
                </Card>

                {/* CENTER PANEL: Main Visualization */}
                <Card className="lg:col-span-6 bg-[#0B0E14] border-gray-800 overflow-hidden relative" id="step-results">
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 to-transparent pointer-events-none"></div>
                    <CardHeader className="text-center pt-8">
                        <CardTitle className="font-display text-lg text-brand-muted uppercase tracking-widest font-normal">Survival Probability</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center min-h-[500px] mt-4">

                        {!data ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-brand-muted opacity-50">
                                <Activity className="w-12 h-12 mb-4 animate-pulse text-brand-primary" />
                                <p>Awaiting simulation parameters...</p>
                            </div>
                        ) : (
                            <div className="w-full flex-1 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
                                <div className="text-center mb-8 relative">
                                    <div className={`text-8xl font-black tracking-tighter ${getScoreColor(data.riskScore)} drop-shadow-2xl`}>
                                        {data.survivalProbability.toFixed(0)}<span className="text-4xl text-brand-muted/50">%</span>
                                    </div>
                                    <Badge className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap" variant={data.riskScore > 50 ? 'risk' : 'safe'}>
                                        {data.cashRunwayMonths.toFixed(1)} Months Runway
                                    </Badge>
                                </div>

                                <div className="w-full h-56 mt-auto">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data.monthlyProjections} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                                            <XAxis dataKey="month" stroke="#4B5563" tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(v) => `M${v}`} />
                                            <YAxis stroke="#4B5563" tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000)}k`} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                                                itemStyle={{ color: '#E5E7EB' }}
                                                formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
                                                labelFormatter={(label) => `Month ${label}`}
                                            />
                                            <Area type="monotone" dataKey="cashBalance" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorCash)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* RIGHT PANEL: Breakdown and Mitigations */}
                <div className="lg:col-span-3 flex flex-col gap-6" id="step-mitigations">
                    <Card className="flex-1 bg-brand-surface border-gray-800">
                        <CardHeader className="border-b border-gray-800/50 pb-4 mb-4">
                            <CardTitle className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-brand-caution" /> Top Risk Drivers</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {!data ? (
                                <p className="text-sm text-brand-muted text-center mt-10 opacity-50">Run simulation to view risks</p>
                            ) : (
                                data.topRiskDrivers.map((driver, i) => (
                                    <div key={i} className="p-3 bg-[#0D1117] rounded-lg border border-brand-risk/20 shadow-sm animate-in slide-in-from-right-4 fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                                        <p className="text-sm font-medium text-gray-300 leading-snug">{driver}</p>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card className="flex-1 bg-brand-surface border-gray-800">
                        <CardHeader className="border-b border-gray-800/50 pb-4 mb-4">
                            <CardTitle className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-safe" /> Mitigations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!data ? (
                                <p className="text-sm text-brand-muted text-center mt-4 opacity-50">Run simulation for actionable advice</p>
                            ) : (
                                <ul className="text-sm text-brand-muted space-y-4">
                                    {data.mitigationSuggestions.map((suggestion, i) => (
                                        <li key={i} className="flex gap-3 animate-in fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                                            <span className="shrink-0 w-1.5 h-1.5 mt-1.5 rounded-full bg-brand-safe shadow-[0_0_8px_rgba(5,150,105,0.6)]"></span>
                                            <span className="leading-relaxed">{suggestion}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>

            </main>
        </div>
    );
}
