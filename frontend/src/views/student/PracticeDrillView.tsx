import React, { useEffect, useState, useRef } from 'react';
import { apiRequest } from '../../api/client';
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  RotateCcw,
  Layers,
  CheckSquare,
  Square,
  HelpCircle,
  Cpu,
  GraduationCap
} from 'lucide-react';

interface ConceptInfo {
  name: string;
  questionCount: number;
}

interface SubjectCatalog {
  subject: string;
  displayName: string;
  stream: string;
  code?: string;
  totalQuestions: number;
  concepts: ConceptInfo[];
  topics?: ConceptInfo[];
}

interface PracticeOption {
  id: string;
  label: string;
  text: string;
  is_correct?: boolean;
}

interface PracticeQuestion {
  id: string;
  questionOrder: number;
  subject: string;
  topic: string;
  concept?: string;
  questionText: string;
  options: PracticeOption[];
  selectedOptionId?: string;
  explanation?: string;
  isCorrect?: boolean;
}

interface PracticeAttempt {
  attemptId: string;
  subject: string;
  mode: string;
  selectedConcepts?: string;
  selectedTopics?: string;
  totalQuestions: number;
  durationMinutes: number;
  status: string;
  score?: number;
  correctCount?: number;
  incorrectCount?: number;
  unansweredCount?: number;
  accuracy?: number;
  questions: PracticeQuestion[];
}

interface RecentAttempt {
  id: string;
  subject: string;
  mode: string;
  selectedConcepts?: string;
  selectedTopics?: string;
  totalQuestions: number;
  score: number;
  correctCount: number;
  accuracy: number;
  startedAt: string;
  submittedAt: string;
}

export const PracticeDrillView: React.FC = () => {
  const [view, setView] = useState<'picker' | 'running' | 'review'>('picker');
  const [catalogs, setCatalogs] = useState<SubjectCatalog[]>([]);
  const [activeStream, setActiveStream] = useState<'DCME' | 'GENERAL'>('DCME');
  const [selectedSubject, setSelectedSubject] = useState<string>('OPERATING_SYSTEMS');
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(50);
  const [isTimed, setIsTimed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [starting, setStarting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Active Test State
  const [activeAttempt, setActiveAttempt] = useState<PracticeAttempt | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [savingAnswer, setSavingAnswer] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [recentAttempts, setRecentAttempts] = useState<RecentAttempt[]>([]);

  const autoSubmitTriggered = useRef(false);

  useEffect(() => {
    loadCatalogs();
    loadRecentAttempts();
  }, []);

  const loadCatalogs = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<SubjectCatalog[]>('/api/v1/practice/topics');
      setCatalogs(data);
      if (data.length > 0) {
        const dcmeFirst = data.find((c) => c.stream === 'DCME');
        if (dcmeFirst) {
          setSelectedSubject(dcmeFirst.subject);
        } else {
          setSelectedSubject(data[0].subject);
        }
      }
    } catch (e: any) {
      setError(e.message || 'Failed to load curriculum catalog.');
    } finally {
      setLoading(false);
    }
  };

  const loadRecentAttempts = async () => {
    try {
      const data = await apiRequest<RecentAttempt[]>('/api/v1/practice/attempts/recent');
      setRecentAttempts(data);
    } catch {}
  };

  const currentCatalog = catalogs.find((c) => c.subject === selectedSubject) || catalogs[0];
  const currentConcepts = currentCatalog?.concepts || currentCatalog?.topics || [];

  const toggleConcept = (conceptName: string) => {
    setSelectedConcepts((prev) =>
      prev.includes(conceptName) ? prev.filter((t) => t !== conceptName) : [...prev, conceptName]
    );
  };

  const selectEntireSubject = () => {
    setSelectedConcepts([]);
  };

  // Timer Effect
  useEffect(() => {
    if (view !== 'running' || !activeAttempt || activeAttempt.durationMinutes <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!autoSubmitTriggered.current) {
            autoSubmitTriggered.current = true;
            handleSubmitPractice();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [view, activeAttempt]);

  const handleStartPractice = async () => {
    setStarting(true);
    setError(null);
    autoSubmitTriggered.current = false;
    try {
      const payload = {
        subject: selectedSubject,
        concepts: selectedConcepts,
        topics: selectedConcepts,
        questionCount: questionCount,
        timed: isTimed,
        durationMinutes: isTimed ? questionCount : 0
      };

      const res = await apiRequest<PracticeAttempt>('/api/v1/practice/start', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setActiveAttempt(res);
      setCurrentIndex(0);
      if (res.durationMinutes > 0) {
        setRemainingSeconds(res.durationMinutes * 60);
      }
      setView('running');
    } catch (e: any) {
      setError(e.message || 'Could not start practice test.');
    } finally {
      setStarting(false);
    }
  };

  const handleChooseOption = async (optionId: string) => {
    if (!activeAttempt) return;
    const currentQ = activeAttempt.questions[currentIndex];
    const prevOptionId = currentQ.selectedOptionId;

    // Optimistic UI update
    const updatedQuestions = [...activeAttempt.questions];
    updatedQuestions[currentIndex] = {
      ...currentQ,
      selectedOptionId: prevOptionId === optionId ? undefined : optionId
    };
    setActiveAttempt({ ...activeAttempt, questions: updatedQuestions });

    setSavingAnswer(true);
    try {
      await apiRequest(
        `/api/v1/practice/attempts/${activeAttempt.attemptId}/questions/${currentQ.id}/answers`,
        {
          method: 'POST',
          body: JSON.stringify({
            selectedOptionId: prevOptionId === optionId ? null : optionId
          })
        }
      );
    } catch (e) {
      // rollback on failure
      updatedQuestions[currentIndex] = { ...currentQ, selectedOptionId: prevOptionId };
      setActiveAttempt({ ...activeAttempt, questions: updatedQuestions });
    } finally {
      setSavingAnswer(false);
    }
  };

  const handleSubmitPractice = async () => {
    if (!activeAttempt || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const reviewData = await apiRequest<PracticeAttempt>(
        `/api/v1/practice/attempts/${activeAttempt.attemptId}/submit`,
        { method: 'POST' }
      );
      setActiveAttempt(reviewData);
      setView('review');
      loadRecentAttempts();
    } catch (e: any) {
      setError(e.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewPastAttempt = async (attemptId: string) => {
    setLoading(true);
    try {
      const reviewData = await apiRequest<PracticeAttempt>(
        `/api/v1/practice/attempts/${attemptId}/review`
      );
      setActiveAttempt(reviewData);
      setView('review');
    } catch (e: any) {
      setError(e.message || 'Could not load practice review.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredCatalogs = catalogs.filter((c) => (c.stream || 'DCME') === activeStream);

  // --- 1. PICKER / CONFIGURATION VIEW ---
  if (view === 'picker') {
    return (
      <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-7 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">C-23 Subject & Concept Drills</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Official AP ECET 2027 Diploma Curriculum Questions & 50-Question Proportional Randomizer
                </p>
              </div>
            </div>

            {/* Stream Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setActiveStream('DCME');
                  const first = catalogs.find((c) => c.stream === 'DCME');
                  if (first) {
                    setSelectedSubject(first.subject);
                    setSelectedConcepts([]);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeStream === 'DCME'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                <span>DCME Core (14 Subjects)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveStream('GENERAL');
                  const first = catalogs.find((c) => c.stream === 'GENERAL');
                  if (first) {
                    setSelectedSubject(first.subject);
                    setSelectedConcepts([]);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeStream === 'GENERAL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-slate-600" />
                <span>General Sciences (Maths/Phy/Chem)</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-800 border border-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Select Subject */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              Step 1: Select Technical Subject
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              {filteredCatalogs.length} Subjects available
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredCatalogs.map((cat) => {
              const isSelected = selectedSubject === cat.subject;
              return (
                <button
                  key={cat.subject}
                  type="button"
                  onClick={() => {
                    setSelectedSubject(cat.subject);
                    setSelectedConcepts([]);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-700 bg-emerald-50/60 text-slate-900 ring-2 ring-emerald-600/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                      {cat.code || cat.subject}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {cat.totalQuestions} Qs
                    </span>
                  </div>
                  <span className="text-xs font-bold mt-2 text-slate-900 line-clamp-1">
                    {cat.displayName}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">
                    {cat.concepts?.length || 5} Concepts
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Concepts */}
        {currentCatalog && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-700" />
                  Step 2: Choose Concepts in {currentCatalog.displayName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select "Entire Subject" to test all units, or choose specific concepts to target.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectEntireSubject}
                  className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    selectedConcepts.length === 0
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Select Entire Subject ({currentConcepts.length} Concepts)
                </button>
              </div>
            </div>

            {/* Randomization Formula Banner */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                {selectedConcepts.length === 0 ? (
                  <span>
                    <strong>Entire Subject Mode:</strong> 50 questions will be proportionally randomized across all {currentConcepts.length} concepts ({Math.floor(50 / Math.max(1, currentConcepts.length))} questions per concept).
                  </span>
                ) : selectedConcepts.length === 1 ? (
                  <span>
                    <strong>Single-Concept Drill:</strong> 50 questions will be randomized from <em>"{selectedConcepts[0]}"</em>.
                  </span>
                ) : (
                  <span>
                    <strong>Multi-Concept Drill:</strong> 50 questions will be proportionally distributed across your {selectedConcepts.length} selected concepts ({Math.floor(50 / selectedConcepts.length)} questions each).
                  </span>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
              {currentConcepts.map((con) => {
                const isChecked = selectedConcepts.includes(con.name);
                return (
                  <button
                    key={con.name}
                    type="button"
                    onClick={() => toggleConcept(con.name)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isChecked
                        ? 'border-emerald-700 bg-emerald-50/70 text-slate-900 font-bold ring-1 ring-emerald-600/30 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="truncate pr-1">{con.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {con.questionCount} Qs
                      </span>
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Question Count & Timer */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            Step 3: Drill Length & Mode
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Question Count</label>
              <div className="grid grid-cols-3 gap-2">
                {[50, 25, 15].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionCount(num)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      questionCount === num
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {num === 50 ? '50 Qs (Standard)' : `${num} Qs`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Timer Option</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsTimed(false)}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    !isTimed
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" /> Untimed Practice
                </button>
                <button
                  type="button"
                  onClick={() => setIsTimed(true)}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isTimed
                      ? 'bg-slate-900 text-white border-slate-900 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" /> Timed ({questionCount} mins)
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3">
            <button
              type="button"
              disabled={starting || loading}
              onClick={handleStartPractice}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {starting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating Randomized Drill ({questionCount} Questions)...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>
                    Start {currentCatalog?.displayName || selectedSubject} Drill ({questionCount} Questions)
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Recent Practice History */}
        {recentAttempts.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-slate-500" />
              Your Recent Practice Drills
            </h3>

            <div className="divide-y divide-slate-100">
              {recentAttempts.map((att) => (
                <div key={att.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-800 flex items-center gap-2">
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-extrabold text-[11px] border border-emerald-200">
                        {att.subject}
                      </span>
                      <span>{att.selectedConcepts || att.selectedTopics || 'Full Subject Drill'}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {att.totalQuestions} Questions • Mode: {att.mode} • Completed on{' '}
                      {new Date(att.submittedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-extrabold text-sm text-slate-900">
                        {att.score} / {att.totalQuestions}
                      </span>
                      <span className="text-[11px] text-emerald-700 font-bold block">
                        {Math.round(att.accuracy || 0)}% Accuracy
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleReviewPastAttempt(att.id)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- 2. RUNNING TEST VIEW ---
  if (view === 'running' && activeAttempt) {
    const currentQ = activeAttempt.questions[currentIndex];
    const answeredCount = activeAttempt.questions.filter((q) => q.selectedOptionId).length;

    return (
      <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
        {/* Runner Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
              {activeAttempt.subject} • {activeAttempt.mode}
            </span>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Question {currentIndex + 1} of {activeAttempt.questions.length} ({answeredCount} answered)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeAttempt.durationMinutes > 0 ? (
              <div className="flex items-center gap-1.5 font-mono text-sm font-bold bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>{formatTimer(remainingSeconds)}</span>
              </div>
            ) : (
              <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                Untimed Practice
              </span>
            )}

            <button
              type="button"
              onClick={handleSubmitPractice}
              disabled={submitting}
              className="py-1.5 px-3 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer"
            >
              Submit Early
            </button>
          </div>
        </div>

        {/* Question Navigator Dots */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
          {activeAttempt.questions.map((q, idx) => {
            const isAnswered = !!q.selectedOptionId;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                  isCurrent
                    ? 'bg-slate-900 text-white ring-2 ring-slate-900/20'
                    : isAnswered
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 pb-3">
            <span className="font-bold text-slate-700">Question #{currentIndex + 1}</span>
            <div className="flex items-center gap-2">
              {currentQ.concept && (
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-medium text-[11px]">
                  {currentQ.concept}
                </span>
              )}
              {currentQ.topic && !currentQ.concept && (
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium text-[11px]">
                  {currentQ.topic}
                </span>
              )}
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
            {currentQ.questionText}
          </h3>

          <div className="space-y-3">
            {currentQ.options.map((opt) => {
              const isSelected = currentQ.selectedOptionId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleChooseOption(opt.id)}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'border-emerald-700 bg-emerald-50/70 text-slate-900 font-semibold ring-2 ring-emerald-600/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="flex-1">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              className="py-2 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 disabled:opacity-30 cursor-pointer flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <span className="text-[11px] text-slate-400 font-medium">
              {savingAnswer ? 'Saving choice...' : 'Choice auto-saved'}
            </span>

            {currentIndex === activeAttempt.questions.length - 1 ? (
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmitPractice}
                className="py-2.5 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Finish & Submit Drill'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentIndex((i) => Math.min(activeAttempt.questions.length - 1, i + 1))}
                className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- 3. REVIEW & RESULTS VIEW ---
  if (view === 'review' && activeAttempt) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Results Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Drill Completed!</h2>
            <p className="text-xs text-slate-500 mt-1">
              {activeAttempt.subject} • Mode: {activeAttempt.mode}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto pt-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Score</span>
              <span className="text-lg font-extrabold text-slate-900">
                {activeAttempt.score} / {activeAttempt.totalQuestions}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[11px] font-bold text-emerald-800 block uppercase">Correct</span>
              <span className="text-lg font-extrabold text-emerald-800">
                {activeAttempt.correctCount}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-red-50 border border-red-200">
              <span className="text-[11px] font-bold text-red-800 block uppercase">Incorrect</span>
              <span className="text-lg font-extrabold text-red-800">
                {activeAttempt.incorrectCount}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Accuracy</span>
              <span className="text-lg font-extrabold text-slate-900">
                {Math.round(activeAttempt.accuracy || 0)}%
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setActiveAttempt(null);
                setView('picker');
              }}
              className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Take Another Drill</span>
            </button>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-700" />
            Detailed Review & Explanations ({activeAttempt.questions.length} Questions)
          </h3>

          {activeAttempt.questions.map((q, idx) => {
            const isUserCorrect = q.isCorrect;
            const isUnanswered = !q.selectedOptionId;

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Question #{idx + 1}</span>
                  <div className="flex items-center gap-2">
                    {q.concept && (
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium">
                        {q.concept}
                      </span>
                    )}
                    {isUnanswered ? (
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                        Unanswered
                      </span>
                    ) : isUserCorrect ? (
                      <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Correct (+1)
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Incorrect (0)
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
                  {q.questionText}
                </p>

                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isSelected = q.selectedOptionId === opt.id;
                    const isCorrect = opt.is_correct;

                    let optionStyle = 'border-slate-200 bg-white text-slate-700';
                    if (isCorrect) {
                      optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500/30';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'border-red-300 bg-red-50 text-red-900';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center gap-3 ${optionStyle}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isCorrect
                              ? 'bg-emerald-600 text-white'
                              : isSelected
                              ? 'bg-red-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {opt.label}
                        </span>
                        <span className="flex-1">{opt.text}</span>
                        {isCorrect && (
                          <span className="text-[11px] font-bold text-emerald-700 shrink-0">
                            Correct Answer
                          </span>
                        )}
                        {isSelected && !isCorrect && (
                          <span className="text-[11px] font-bold text-red-600 shrink-0">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Explanation
                    </span>
                    <p className="leading-relaxed text-slate-600">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};
