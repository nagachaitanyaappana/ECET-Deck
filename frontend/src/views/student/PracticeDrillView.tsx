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
  HelpCircle
} from 'lucide-react';

interface TopicInfo {
  name: string;
  questionCount: number;
}

interface SubjectCatalog {
  subject: string;
  displayName: string;
  totalQuestions: number;
  topics: TopicInfo[];
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
  selectedTopics: string;
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
  selectedTopics: string;
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
  const [selectedSubject, setSelectedSubject] = useState<string>('DCME');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(15);
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
      if (data.length > 0 && !selectedSubject) {
        setSelectedSubject(data[0].subject);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to load topics.');
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

  const toggleTopic = (topicName: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicName) ? prev.filter((t) => t !== topicName) : [...prev, topicName]
    );
  };

  const selectAllTopics = () => {
    setSelectedTopics([]);
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
        topics: selectedTopics,
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

  // --- 1. PICKER / CONFIGURATION VIEW ---
  if (view === 'picker') {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-6 sm:p-7 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-blue-100">
                Self-Paced Practice
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">Subject & Topic-Wise Drills</h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
                Target specific topics you just studied or take a full subject practice test. Instant results with conceptual explanations.
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <Layers className="w-7 h-7 text-white" />
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
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            Step 1: Select Subject
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {catalogs.map((cat) => {
              const isSelected = selectedSubject === cat.subject;
              return (
                <button
                  key={cat.subject}
                  type="button"
                  onClick={() => {
                    setSelectedSubject(cat.subject);
                    setSelectedTopics([]);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-xs font-extrabold">{cat.subject}</span>
                  <span className="text-xs text-slate-500 mt-1 line-clamp-1">{cat.displayName}</span>
                  <span className="text-[11px] font-semibold text-slate-400 mt-2">
                    {cat.totalQuestions} Questions Available
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Topics */}
        {currentCatalog && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Step 2: Choose Topic Focus
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select "All Topics" for a comprehensive subject exam, or check specific topics to target.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAllTopics}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    selectedTopics.length === 0
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Topics (Entire Subject)
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
              {currentCatalog.topics.map((top) => {
                const isChecked = selectedTopics.includes(top.name);
                return (
                  <button
                    key={top.name}
                    type="button"
                    onClick={() => toggleTopic(top.name)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isChecked
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="truncate pr-1">{top.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {top.questionCount} Qs
                      </span>
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600" />
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
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Step 3: Drill Length & Mode
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Number of Questions</label>
              <div className="grid grid-cols-5 gap-2">
                {[10, 15, 20, 25, 30].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionCount(num)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      questionCount === num
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {num} Qs
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
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
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
                      ? 'bg-indigo-50 text-indigo-800 border-indigo-300 font-bold'
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
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {starting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Preparing Practice Drill...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>
                    Start {selectedSubject} Practice ({questionCount} Questions)
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Recent Practice History */}
        {recentAttempts.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-slate-500" />
              Your Recent Practice Drills
            </h3>

            <div className="divide-y divide-slate-100">
              {recentAttempts.map((att) => (
                <div key={att.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-800 flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-extrabold text-[11px]">
                        {att.subject}
                      </span>
                      <span>{att.selectedTopics || 'Full Subject Drill'}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {att.totalQuestions} Questions • Completed on{' '}
                      {new Date(att.submittedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-extrabold text-sm text-slate-900">
                        {att.score} / {att.totalQuestions}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-bold block">
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
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
              {activeAttempt.subject} • {activeAttempt.mode}
            </span>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Question {currentIndex + 1} of {activeAttempt.questions.length} ({answeredCount} answered)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeAttempt.durationMinutes > 0 ? (
              <div className="flex items-center gap-1.5 font-mono text-sm font-bold bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{formatTimer(remainingSeconds)}</span>
              </div>
            ) : (
              <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                Untimed Practice
              </span>
            )}

            <button
              type="button"
              onClick={handleSubmitPractice}
              disabled={submitting}
              className="py-1.5 px-3 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer"
            >
              Submit Early
            </button>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 pb-3">
            <span className="font-bold text-slate-700">Question #{currentIndex + 1}</span>
            {currentQ.topic && (
              <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium text-[11px]">
                {currentQ.topic}
              </span>
            )}
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
                      ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-semibold ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
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
                className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
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
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Practice Drill Completed!</h2>
            <p className="text-xs text-slate-500 mt-1">
              {activeAttempt.subject} • {activeAttempt.selectedTopics || 'Full Subject Drill'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xl font-black text-slate-900">
                {activeAttempt.score} / {activeAttempt.totalQuestions}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Score</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-xl font-black text-emerald-700">
                {activeAttempt.correctCount}
              </span>
              <span className="text-[11px] text-emerald-600 block mt-0.5">Correct</span>
            </div>

            <div className="p-3 bg-red-50 rounded-xl border border-red-100">
              <span className="text-xl font-black text-red-700">
                {activeAttempt.incorrectCount}
              </span>
              <span className="text-[11px] text-red-600 block mt-0.5">Incorrect</span>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <span className="text-xl font-black text-blue-700">
                {Math.round(activeAttempt.accuracy || 0)}%
              </span>
              <span className="text-[11px] text-blue-600 block mt-0.5">Accuracy</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setActiveAttempt(null);
                setView('picker');
              }}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm cursor-pointer"
            >
              Practice Another Topic
            </button>
          </div>
        </div>

        {/* Question by Question Review with Conceptual Explanations */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            Detailed Question Explanations ({activeAttempt.questions.length})
          </h3>

          {activeAttempt.questions.map((q, idx) => {
            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border transition-all space-y-4 ${
                  q.isCorrect
                    ? 'border-emerald-200 bg-white'
                    : q.selectedOptionId
                    ? 'border-red-200 bg-white'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Question {idx + 1}</span>
                  <div className="flex items-center gap-2">
                    {q.topic && (
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px]">
                        {q.topic}
                      </span>
                    )}
                    {q.isCorrect ? (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        ✓ Correct
                      </span>
                    ) : q.selectedOptionId ? (
                      <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded text-[11px]">
                        ✗ Incorrect
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        Unanswered
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                  {q.questionText}
                </p>

                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt) => {
                    const isSelected = q.selectedOptionId === opt.id;
                    const isCorrect = opt.is_correct;

                    let style = 'border-slate-200 bg-slate-50/50 text-slate-700';
                    if (isCorrect) {
                      style = 'border-emerald-400 bg-emerald-50 text-emerald-900 font-bold';
                    } else if (isSelected) {
                      style = 'border-red-400 bg-red-50 text-red-900 font-bold';
                    }

                    return (
                      <div key={opt.id} className={`p-3 rounded-xl border flex items-center gap-2 ${style}`}>
                        <span className="w-5 h-5 rounded-full bg-white/80 border border-current text-[11px] font-bold flex items-center justify-center shrink-0">
                          {opt.label}
                        </span>
                        <span>{opt.text}</span>
                        {isCorrect && <span className="ml-auto text-[10px] text-emerald-700 uppercase">Correct</span>}
                        {isSelected && !isCorrect && (
                          <span className="ml-auto text-[10px] text-red-700 uppercase">Your Choice</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div className="rounded-xl bg-blue-50/70 border border-blue-200/80 p-3.5 text-xs space-y-1">
                    <span className="font-bold text-blue-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      Conceptual Explanation:
                    </span>
                    <p className="text-slate-700 leading-relaxed font-sans">{q.explanation}</p>
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
