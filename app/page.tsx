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
  Copy,
  Check
} from 'lucide-react';

type Mode = 'fast' | 'thinking' | 'builder' | 'general';

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
  const [questionMode, setQuestionMode] = useState<Mode | null>(null);
  const [answerValidationError, setAnswerValidationError] = useState('');

  const handleReset = () => {
    setTask('');
    setResult(null);
    setQuestions([]);
    setAnswers({});
    setBuilderStep('initial');
    setQuestionMode(null);
    setMode('fast');
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setResult(null);
    setQuestions([]);
    setAnswers({});
    setAnswerValidationError('');
    setBuilderStep('initial');
    setQuestionMode(null);
  };

  const generate = async (currentAnswers?: Record<string, string>) => {
    // Use same-origin API route to avoid browser CORS issues.
    const apiUrl = '/api/generate';
    console.log("Using API:", apiUrl);

    if (!task) return;
    setLoading(true);
    setResult(null);

    const payload: any = {
      task: task,
      mode: mode,
    };

    if ((mode === 'builder' || mode === 'general') && currentAnswers) {
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

        if (status === 'needs_input') {
          const questions = data.questions || data.data?.questions || [];
          setQuestions(questions);
          setAnswerValidationError('');
          setBuilderStep('questions');
          setQuestionMode(mode);
        } else {
          const resultData = data.data || data;
          setResult(resultData);
          setBuilderStep('initial');
          setQuestionMode(null);
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
    const hasAtLeastOneAnswer = questions.some((q) => Boolean(answers[q]?.trim()));
    if (!hasAtLeastOneAnswer) {
      setAnswerValidationError('Please answer at least one question before continuing.');
      return;
    }

    setAnswerValidationError('');
    generate(answers);
  };

  const handleAnswerChange = (question: string, value: string) => {
    if (answerValidationError) {
      setAnswerValidationError('');
    }

    setAnswers(prev => ({
      ...prev,
      [question]: value
    }));
  };

  const hasAtLeastOneAnswer =
    questions.length > 0 && questions.some((q) => Boolean(answers[q]?.trim()));

  const copyToClipboard = () => {
    if (result?.final_prompt) {
      navigator.clipboard.writeText(result.final_prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--terminal-bg)] text-[var(--terminal-text)] transition-colors duration-300">
      <header className="sticky top-0 z-50 border-b border-[var(--terminal-border)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div onClick={handleReset} className="flex cursor-pointer items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[var(--terminal-accent)] text-white">
              <Cpu size={18} />
            </div>
            <span className="text-xl font-extrabold tracking-tight">AgentOS</span>
          </div>
          <div className="hidden gap-6 text-sm md:flex">
            <Link href="/" className="text-[var(--terminal-accent)]">Discovery</Link>
            <Link href="/about" className="text-[var(--terminal-dim)] hover:text-[var(--terminal-text)]">System Manual</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8">
          <section>
            <div className="rounded-2xl border border-[var(--terminal-border)] bg-[var(--terminal-surface)] p-6 md:p-8">

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
                    <div className="space-y-4">
                      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                        Select Operational Mode
                      </h2>
                      <p className="text-[var(--terminal-dim)] text-sm border-l-2 border-[var(--terminal-accent)] pl-3">
                        Define the architectural strategy for this session.
                      </p>
                    </div>

                    {/* Mode Cards */}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                      {/* FAST */}
                      <label className="group relative cursor-pointer">
                        <input
                          type="radio"
                          name="mode"
                          className="peer sr-only"
                          checked={mode === 'fast'}
                          onChange={() => handleModeChange('fast')}
                        />
                        <div className="h-full rounded-xl border border-[var(--terminal-border)] p-5 transition-all duration-75 hover:border-[var(--terminal-accent)] peer-checked:border-slate-700 peer-checked:bg-white peer-checked:shadow-sm">
                          <div className="mb-4 h-10 w-10 rounded-lg border border-[var(--terminal-border)] flex items-center justify-center text-[var(--terminal-dim)]">
                            <Zap />
                          </div>
                          <h3 className="mb-1 text-lg font-semibold text-slate-900">Fast Mode</h3>
                          <p className="text-sm text-slate-600">Rapid 1-shot template expansion.</p>
                        </div>
                      </label>

                      {/* GENERAL */}
                      <label className="group relative cursor-pointer">
                        <input
                          type="radio"
                          name="mode"
                          className="peer sr-only"
                          checked={mode === 'general'}
                          onChange={() => handleModeChange('general')}
                        />
                        <div className="h-full rounded-xl border border-[var(--terminal-border)] p-5 transition-all duration-75 hover:border-[var(--terminal-accent)] peer-checked:border-slate-700 peer-checked:bg-white peer-checked:shadow-sm">
                          <div className="mb-4 h-10 w-10 rounded-lg border border-[var(--terminal-border)] flex items-center justify-center text-[var(--terminal-dim)]">
                            <Cpu />
                          </div>
                          <h3 className="mb-1 text-lg font-semibold text-slate-900">General Prompt</h3>
                          <p className="text-sm text-slate-600">Universal non-web-search prompt enhancer.</p>
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
                        <div className="h-full rounded-xl border border-[var(--terminal-border)] p-5 transition-all duration-75 hover:border-[var(--terminal-accent)] peer-checked:border-slate-700 peer-checked:bg-white peer-checked:shadow-sm">
                          <div className="mb-4 h-10 w-10 rounded-lg border border-[var(--terminal-border)] flex items-center justify-center text-[var(--terminal-dim)]">
                            <Hammer />
                          </div>
                          <h3 className="mb-1 text-lg font-semibold text-slate-900">Builder Mode</h3>
                          <p className="text-sm text-slate-600">Deep interactive requirement analysis.</p>
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
                        <div className="h-full rounded-xl border border-[var(--terminal-border)] p-5 transition-all duration-75 hover:border-[var(--terminal-accent)] peer-checked:border-slate-700 peer-checked:bg-white peer-checked:shadow-sm">
                          <div className="mb-4 h-10 w-10 rounded-lg border border-[var(--terminal-border)] flex items-center justify-center text-[var(--terminal-dim)]">
                            <Brain />
                          </div>
                          <h3 className="mb-1 text-lg font-semibold text-slate-900">Thinking Mode</h3>
                          <p className="text-sm text-slate-600">Multi-branch strategic reasoning (ToT).</p>
                        </div>
                      </label>
                    </div>

                    {/* Input Task */}
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-[var(--terminal-dim)] ml-1">Input</label>
                      <textarea
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-[var(--terminal-border)] bg-[var(--terminal-bg)] px-6 py-6 text-[var(--terminal-text)] focus:border-[var(--terminal-accent)] focus:ring-0 placeholder-[var(--terminal-dim)] text-base transition-all resize-none"
                        placeholder={
                          mode === 'fast' ? "Enter simple intent (e.g. 'Best gym London')..." :
                            mode === 'general' ? "Enter your raw idea (any topic) to build a power prompt..." :
                              mode === 'thinking' ? "Enter complex strategic problem..." :
                                "Enter vague objective for refinement..."
                        }
                      />
                    </div>

                    {/* Generate Button */}
                    <div className="flex items-center gap-4 pt-8 border-t border-[var(--terminal-border)]">
                      <button
                        onClick={() => generate()}
                        disabled={loading || !task}
                        className={`flex-[2] rounded-xl bg-[var(--terminal-accent)] p-3.5 text-white font-semibold text-base hover:opacity-90 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {loading ? 'Processing...' : 'Generate'}
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
                      <h2 className="text-3xl font-black uppercase tracking-tighter">
                        {questionMode === 'general' ? 'General Mode Clarification' : 'Requirement Analysis'}
                      </h2>
                    </div>

                    <div className="space-y-6">
                      {questions.map((q, idx) => (
                        <div key={idx} className="space-y-2">
                          <label className="text-xs text-[var(--terminal-accent)] font-semibold">Question {idx + 1}</label>
                          <p className="font-bold text-lg mb-2">{q}</p>
                          <input
                            type="text"
                            value={answers[q] || ''}
                            className="w-full rounded-lg border border-[var(--terminal-border)] bg-[var(--terminal-bg)] p-3 focus:border-[var(--terminal-accent)] transition-colors outline-none"
                            onChange={(e) => handleAnswerChange(q, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>

                    {answerValidationError && (
                      <p className="text-sm text-red-600 font-medium">{answerValidationError}</p>
                    )}

                    <button
                      onClick={handleBuilderSubmit}
                      disabled={loading || !hasAtLeastOneAnswer}
                      className={`w-full rounded-xl bg-[var(--terminal-accent)] text-white p-3.5 font-semibold transition-colors ${(loading || !hasAtLeastOneAnswer) ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}`}
                    >
                      {loading ? 'Synthesizing...' : questionMode === 'general' ? 'Continue_General_Mode' : 'Submit_Parameters_'}
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
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--terminal-border)] pb-4">
                      <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-[var(--terminal-accent)]">Generated Output</h2>
                      <div className="flex gap-4 w-full md:w-auto justify-end">
                        <button
                          onClick={() => setResult(null)}
                          className="text-xs font-medium text-[var(--terminal-dim)] hover:text-[var(--terminal-text)]"
                        >
                          Reset
                        </button>
                        <button
                          onClick={copyToClipboard}
                          className={`flex items-center gap-2 text-xs font-medium bg-[var(--terminal-bg)] px-4 py-2 border rounded-lg transition-all ${copied
                            ? 'border-[#00f5d4] text-[#00f5d4]'
                            : 'border-[var(--terminal-border)] hover:border-[var(--terminal-accent)] text-[var(--terminal-text)]'
                            }`}
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                          {copied ? 'Copied' : 'Copy prompt'}
                        </button>
                      </div>
                    </div>

                    {/* Output Container */}
                    <div className="bg-[var(--terminal-bg)] rounded-xl border border-[var(--terminal-border)] p-6 md:p-8 relative overflow-hidden">

                      {/* Thinking Mode Specifics */}
                      {mode === 'thinking' && result.diagnosis && (
                        <div className="mb-8 space-y-4 border-b border-[var(--terminal-border)] pb-8">
                          <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-r-lg">
                            <h4 className="text-red-500 font-bold uppercase text-xs mb-2">Diagnostic_Protocol</h4>
                            <p className="text-sm">{result.diagnosis}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {result.reframes?.map((ref: string, i: number) => (
                              <div key={i} className="bg-white p-4 rounded-lg border border-[var(--terminal-border)]">
                                <span className="text-[var(--terminal-accent)] text-xs font-bold block mb-2">Option_0{i + 1}</span>
                                <p className="text-xs">{ref}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Main Markdown Output */}
                      <div className="prose prose-p:font-sans max-w-none">
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

      <footer className="mt-10 border-t border-[var(--terminal-border)] py-8 text-xs text-[var(--terminal-dim)]">
        <div className="mx-auto flex max-w-7xl justify-between px-4 sm:px-6 lg:px-8">
          <div>AgentOS Interface</div>
          <div>Reference2 inspired layout</div>
        </div>
      </footer>
    </div>
  );
}
