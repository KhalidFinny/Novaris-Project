import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Slider } from '../components/ui/Slider';
import { Badge } from '../components/ui/Badge';
import { TutorialOverlay } from '../components/ui/TutorialOverlay';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { DelayInput, DelayOutput } from '../lib/delay/delay.types';
import { Activity, ShieldAlert, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

const TUTORIAL_STEPS = [
    { targetId: 'step-inputs-delay', title: '1. Describe the Project', description: 'Enter details about your upcoming project like team size, complexity, and buffers.', position: 'right' as const },
    { targetId: 'step-results-delay', title: '2. See the Timeline', description: 'The engine will calculate the probability of delays and project the true timeline against your optimistic target.', position: 'bottom' as const },
    { targetId: 'step-mitigations-delay', title: '3. Spot Bottlenecks', description: 'Find the top 3 critical blockers along with exact steps to resolve them before they disrupt the schedule.', position: 'left' as const }
];

export default function Delay() {
    const [showTutorial, setShowTutorial] = useState(true);
    const [form, setForm] = useState<DelayInput>({
        targetDurationDays: 90,
        teamSize: 5,
        complexityScore: 3,
        supplierLeadTimeVarianceDays: 14,
        externalDependenciesCount: 2,
        historicalDelayRate: 20,
        bufferDaysRemaining: 10
    });

    const mutation = useMutation({
        mutationFn: async (data: DelayInput): Promise<DelayOutput> => {
            const res = await fetch('/api/delay', {
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
                        <span className="px-4 py-1.5 text-sm rounded-md bg-brand-primary/20 text-brand-primary font-medium">Delay Module</span>
                        <Link to="/financial" className="px-4 py-1.5 text-sm rounded-md text-brand-muted hover:text-white transition-colors">Financial Module</Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">

                {/* LEFT PANEL: Inputs */}
                <Card className="lg:col-span-3 transition-opacity duration-300" id="step-inputs-delay">
                    <CardHeader className="border-b border-gray-800/50 pb-4 mb-4">
                        <CardTitle className="flex items-center gap-2"><Clock className="w-4 h-4 text-brand-primary" /> Project Setup</CardTitle>
                        <p className="text-xs text-brand-muted mt-1">Configure project variables</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input label="Target Duration (Days)" type="number" value={form.targetDurationDays} onChange={e => setForm({ ...form, targetDurationDays: +e.target.value })} />
                        <Input label="Team Size" type="number" value={form.teamSize} onChange={e => setForm({ ...form, teamSize: +e.target.value })} />
                        <Slider label="Complexity (1-5)" value={form.complexityScore} onChange={e => setForm({ ...form, complexityScore: +e.target.value })} min={1} max={5} />
                        <Input label="Supplier Variance (Days)" type="number" value={form.supplierLeadTimeVarianceDays} onChange={e => setForm({ ...form, supplierLeadTimeVarianceDays: +e.target.value })} />
                        <Input label="External Dependencies" type="number" value={form.externalDependenciesCount} onChange={e => setForm({ ...form, externalDependenciesCount: +e.target.value })} />
                        <Input label="Buffer Days" type="number" value={form.bufferDaysRemaining} onChange={e => setForm({ ...form, bufferDaysRemaining: +e.target.value })} />
                        <Slider label="Historical Delay %" value={form.historicalDelayRate} onChange={e => setForm({ ...form, historicalDelayRate: +e.target.value })} min={0} max={100} />

                        <Button className="w-full mt-6" onClick={handleRun} disabled={mutation.isPending}>
                            {mutation.isPending ? 'Calculating Network...' : 'Analyze Delays'}
                        </Button>
                    </CardContent>
                </Card>

                {/* CENTER PANEL: Main Visualization */}
                <Card className="lg:col-span-6 bg-[#0B0E14] border-gray-800 overflow-hidden relative" id="step-results-delay">
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-risk/5 to-transparent pointer-events-none"></div>
                    <CardHeader className="text-center pt-8">
                        <CardTitle className="font-display text-lg text-brand-muted uppercase tracking-widest font-normal">Delay Probability</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center min-h-[500px] mt-4">

                        {!data ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-brand-muted opacity-50">
                                <Clock className="w-12 h-12 mb-4 animate-pulse text-brand-risk" />
                                <p>Awaiting structural project parameters...</p>
                            </div>
                        ) : (
                            <div className="w-full flex-1 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
                                <div className="text-center mb-8 relative">
                                    <div className={`text-8xl font-black tracking-tighter ${data.delayProbability > 60 ? 'text-brand-risk' : data.delayProbability > 30 ? 'text-brand-caution' : 'text-brand-safe'} drop-shadow-2xl`}>
                                        {data.delayProbability.toFixed(0)}<span className="text-4xl text-brand-muted/50">%</span>
                                    </div>
                                    <Badge className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap" variant={data.delayProbability > 50 ? 'risk' : 'safe'}>
                                        Expected Timeline: {data.expectedDurationDays.toFixed(0)} Days
                                    </Badge>
                                </div>

                                <div className="w-full mt-6 flex justify-between items-center bg-brand-surface border border-gray-800 p-4 rounded-xl">
                                    <div className="text-center w-full border-r border-gray-800">
                                        <p className="text-sm text-brand-muted mb-1">Target</p>
                                        <p className="text-2xl font-bold font-mono text-white">{form.targetDurationDays}d</p>
                                    </div>
                                    <div className="text-center w-full">
                                        <p className="text-sm text-brand-muted mb-1">Risk-Adjusted Estimate</p>
                                        <p className="text-2xl font-bold font-mono text-brand-risk">+{data.estimatedDelayDaysRange[1].toFixed(0)}d maximum delay</p>
                                    </div>
                                </div>

                                <div className="w-full h-48 mt-auto pt-6">
                                    <h4 className="text-xs text-brand-muted font-semibold uppercase tracking-wider mb-4 pl-4">Phase Variance Impact</h4>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={data.timelineProjection} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" horizontal={false} />
                                            <XAxis type="number" stroke="#4B5563" tick={{ fill: '#6B7280', fontSize: 12 }} />
                                            <YAxis dataKey="phase" type="category" stroke="#4B5563" tick={{ fill: '#E5E7EB', fontSize: 12 }} width={100} />
                                            <Tooltip
                                                cursor={{ fill: '#1F2937' }}
                                                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                                                itemStyle={{ color: '#E5E7EB' }}
                                            />
                                            <Bar dataKey="optimisticDays" stackId="a" fill="#2563EB" name="Base Time" radius={[4, 0, 0, 4]} barSize={16}>
                                                {data.timelineProjection.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={'#2563EB'} fillOpacity={0.8} />
                                                ))}
                                            </Bar>
                                            <Bar dataKey="pessimisticDays" stackId="a" fill="#DC2626" name="Max Delay Variance" radius={[0, 4, 4, 0]}>
                                                {data.timelineProjection.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={'#DC2626'} fillOpacity={0.9} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* RIGHT PANEL: Breakdown and Mitigations */}
                <div className="lg:col-span-3 flex flex-col gap-6" id="step-mitigations-delay">
                    <Card className="flex-1 bg-brand-surface border-gray-800">
                        <CardHeader className="border-b border-gray-800/50 pb-4 mb-4">
                            <CardTitle className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-brand-caution" /> Critical Bottlenecks</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {!data ? (
                                <p className="text-sm text-brand-muted text-center mt-10 opacity-50">Run analysis to view bottlenecks</p>
                            ) : (
                                data.criticalBottlenecks.map((bottleneck, i) => (
                                    <div key={i} className="p-3 bg-[#0D1117] rounded-lg border border-brand-risk/20 shadow-sm animate-in slide-in-from-right-4 fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-sm font-medium text-gray-300 leading-snug">{bottleneck.factor}</p>
                                            <span className="text-xs font-mono text-brand-risk">+{bottleneck.delayDaysAdded.toFixed(1)}d</span>
                                        </div>
                                        <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
                                            <div className="bg-brand-risk h-full" style={{ width: `${Math.min(100, (bottleneck.weight) * 400)}%` }}></div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card className="flex-1 bg-brand-surface border-gray-800">
                        <CardHeader className="border-b border-gray-800/50 pb-4 mb-4">
                            <CardTitle className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-safe" /> Action Plan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!data ? (
                                <p className="text-sm text-brand-muted text-center mt-4 opacity-50">Run analysis for mitigation tactics</p>
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
