import React, { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../../api/client';
import { BookOpen, Clock3, FileText, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, ArrowRight, Download, Check } from 'lucide-react';

type Option = { id: string; label: string; text: string };
type Question = { id: string; subject: string; topic?: string; questionText: string; questionOrder: number; sourceYear: number; sourcePaper: string; options: Option[]; selectedOptionId?: string | null };
type Attempt = { attemptId: string; status: string; startedAt: string; durationMinutes: number; questions: Question[] };
type Paper = { id: string; title: string; examYear: number; branch: string; curriculum: string; paperType: string; publicUrl?: string; sourceName?: string; attribution?: string };

export const PyqStudentPanel: React.FC = () => {
  const [view, setView] = useState<'home'|'exam'|'result'>('home');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [attempt, setAttempt] = useState<Attempt|null>(null);
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(180*60);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [paletteSubject, setPaletteSubject] = useState<string>('ALL');

  useEffect(() => {
    Promise.all([
      apiRequest<Paper[]>('/api/v1/pyq/papers'),
      apiRequest<any>('/api/v1/pyq/attempts/current')
    ]).then(([paperData, current]) => {
      setPapers(paperData);
      if (current?.active) {
        setAttempt(current as Attempt);
        setView('exam');
      }
    }).catch(e => setError(e.message || 'Could not load the PYQ section.')).finally(() => setBusy(false));
  }, []);

  useEffect(() => {
    if (view !== 'exam' || !attempt) return;
    const tick = () => {
      const elapsed = Math.floor((Date.now() - new Date(attempt.startedAt).getTime()) / 1000);
      setSecondsLeft(Math.max(0, attempt.durationMinutes * 60 - elapsed));
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [view, attempt]);

  const current = attempt?.questions[index];
  const answered = useMemo(() => attempt?.questions.filter(q => q.selectedOptionId).length ?? 0, [attempt]);
  const formatTime = (n: number) => {
    const h = Math.floor(n / 3600);
    const m = Math.floor((n % 3600) / 60);
    const s = n % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const start = async () => {
    setBusy(true);
    setError('');
    try {
      const data = await apiRequest<Attempt>('/api/v1/pyq/attempts', { method: 'POST' });
      setAttempt(data);
      setIndex(0);
      setView('exam');
    } catch (e: any) {
      setError(e.message || 'Unable to start the PYQ Challenge.');
    } finally {
      setBusy(false);
    }
  };

  const choose = async (optionId: string) => {
    if (!attempt || !current || busy) return;
    setBusy(true);
    try {
      await apiRequest(`/api/v1/pyq/attempts/${attempt.attemptId}/answers/${current.id}`, {
        method: 'PUT',
        body: JSON.stringify({ optionId })
      });
      setAttempt(prev => prev ? ({
        ...prev,
        questions: prev.questions.map(q => q.id === current.id ? { ...q, selectedOptionId: optionId } : q)
      }) : prev);
    } catch (e: any) {
      setError(e.message || 'Could not save this answer.');
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (!attempt || busy) return;
    if (!window.confirm(`Submit your PYQ Challenge? You have answered ${answered} of ${attempt.questions.length} questions.`)) return;
    setBusy(true);
    setError('');
    try {
      const data = await apiRequest('/api/v1/pyq/attempts/' + attempt.attemptId + '/submit', { method: 'POST' });
      setResult(data);
      setView('result');
    } catch (e: any) {
      setError(e.message || 'Unable to submit the exam.');
    } finally {
      setBusy(false);
    }
  };

  // Filter questions for the palette
  const filteredPaletteQuestions = useMemo(() => {
    if (!attempt) return [];
    if (paletteSubject === 'ALL') {
      return attempt.questions.map((q, i) => ({ q, originalIndex: i }));
    }
    return attempt.questions
      .map((q, i) => ({ q, originalIndex: i }))
      .filter(item => item.q.subject === paletteSubject);
  }, [attempt, paletteSubject]);

  if (view === 'exam' && attempt && current) {
    const isWarningTime = secondsLeft < 600; // < 10 mins
    const progressPercent = Math.round((answered / attempt.questions.length) * 100);

    return (
      <section className="space-y-4">
        {/* Exam Header Bar */}
        <div className="glass-card rounded-3xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800">
                Full Mock Exam
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                PYQ Challenge · 200 Questions
              </h2>
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 font-medium">
              <span>{answered} of {attempt.questions.length} Answered ({progressPercent}%)</span>
              <span>•</span>
              <span>{attempt.questions.length - answered} Remaining</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl font-bold text-base sm:text-lg tabular-nums border shadow-xs ${
              isWarningTime
                ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                : 'bg-indigo-50/80 text-indigo-700 border-indigo-200/60'
            }`}>
              <Clock3 className="w-5 h-5 shrink-0" />
              <span>{formatTime(secondsLeft)}</span>
            </div>

            <button
              onClick={submit}
              disabled={busy}
              className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              Finish & Submit
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1.5 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-4 items-start">
          {/* Main Question View */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 min-h-[440px] flex flex-col justify-between border border-slate-200/80">
            <div>
              {/* Question metadata badge bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-5 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    current.subject === 'DCME' ? 'bg-blue-100 text-blue-800' :
                    current.subject === 'MATHEMATICS' ? 'bg-amber-100 text-amber-800' :
                    current.subject === 'PHYSICS' ? 'bg-cyan-100 text-cyan-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {current.subject}
                  </span>
                  {current.topic && (
                    <span className="text-slate-500 font-medium truncate max-w-[200px]">
                      {current.topic}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <span className="bg-slate-100 px-2.5 py-0.5 rounded-md font-bold text-slate-700">
                    Question {index + 1} of {attempt.questions.length}
                  </span>
                  <span>AP ECET {current.sourceYear}</span>
                </div>
              </div>

              {/* Question text */}
              <h3 className="text-base sm:text-xl font-semibold leading-relaxed text-slate-900 mb-7 font-heading">
                {current.questionText}
              </h3>

              {/* Option buttons */}
              <div className="space-y-3">
                {current.options.map(o => {
                  const isSelected = current.selectedOptionId === o.id;
                  return (
                    <button
                      key={o.id}
                      disabled={busy}
                      onClick={() => choose(o.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3.5 cursor-pointer min-h-14 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold shadow-xs ring-2 ring-indigo-500/20'
                          : 'border-slate-200/90 bg-white hover:border-indigo-200 hover:bg-slate-50/70 text-slate-700'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {o.label}
                      </span>
                      <span className="text-sm leading-relaxed flex-1">{o.text}</span>
                      {isSelected && (
                        <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Question Navigation Controls */}
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100 gap-3">
              <button
                disabled={index === 0}
                onClick={() => setIndex(v => v - 1)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                disabled={index === attempt.questions.length - 1}
                onClick={() => setIndex(v => v + 1)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white disabled:opacity-40 text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-xs"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Palette Sidebar */}
          <aside className="glass-card rounded-3xl p-5 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 font-heading text-sm">
                Question Palette
              </h3>
              <span className="text-xs font-bold text-slate-400">
                200 Qs
              </span>
            </div>

            {/* Subject Filter Pills */}
            <div className="flex flex-wrap gap-1 text-[11px] font-bold pb-2 border-b border-slate-100">
              {['ALL', 'DCME', 'MATHEMATICS', 'PHYSICS', 'CHEMISTRY'].map(sub => (
                <button
                  key={sub}
                  onClick={() => setPaletteSubject(sub)}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    paletteSubject === sub
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sub === 'ALL' ? 'All (200)' :
                   sub === 'DCME' ? 'DCME (100)' :
                   sub === 'MATHEMATICS' ? 'Math (50)' :
                   sub === 'PHYSICS' ? 'Phys (25)' : 'Chem (25)'}
                </button>
              ))}
            </div>

            {/* Number grid */}
            <div className="grid grid-cols-5 gap-1.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredPaletteQuestions.map(({ q, originalIndex }) => {
                const isCurrent = originalIndex === index;
                const isAnswered = !!q.selectedOptionId;

                return (
                  <button
                    key={q.id}
                    onClick={() => setIndex(originalIndex)}
                    className={`h-9 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-400/40'
                        : isAnswered
                        ? 'bg-emerald-100/90 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    {originalIndex + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Answered
                </span>
                <span className="font-bold text-slate-800">{answered}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Unanswered
                </span>
                <span className="font-bold text-slate-800">{attempt.questions.length - answered}</span>
              </div>
            </div>

            <button
              onClick={submit}
              disabled={busy}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm cursor-pointer shadow-xs disabled:opacity-50 transition-all"
            >
              {busy ? 'Saving...' : 'Submit Examination'}
            </button>
          </aside>
        </div>
      </section>
    );
  }

  if (view === 'result' && result) {
    const accuracy = result.totalMarks > 0 ? Math.round((result.score / result.totalMarks) * 100) : 0;

    return (
      <section className="glass-card rounded-3xl p-8 sm:p-10 text-center max-w-2xl mx-auto border border-slate-200/80 shadow-md">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
          PYQ Mock Completed!
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
          {result.status === 'TIMED_OUT' ? 'Time limit of 180 minutes was reached.' : 'Your 200-question practice mock exam has been evaluated.'}
        </p>

        <div className="my-6 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 inline-block px-8">
          <div className="text-3xl sm:text-4xl font-black text-indigo-950 font-heading">
            {result.score} <span className="text-sm font-medium text-indigo-600">/ {result.totalMarks || 200} Marks</span>
          </div>
          <div className="text-xs font-bold text-indigo-700 mt-0.5">{accuracy}% Overall Accuracy</div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <div className="text-2xl font-black text-slate-900">{result.score}</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">Score</div>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
            <div className="text-2xl font-black text-emerald-700">{result.correctCount}</div>
            <div className="text-xs text-emerald-800 font-semibold mt-0.5">Correct (+1)</div>
          </div>
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
            <div className="text-2xl font-black text-rose-700">{result.incorrectCount}</div>
            <div className="text-xs text-rose-800 font-semibold mt-0.5">Incorrect</div>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <div className="text-2xl font-black text-slate-700">{result.unansweredCount}</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">Unanswered</div>
          </div>
        </div>

        <button
          onClick={() => { setAttempt(null); setResult(null); setView('home'); }}
          className="mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md cursor-pointer hover-lift"
        >
          Return to PYQ Overview
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Hero Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              ECET PYQ Mock Challenge
            </h2>
            <p className="text-xs text-slate-500 font-medium">Full Syllabus Practice Simulator</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mt-3">
          Experience the real AP/TS ECET examination environment. Each session draws a fresh, randomized 200-question paper strictly adhering to the diploma blueprint, with randomized question and option order.
        </p>

        {/* 4 Subjects breakdown pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-4">
            <div className="text-2xl font-black text-blue-900 font-heading">100 Qs</div>
            <div className="text-xs text-blue-700 font-bold">DCME Core</div>
            <div className="text-[10px] text-blue-500 mt-1">Data Structures, DBMS, OS, Networks, Java</div>
          </div>
          <div className="bg-amber-50/80 border border-amber-100 rounded-2xl p-4">
            <div className="text-2xl font-black text-amber-900 font-heading">50 Qs</div>
            <div className="text-xs text-amber-700 font-bold">Mathematics</div>
            <div className="text-[10px] text-amber-500 mt-1">Matrices, Calculus, Trigonometry</div>
          </div>
          <div className="bg-cyan-50/80 border border-cyan-100 rounded-2xl p-4">
            <div className="text-2xl font-black text-cyan-900 font-heading">25 Qs</div>
            <div className="text-xs text-cyan-700 font-bold">Physics</div>
            <div className="text-[10px] text-cyan-500 mt-1">Vectors, Mechanics, Heat, SHM</div>
          </div>
          <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-4">
            <div className="text-2xl font-black text-emerald-900 font-heading">25 Qs</div>
            <div className="text-xs text-emerald-700 font-bold">Chemistry</div>
            <div className="text-[10px] text-emerald-500 mt-1">Atomic, Solutions, Corrosion</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span>⏱️ 180 Minutes</span>
            <span>🎯 200 Marks (+1/0)</span>
            <span>🎲 Random Selection</span>
          </div>

          <button
            onClick={start}
            disabled={busy}
            className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-indigo-500/20 cursor-pointer disabled:opacity-50 hover-lift flex items-center gap-2"
          >
            {busy ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Preparing Exam Paper...</span>
              </>
            ) : (
              <>
                <span>Start PYQ Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Official Papers Library */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200/80">
        <h3 className="font-bold text-slate-900 font-heading text-base mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          Official Previous Year Question Papers & Answer Keys
        </h3>

        {papers.length === 0 ? (
          <p className="text-xs sm:text-sm text-slate-500 py-3">No archive papers have been published yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {papers.map(p => (
              <div key={p.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
                <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    {p.title}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {p.paperType.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Year: {p.examYear} • Branch: {p.branch} • Syllabus: {p.curriculum}
                    {p.attribution && ` • ${p.attribution}`}
                  </div>
                </div>

                {p.publicUrl ? (
                  <a
                    href={p.publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    View / Download PDF
                  </a>
                ) : (
                  <span className="text-xs text-amber-600 font-medium">Link pending</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
