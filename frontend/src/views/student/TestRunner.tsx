import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/client';
import type { AttemptDetail, TestQuestion } from '../../types';
import { Clock, ChevronLeft, ChevronRight, Send, AlertTriangle, Menu, X, ArrowLeft } from 'lucide-react';

interface TestRunnerProps {
  attemptId: string;
  onSubmitted: (attemptId: string) => void;
  onExit: () => void;
}

export const TestRunner: React.FC<TestRunnerProps> = ({ attemptId, onSubmitted, onExit }) => {
  const [attempt, setAttempt] = useState<AttemptDetail | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingAnswer, setSavingAnswer] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showPaletteMobile, setShowPaletteMobile] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    loadAttempt();
  }, [attemptId]);

  // Timer counter
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadAttempt = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<AttemptDetail>(`/api/v1/attempts/${attemptId}`);
      setAttempt(data);

      // Pre-fill answers from server
      const initialAnswers: Record<string, string> = {};
      data.questions.forEach((q) => {
        if (q.selectedOptionId) {
          initialAnswers[q.id] = q.selectedOptionId;
        }
      });
      setAnswers(initialAnswers);
    } catch (err: any) {
      alert(err.message || 'Failed to load test attempt');
      onExit();
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = async (questionId: string, optionId: string) => {
    // Optimistic UI update
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setSavingAnswer(true);

    try {
      await apiRequest(`/api/v1/attempts/${attemptId}/answers/${questionId}`, {
        method: 'PUT',
        body: JSON.stringify({ optionId }),
      });
    } catch (err: any) {
      alert(err.message || 'Failed to save answer');
    } finally {
      setSavingAnswer(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await apiRequest(`/api/v1/attempts/${attemptId}/submit`, {
        method: 'POST',
      });
      onSubmitted(attemptId);
    } catch (err: any) {
      alert(err.message || 'Failed to submit test');
      setSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  if (loading || !attempt) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center text-slate-400">
        <div className="w-12 h-12 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium tracking-wide">Preparing your assessment session...</p>
      </div>
    );
  }

  const allQuestions = attempt.questions;
  const filteredQuestions =
    selectedSubject === 'ALL'
      ? allQuestions
      : allQuestions.filter((q) => q.subject === selectedSubject);

  const currentQuestion: TestQuestion | undefined = filteredQuestions[currentIndex] || allQuestions[0];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = allQuestions.length - answeredCount;
  const progressPercent = Math.round((answeredCount / (allQuestions.length || 1)) * 100);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Test Runner Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setShowExitModal(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Exit Test"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold tracking-wider bg-blue-500/10 border border-blue-500/30 text-blue-400 px-2.5 py-0.5 rounded-full uppercase">
                Active Assessment
              </span>
              <span className="hidden sm:inline-block text-xs text-slate-400 font-medium">
                {answeredCount} of {allQuestions.length} answered ({progressPercent}%)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Timer pill */}
          <div className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold bg-slate-800/90 text-amber-300 px-3 py-1.5 rounded-xl border border-amber-500/30 shadow-inner">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          {/* Palette toggle on mobile */}
          <button
            onClick={() => setShowPaletteMobile(!showPaletteMobile)}
            className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700"
            title="Question Palette"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Submit test button */}
          <button
            onClick={() => setShowConfirmModal(true)}
            className="py-1.5 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/40"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Test</span>
          </button>
        </div>
      </header>

      {/* Progress line */}
      <div className="w-full bg-slate-800 h-1">
        <div
          className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-1 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Layout: Question Area + Question Palette */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Left: Question Card (White container matching Login page pattern) */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 flex-1 flex flex-col justify-between border border-white/20 shadow-2xl shadow-black/40 text-slate-900 relative overflow-hidden">
            <div className="relative z-10">
              {/* Subject Tabs */}
              <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-slate-100">
                {['ALL', 'DCME', 'MATHEMATICS', 'PHYSICS', 'CHEMISTRY'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => {
                      setSelectedSubject(sub);
                      setCurrentIndex(0);
                    }}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      selectedSubject === sub
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {/* Question Header & Order */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60">
                    Q{currentQuestion.questionOrder} of {allQuestions.length}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                    {currentQuestion.subject}
                  </span>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  +1.0 Mark
                </span>
              </div>

              {/* Question Text */}
              <div className="text-base sm:text-lg font-heading font-medium text-slate-900 leading-relaxed mb-6">
                {currentQuestion.questionText}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((opt) => {
                  const isSelected = answers[currentQuestion.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 cursor-pointer group ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                          : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                            : 'bg-slate-200 text-slate-700 group-hover:bg-slate-300'
                        }`}
                      >
                        {opt.label}
                      </div>
                      <span className={`text-sm leading-relaxed transition-colors ${
                        isSelected ? 'text-blue-950 font-semibold' : 'text-slate-800'
                      }`}>
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-6 mt-8 border-t border-slate-100 relative z-10">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="py-2.5 px-4 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${savingAnswer ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
                <span>{savingAnswer ? 'Saving choice...' : 'Synced'}</span>
              </div>

              <button
                disabled={currentIndex === filteredQuestions.length - 1}
                onClick={() =>
                  setCurrentIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1))
                }
                className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all cursor-pointer"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right / Sidebar: Question Palette (White container) */}
        <aside
          className={`fixed inset-y-0 right-0 z-40 w-80 bg-white border-l border-slate-200 p-5 transition-transform md:relative md:inset-auto md:w-84 md:translate-x-0 md:rounded-3xl md:border md:bg-white/95 md:backdrop-blur-xl md:shadow-2xl md:shadow-black/40 text-slate-900 flex flex-col justify-between ${
            showPaletteMobile ? 'translate-x-0 shadow-2xl' : 'translate-x-full md:translate-x-0'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <h4 className="font-heading font-bold text-slate-900 text-base">Question Palette</h4>
                <p className="text-xs text-slate-500 mt-0.5">Jump to any question instantly</p>
              </div>
              <button
                onClick={() => setShowPaletteMobile(false)}
                className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-slate-50 border border-slate-100 p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-emerald-600 shrink-0" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-slate-200 shrink-0" />
                <span>Pending ({unansweredCount})</span>
              </div>
            </div>

            {/* Grid of question buttons */}
            <div className="grid grid-cols-5 gap-2 max-h-[50vh] overflow-y-auto p-1 pr-2">
              {filteredQuestions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowPaletteMobile(false);
                    }}
                    className={`h-10 rounded-xl font-mono font-bold text-xs transition-all cursor-pointer flex items-center justify-center ${
                      isCurrent
                        ? 'ring-2 ring-blue-600 ring-offset-2 ring-offset-white z-10 scale-105 shadow-sm'
                        : ''
                    } ${
                      isAnswered
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {q.questionOrder}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => setShowConfirmModal(true)}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/30"
            >
              <Send className="w-4 h-4" />
              <span>Final Submission</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl text-center text-slate-900 border border-white/20">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-heading font-bold text-slate-900">Submit your test?</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Once submitted, your responses will be evaluated instantly and complete subject-wise explanations will be revealed.
            </p>

            <div className="grid grid-cols-2 gap-3 my-5 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs text-left">
              <div>
                <span className="text-slate-500">Answered:</span>
                <span className="font-bold text-emerald-700 ml-1.5">{answeredCount}</span>
              </div>
              <div>
                <span className="text-slate-500">Unanswered:</span>
                <span className="font-bold text-rose-700 ml-1.5">{unansweredCount}</span>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Continue Test
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center justify-center transition-all disabled:opacity-50"
              >
                {submitting ? 'Grading...' : 'Yes, Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Test Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl text-center text-slate-900 border border-white/20">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-4 border border-rose-200">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-heading font-bold text-slate-900">Exit test session?</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Your saved answers will remain intact, but your timer will continue. You can resume from the dashboard at any time.
            </p>

            <div className="flex gap-2.5 mt-6">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Stay Here
              </button>
              <button
                type="button"
                onClick={onExit}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow-lg shadow-rose-600/30 cursor-pointer flex items-center justify-center transition-all"
              >
                Exit to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
