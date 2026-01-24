'use client';

import Link from 'next/link';
import { Cpu, ArrowLeft, Terminal, Hammer, Brain, Zap } from 'lucide-react';
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
                    <Link href="/" className="text-[var(--terminal-dim)] hover:text-[var(--terminal-text)] transition-colors opacity-60 hover:opacity-100">[ DISCOVERY_PHASE ]</Link>
                    <Link href="/about" className="text-[var(--terminal-accent)] cursor-default">[ SYSTEM_MANUAL ]</Link>
                </div>
            </header>

            <main className="w-full max-w-5xl mx-auto p-8 md:p-16 flex flex-col gap-24">

                {/* 01 PURPOSE */}
                <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex gap-4 items-center mb-12">
                        <span className="text-[var(--terminal-accent)] text-6xl font-black opacity-20">01</span>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            System_Purpose
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="brutalist-border p-8 bg-[var(--terminal-surface)]">
                            <Terminal className="w-12 h-12 mb-6 text-[var(--terminal-accent)]" />
                            <p className="text-lg font-bold leading-relaxed">
                                AgentOS is a <span className="text-[var(--terminal-accent)]">Meta-Prompting Engine</span> designed to architect high-fidelity prompts from vague human intent.
                            </p>
                        </div>
                        <div className="space-y-6 text-sm font-bold opacity-80 leading-relaxed">
                            <p>
                                Most LLM interactions fail due to lack of context and structural guidance. AgentOS solves this by implementing a "Chain-of-Thought" (CoT) pre-processor that expands your simple request into a robust engineering specification before the AI even begins its main task.
                            </p>
                            <p>
                                It behaves like a Senior Engineer pairing with you—asking the right questions, checking edge cases, and formatting the output for machine optimality.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 02 MODES */}
                <section className="space-y-8">
                    <div className="flex gap-4 items-center mb-12">
                        <span className="text-[var(--terminal-accent)] text-6xl font-black opacity-20">02</span>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            Operational_Modes
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--terminal-text)] border-2 border-[var(--terminal-text)]">
                        {/* FAST */}
                        <div className="p-8 bg-[var(--terminal-bg)]">
                            <div className="mb-6 w-12 h-12 brutalist-border-dim flex items-center justify-center text-[var(--terminal-accent)]">
                                <Zap />
                            </div>
                            <h3 className="font-black text-xl uppercase tracking-tighter mb-2">Fast Mode</h3>
                            <p className="text-xs opacity-70 leading-relaxed font-bold">
                                For quick tasks. Best for "Rewrite this email" or "Fix this regex". Uses a standard 1-shot optimization template.
                            </p>
                        </div>

                        {/* BUILDER */}
                        <div className="p-8 bg-[var(--terminal-bg)]">
                            <div className="mb-6 w-12 h-12 brutalist-border-dim flex items-center justify-center text-[var(--terminal-accent)]">
                                <Hammer />
                            </div>
                            <h3 className="font-black text-xl uppercase tracking-tighter mb-2">Builder Mode</h3>
                            <p className="text-xs opacity-70 leading-relaxed font-bold">
                                Interactive interrogation. The system will pause to ask you clarifying questions (Target Audience, Constraints, Tone) before generating.
                            </p>
                        </div>

                        {/* THINKING */}
                        <div className="p-8 bg-[var(--terminal-bg)]">
                            <div className="mb-6 w-12 h-12 brutalist-border-dim flex items-center justify-center text-[var(--terminal-accent)]">
                                <Brain />
                            </div>
                            <h3 className="font-black text-xl uppercase tracking-tighter mb-2">Thinking Mode</h3>
                            <p className="text-xs opacity-70 leading-relaxed font-bold">
                                For complex logic. Uses "Tree of Thoughts" (ToT) to diagnose the request, propose 3 strategies, selecting the best one for the final prompt.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 03 HOW TO USE */}
                <section className="space-y-8 pb-24">
                    <div className="flex gap-4 items-center mb-12">
                        <span className="text-[var(--terminal-accent)] text-6xl font-black opacity-20">03</span>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            Execution_Protocol
                        </h1>
                    </div>

                    <div className="space-y-4">
                        {[
                            "Select desired Operational Mode based on task complexity.",
                            "Input raw objective (Parameters) into the terminal text field.",
                            "Click [ EXECUTE_GENERATION ] to initialize the protocol.",
                            "Review the [ OUTPUT_GENERATED ] and click [ COPY_PROMPT ] to utilize the artifact."
                        ].map((step, i) => (
                            <div key={i} className="flex items-center gap-6 p-4 border-b border-[var(--terminal-border)]">
                                <span className="font-mono text-xs font-bold text-[var(--terminal-accent)]">STEP_0{i + 1}</span>
                                <p className="font-bold uppercase text-sm md:text-base">{step}</p>
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            <footer className="p-4 border-t-2 border-[var(--terminal-border)] bg-[var(--terminal-bg)] text-[9px] uppercase tracking-widest flex justify-between font-bold text-[var(--terminal-dim)] sticky bottom-0 z-50">
                <div>MANUAL_VERSION: 2.0.4</div>
                <div>(C) AGENT_OS INC</div>
            </footer>

        </div>
    );
}
