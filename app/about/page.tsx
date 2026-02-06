'use client';

import Link from 'next/link';
import { ArrowLeft, Terminal, Hammer, Brain, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
    return (
        <div className="min-h-screen bg-[var(--terminal-bg)] text-[var(--terminal-text)] font-mono selection:bg-[var(--terminal-accent)] selection:text-[var(--terminal-bg)] overflow-x-hidden">

            {/* Header */}
            <header className="border-b-4 border-[var(--terminal-text)] p-6 sticky top-0 bg-[var(--terminal-bg)] z-50 flex justify-between items-center whitespace-nowrap overflow-x-auto">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-10 h-10 brutalist-border bg-[var(--terminal-accent)] flex items-center justify-center group-hover:bg-[var(--terminal-text)] transition-colors">
                            <ArrowLeft className="text-[var(--terminal-bg)] group-hover:text-[var(--terminal-bg)]" />
                        </div>
                        <div>
                            <span className="font-extrabold text-2xl tracking-tighter uppercase block leading-none group-hover:text-[var(--terminal-accent)] transition-colors">Back_To_Terminal</span>
                            <span className="block text-[10px] text-[var(--terminal-dim)]">SYSTEM_MODE: MANUAL_READ</span>
                        </div>
                    </Link>
                </div>
                <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest">
                    <Link href="/" className="text-[var(--terminal-dim)] hover:text-[var(--terminal-text)] transition-colors opacity-40 hover:opacity-100">[ DISCOVERY_PHASE ]</Link>
                    <Link href="/about" className="text-[var(--terminal-accent)] cursor-default">[ SYSTEM_MANUAL ]</Link>
                </div>
            </header>

            <main className="w-full max-w-5xl mx-auto p-8 md:p-16 flex flex-col gap-24">

                <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="border border-[var(--terminal-border)] p-6 bg-[var(--terminal-surface)]">
                        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 text-[var(--terminal-accent)]">SYSTEM_MANUAL_v1.0</h1>

                        <div className="space-y-8 font-mono">

                            {/* PROTOCOL PURPOSE */}
                            <div className="space-y-2">
                                <span className="text-xs font-bold bg-[var(--terminal-text)] text-[var(--terminal-bg)] px-2 py-1">[ PROTOCOL_PURPOSE ]</span>
                                <p className="text-sm leading-relaxed opacity-90 border-l-2 border-[var(--terminal-accent)] pl-4">
                                    To transform raw input into high-fidelity prompting structures. AgentOS implements Chain-of-Thought (CoT) pre-processing to expand simple human intent into robust engineering specifications suitable for advanced LLMs.
                                </p>
                            </div>

                            {/* OPERATIONAL MODES */}
                            <div className="space-y-4">
                                <span className="text-xs font-bold bg-[var(--terminal-text)] text-[var(--terminal-bg)] px-2 py-1">[ OPERATIONAL_MODES ]</span>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="border border-[var(--terminal-border)] p-4">
                                        <Zap className="mb-2 text-[var(--terminal-accent)]" />
                                        <h3 className="font-bold uppercase text-xs mb-1">Fast Search</h3>
                                        <p className="text-[10px] opacity-70">Direct, 1-shot template expansion for simple tasks.</p>
                                    </div>
                                    <div className="border border-[var(--terminal-border)] p-4">
                                        <Terminal className="mb-2 text-[var(--terminal-accent)]" />
                                        <h3 className="font-bold uppercase text-xs mb-1">General Prompt</h3>
                                        <p className="text-[10px] opacity-70">Universal prompt enhancer not focused on web search.</p>
                                    </div>
                                    <div className="border border-[var(--terminal-border)] p-4">
                                        <Hammer className="mb-2 text-[var(--terminal-accent)]" />
                                        <h3 className="font-bold uppercase text-xs mb-1">Builder Mode</h3>
                                        <p className="text-[10px] opacity-70">Comprehensive, interactive interrogation flow.</p>
                                    </div>
                                    <div className="border border-[var(--terminal-border)] p-4">
                                        <Brain className="mb-2 text-[var(--terminal-accent)]" />
                                        <h3 className="font-bold uppercase text-xs mb-1">Thinking Mode</h3>
                                        <p className="text-[10px] opacity-70">Deep reasoning using Tree-of-Thoughts (ToT).</p>
                                    </div>
                                </div>
                            </div>

                            {/* OPERATION */}
                            <div className="space-y-2">
                                <span className="text-xs font-bold bg-[var(--terminal-text)] text-[var(--terminal-bg)] px-2 py-1">[ USAGE_INSTRUCTIONS ]</span>
                                <ul className="text-sm space-y-2 list-decimal list-inside opacity-90 border-l-2 border-[var(--terminal-accent)] pl-4">
                                    <li>Select Operational Mode via the Terminal Interface.</li>
                                    <li>Input logic parameters (your objective) into the text field.</li>
                                    <li>Execute the generation sequence.</li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </section>

            </main>

            <footer className="p-4 border-t-2 border-[var(--terminal-border)] bg-[var(--terminal-bg)] text-[9px] uppercase tracking-widest flex justify-between font-bold text-[var(--terminal-dim)] sticky bottom-0 z-50">
                <div>MANUAL_VERSION: 1.0.0</div>
                <div>(C) AGENT_OS INC</div>
            </footer>

        </div>
    );
}
