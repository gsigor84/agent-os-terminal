'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Hammer,
  Brain,
  Cpu,
  Activity,
  ArrowRight,
  ArrowUpRight,
  Copy,
  Check
} from 'lucide-react';

type Mode = 'fast' | 'thinking' | 'builder';

export default function Home() {
  const [task, setTask] = useState('');
  const [mode, setMode] = useState<Mode>('fast');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Builder Mode State
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [builderStep, setBuilderStep] = useState<'initial' | 'questions'>('initial');

  // Animation / Live States
  const [latency, setLatency] = useState('1.2ms');
  const [efficiency, setEfficiency] = useState(0);

  // Simulating "Live" System Latency
  useEffect(() => {
    const interval = setInterval(() => {
      const val = (1.0 + Math.random() * 0.5).toFixed(1);
      setLatency(`${val}ms`);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Animate Efficiency Number on Mount
  useEffect(() => {
    let start = 0;
    const end = 99.9;
    const duration = 1500;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setEfficiency(end);
        clearInterval(timer);
      } else {
        setEfficiency(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, []);

  const handleReset = () => {
    setTask('');
    setResult(null);
    setQuestions([]);
    setAnswers({});
    setBuilderStep('initial');
    setMode('fast');
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setResult(null);
    setQuestions([]);
    setAnswers({});
    setBuilderStep('initial');
  };

  const generate = async (currentAnswers?: Record<string, string>) => {
    // FORCE API CONNECTION DEBUG
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api-nnahwgx2jq-uc.a.run.app";
    console.log("Using API:", apiUrl);

    if (!task) return;
    setLoading(true);
    setResult(null);

    const payload: any = {
      task: task,
      mode: mode,
    };

    if (mode === 'builder' && currentAnswers) {
      payload.context_answers = { previous_answers: currentAnswers };
    }

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("API Response:", data);

      if (res.ok) {
        const status = data.status || data.data?.status;

        if (mode === 'builder' && status === 'needs_input') {
          const questions = data.questions || data.data?.questions || [];
          setQuestions(questions);
          setBuilderStep('questions');
        } else {
          const resultData = data.data || data;
          setResult(resultData);
          if (mode === 'builder') setBuilderStep('initial');
        }
      } else {
        console.error('Error:', data);
        alert('Failed to process request');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleBuilderSubmit = () => {
    generate(answers);
  };

  const handleAnswerChange = (question: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [question]: value
    }));
  };

  const copyToClipboard = () => {
    if (result?.final_prompt) {
      navigator.clipboard.writeText(result.final_prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--terminal-bg)] text-[var(--terminal-text)] font-mono selection:bg-[var(--terminal-accent)] selection:text-[var(--terminal-bg)] overflow-x-hidden">

      {/* Header */}
      <header className="border-b-4 border-[var(--terminal-text)] p-6 sticky top-0 bg-[var(--terminal-bg)] z-50 flex justify-between items-center whitespace-nowrap overflow-x-auto">
        <div onClick={handleReset} className="flex items-center gap-4 cursor-pointer group">
          <div className="w-10 h-10 brutalist-border bg-[var(--terminal-accent)] flex items-center justify-center group-hover:bg-[var(--terminal-text)] transition-colors">
            <Cpu className="text-[var(--terminal-bg)] group-hover:text-[var(--terminal-bg)]" />
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tighter uppercase block leading-none group-hover:text-[var(--terminal-accent)] transition-colors">AgentOS_v2.0</span>
            <span className="block text-[10px] text-[var(--terminal-dim)] flex items-center gap-2">
              SYSTEM_STATUS: OPERATIONAL
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </span>
          </div>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest">
          <Link href="/" className="text-[var(--terminal-accent)] cursor-default">[ DISCOVERY_PHASE ]</Link>
          <Link href="/about" className="text-[var(--terminal-dim)] hover:text-[var(--terminal-text)] transition-colors opacity-40 hover:opacity-100">[ SYSTEM_MANUAL ]</Link>
        </div>
      </header>

      <main className="w-full flex flex-col">
        {/* Background Number */}
        <div className="fixed top-24 right-6 pointer-events-none select-none opacity-5">
          <span className="text-[40vh] font-black leading-none tracking-tighter text-[var(--terminal-text)]">01</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 w-full min-h-[calc(100vh-100px)]">

          {/* Sidebar */}
          <aside className="lg:col-span-4 border-r-2 border-[var(--terminal-text)] p-8 flex flex-col gap-12 bg-[var(--terminal-surface)]/60 backdrop-blur-sm lg:sticky lg:top-[100px] lg:h-[calc(100vh-100px)]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <span className="inline-block bg-[var(--terminal-text)] text-[var(--terminal-bg)] px-2 py-1 text-xs font-bold uppercase">Meta_Data</span>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--terminal-dim)]">Discovery Phase</h4>
              <h1 className="text-5xl font-black uppercase tracking-tighter leading-none italic">
                <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>Initialize</motion.span> <br />
                <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>your</motion.span> <br />
                <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-[var(--terminal-accent)]">Protocol.</motion.span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="brutalist-border p-6 bg-transparent accent-shadow"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 brutalist-border flex items-center justify-center">
                  <Brain className="text-3xl" />
                </div>
                <ArrowUpRight className="text-[var(--terminal-accent)]" />
              </div>
              <h2 className="text-7xl font-black mb-2 tracking-tighter tabular-nums">
                {efficiency.toFixed(1)}%
              </h2>
              <p className="text-xs uppercase leading-relaxed text-[var(--terminal-dim)]">
                Probability of successful prompt generation with current context parameters.
              </p>
              <div className="mt-6 h-1 w-full bg-[var(--terminal-border)] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "99%" }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-[var(--terminal-accent)]"
                ></motion.div>
              </div>
            </motion.div>

            <div className="brutalist-border-dim p-4 flex items-center gap-6">
              <div className="w-10 h-10 brutalist-border-dim flex items-center justify-center text-[var(--terminal-accent)]">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Activity />
                </motion.div>
              </div>
              <div>
                <div className="text-xl font-bold tracking-tighter tabular-nums">{latency}</div>
                <div className="text-[10px] text-[var(--terminal-dim)] uppercase font-bold tracking-wider italic">Latency_Check</div>
              </div>
            </div>

            <div className="mt-auto pt-12">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--terminal-dim)]">Expert_Team_Live_24.7</p>
            </div>
          </aside>

          {/* Main Content */}
          <section className="lg:col-span-8 p-8 md:p-16 flex flex-col">
            <div className="max-w-4xl mx-auto w-full relative">

              {/* Agent Badge - Refined ID Card Style */}
              <div className="hidden md:flex absolute -top-16 right-0 border border-[var(--terminal-border)] bg-[var(--terminal-bg)] items-center shadow-lg">
                <div className="flex items-center px-4 py-2 gap-3 border-r border-[var(--terminal-border)] bg-[var(--terminal-surface)]">
                  <div className="w-8 h-8 brutalist-border-dim bg-[var(--terminal-bg)] flex items-center justify-center text-[var(--terminal-dim)] text-[10px] font-bold">
                    AG
                  </div>
                </div>
                <div className="px-4 py-2 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-[10px] font-bold text-[var(--terminal-accent)] uppercase tracking-wider">Agent #409</p>
                  </div>
                  <p className="text-[9px] text-[var(--terminal-dim)] uppercase tracking-tight">Protocol_Active</p>
                </div>
              </div>

              {/* Form Section */}
              <AnimatePresence mode="wait">
                {builderStep === 'initial' && !result && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-12"
                  >
                    <div className="flex gap-1">
                      <div className="h-6 w-12 bg-[var(--terminal-text)]"></div>
                      <div className="h-6 w-12 border border-[var(--terminal-border)]"></div>
                      <div className="h-6 w-12 border border-[var(--terminal-border)]"></div>
                      <div className="ml-4 text-xs font-bold flex items-center uppercase tracking-tighter">Step_01/03</div>
                    </div>

                    <div className="space-y-6">
                      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9]">
                        Select Operational Mode
                      </h2>
                      <p className="text-[var(--terminal-dim)] font-bold uppercase text-sm border-l-4 border-[var(--terminal-accent)] pl-4">
                        Define the architectural strategy for this session.
                      </p>
                    </div>

                    {/* Mode Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--terminal-text)] border-2 border-[var(--terminal-text)]">

                      {/* FAST */}
                      <label className="group relative cursor-pointer">
                        <input
                          type="radio"
                          name="mode"
                          className="peer sr-only"
                          checked={mode === 'fast'}
                          onChange={() => handleModeChange('fast')}
                        />
                        <div className="h-full p-8 bg-[var(--terminal-bg)] transition-all duration-75 hover:bg-[var(--terminal-surface)] peer-checked:bg-[var(--terminal-accent)] peer-checked:text-[var(--terminal-bg)]">
                          <div className="mb-6 w-12 h-12 brutalist-border-dim flex items-center justify-center group-hover:bg-[var(--terminal-text)] group-hover:text-[var(--terminal-bg)] transition-colors">
                            <Zap />
                          </div>
                          <h3 className="font-black text-xl uppercase tracking-tighter mb-2">Fast Mode</h3>
                          <p className="text-xs opacity-80 leading-relaxed font-bold">Rapid 1-shot template expansion.</p>
                        </div>
                      </label>

                      {/* BUILDER */}
                      <label className="group relative cursor-pointer">
                        <input
                          type="radio"
                          name="mode"
                          className="peer sr-only"
                          checked={mode === 'builder'}
                          onChange={() => handleModeChange('builder')}
                        />
                        <div className="h-full p-8 bg-[var(--terminal-bg)] transition-all duration-75 hover:bg-[var(--terminal-surface)] peer-checked:bg-[var(--terminal-accent)] peer-checked:text-[var(--terminal-bg)]">
                          <div className="mb-6 w-12 h-12 brutalist-border-dim flex items-center justify-center group-hover:bg-[var(--terminal-text)] group-hover:text-[var(--terminal-bg)] transition-colors">
                            <Hammer />
                          </div>
                          <h3 className="font-black text-xl uppercase tracking-tighter mb-2">Builder Mode</h3>
                          <p className="text-xs opacity-80 leading-relaxed font-bold">Deep interactive requirement analysis.</p>
                        </div>
                      </label>

                      {/* THINKING */}
                      <label className="group relative cursor-pointer">
                        <input
                          type="radio"
                          name="mode"
                          className="peer sr-only"
                          checked={mode === 'thinking'}
                          onChange={() => handleModeChange('thinking')}
                        />
                        <div className="h-full p-8 bg-[var(--terminal-bg)] transition-all duration-75 hover:bg-[var(--terminal-surface)] peer-checked:bg-[var(--terminal-accent)] peer-checked:text-[var(--terminal-bg)]">
                          <div className="mb-6 w-12 h-12 brutalist-border-dim flex items-center justify-center group-hover:bg-[var(--terminal-text)] group-hover:text-[var(--terminal-bg)] transition-colors">
                            <Brain />
                          </div>
                          <h3 className="font-black text-xl uppercase tracking-tighter mb-2">Thinking Mode</h3>
                          <p className="text-xs opacity-80 leading-relaxed font-bold">Multi-branch strategic reasoning (ToT).</p>
                        </div>
                      </label>
                    </div>

                    {/* Input Task */}
                    <div className="space-y-4">
                      <label className="block text-xs font-bold uppercase tracking-widest text-[var(--terminal-dim)] ml-1">Input_Parameters_</label>
                      <textarea
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        rows={4}
                        className="w-full bg-[var(--terminal-bg)] brutalist-border text-[var(--terminal-text)] px-6 py-6 border-2 focus:ring-0 focus:border-[var(--terminal-accent)] placeholder-[var(--terminal-dim)] font-bold text-lg uppercase tracking-tight transition-all resize-none"
                        placeholder={
                          mode === 'fast' ? "Enter simple intent (e.g. 'Best gym London')..." :
                            mode === 'thinking' ? "Enter complex strategic problem..." :
                              "Enter vague objective for refinement..."
                        }
                      />
                    </div>

                    {/* Generate Button */}
                    <div className="flex items-center gap-4 pt-12 border-t-2 border-[var(--terminal-border)]">
                      <button
                        onClick={() => generate()}
                        disabled={loading || !task}
                        className={`flex-[2] bg-[var(--terminal-accent)] brutalist-border border-[var(--terminal-accent)] p-5 text-[var(--terminal-bg)] font-black text-xl uppercase tracking-tighter hover:bg-[var(--terminal-text)] hover:text-[var(--terminal-bg)] hover:border-[var(--terminal-text)] transition-all white-shadow flex items-center justify-center gap-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {loading ? 'Processing...' : 'Execute_Generation'}
                        {!loading && <ArrowRight className="font-black" />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Builder Questions State */}
              <AnimatePresence>
                {builderStep === 'questions' && (
                  <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-6 w-12 bg-[var(--terminal-text)]"></div>
                      <div className="h-6 w-12 bg-[var(--terminal-text)]"></div>
                      <div className="h-6 w-12 border border-[var(--terminal-border)]"></div>
                      <h2 className="text-3xl font-black uppercase tracking-tighter">Requirement Analysis</h2>
                    </div>

                    <div className="space-y-6">
                      {questions.map((q, idx) => (
                        <div key={idx} className="space-y-2">
                          <label className="text-xs text-[var(--terminal-accent)] uppercase font-bold tracking-widest">Query_0{idx + 1}</label>
                          <p className="font-bold text-lg mb-2">{q}</p>
                          <input
                            type="text"
                            className="w-full bg-[var(--terminal-surface)] border-b-2 border-[var(--terminal-border)] p-3 focus:border-[var(--terminal-accent)] transition-colors outline-none font-mono"
                            onChange={(e) => handleAnswerChange(q, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleBuilderSubmit}
                      disabled={loading}
                      className="w-full bg-[var(--terminal-text)] text-[var(--terminal-bg)] p-4 font-black uppercase tracking-tighter hover:bg-[var(--terminal-accent)] transition-colors"
                    >
                      {loading ? 'Synthesizing...' : 'Submit_Parameters_'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Result State */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-[var(--terminal-border)] pb-4">
                      <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-[var(--terminal-accent)]">Output_Generated</h2>
                      <div className="flex gap-4 w-full md:w-auto justify-end">
                        <button
                          onClick={() => setResult(null)}
                          className="text-xs uppercase font-bold text-[var(--terminal-dim)] hover:text-[var(--terminal-text)]"
                        >
                          Reset_System
                        </button>
                        <button
                          onClick={copyToClipboard}
                          className={`flex items-center gap-2 text-xs uppercase font-bold bg-[var(--terminal-surface)] px-4 py-2 border-2 transition-all ${copied
                              ? 'border-[#00f5d4] text-[#00f5d4]'
                              : 'border-[var(--terminal-border)] hover:border-[var(--terminal-accent)] text-[var(--terminal-text)]'
                            }`}
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                          {copied ? '[ COPIED! ]' : '[ COPY_PROMPT ]'}
                        </button>
                      </div>
                    </div>

                    {/* Output Container */}
                    <div className="bg-[var(--terminal-surface)] brutalist-border p-6 md:p-10 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-2 bg-[var(--terminal-accent)]"></div>
                      <div className="absolute top-0 right-0 w-2 h-2 bg-[var(--terminal-accent)]"></div>
                      <div className="absolute bottom-0 left-0 w-2 h-2 bg-[var(--terminal-accent)]"></div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-[var(--terminal-accent)]"></div>

                      {/* Thinking Mode Specifics */}
                      {mode === 'thinking' && result.diagnosis && (
                        <div className="mb-8 space-y-4 border-b border-[var(--terminal-border)] pb-8">
                          <div className="bg-red-900/20 border-l-4 border-red-500 p-4">
                            <h4 className="text-red-500 font-bold uppercase text-xs mb-2">Diagnostic_Protocol</h4>
                            <p className="text-sm">{result.diagnosis}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {result.reframes?.map((ref: string, i: number) => (
                              <div key={i} className="bg-[var(--terminal-bg)] p-4 border border-[var(--terminal-border)]">
                                <span className="text-[var(--terminal-accent)] text-xs font-bold block mb-2">Option_0{i + 1}</span>
                                <p className="text-xs">{ref}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Main Markdown Output */}
                      <div className="prose prose-invert prose-p:font-mono max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {result.final_prompt || result.tips || JSON.stringify(result, null, 2)}
                        </ReactMarkdown>
                      </div>
                    </div>

                    {/* Clarity Score Badge */}
                    {result.clarity_score && (
                      <div className="flex justify-end">
                        <span className="inline-flex items-center gap-2 bg-[var(--terminal-accent)] text-[var(--terminal-bg)] px-4 py-2 font-black uppercase text-xs">
                          Clarity_Score: {result.clarity_score}
                          <Activity size={14} />
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </section>
        </div>
      </main>

      <footer className="p-4 border-t-2 border-[var(--terminal-border)] bg-[var(--terminal-bg)] text-[9px] uppercase tracking-widest flex justify-between font-bold text-[var(--terminal-dim)]">
        <div>SYS_TERMINAL_ID: 8823-XQ</div>
        <div>(C) AGENT_OS PERIPHERAL UNIT 2026</div>
        <div className="flex gap-4">
          <span className="text-[var(--terminal-accent)]">PING: 12ms</span>
          <span className="text-[var(--terminal-text)] opacity-80">ENCRYPTION: AES-256</span>
        </div>
      </footer>
    </div>
  );
}
