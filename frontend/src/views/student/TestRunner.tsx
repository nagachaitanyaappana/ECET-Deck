import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/client';
import type { AttemptDetail, TestQuestion } from '../../types';
import { Clock, ChevronLeft, ChevronRight, Send, AlertTriangle, Menu, X } from 'lucide-react';

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
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-slate-500">
        <div className="w-10 h-10 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mb-3" />
        <p className="text-sm">Setting up your test environment...</p>
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

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Test Runner Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md uppercase">
            Test in progress
          </span>
          <div className="hidden sm:block text-xs text-slate-500">
            {answeredCount} of {allQuestions.length} Answered
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          <button
            onClick={() => setShowPaletteMobile(!showPaletteMobile)}
            className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            title="Question Palette"
          >
            <Menu className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="py-1.5 px-3.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Test</span>
          </button>
        </div>
      </header>

      {/* Main Layout: Question Area + Question Palette */}
      <div className="max-w-6xl w-full mx-auto p-4 flex-1 flex flex-col md:flex-row gap-6">
        {/* Left: Question Card */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex-1 flex flex-col justify-between">
            <div>
              {/* Subject Tabs */}
              <div className="flex flex-wrap gap-2 mb-4 pb-3 border-b border-slate-100">
                {['ALL', 'DCME', 'MATHEMATICS', 'PHYSICS', 'CHEMISTRY'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => {
                      setSelectedSubject(sub);
                      setCurrentIndex(0);
                    }}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      selectedSubject === sub
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {/* Question Header */}
              <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
                <span className="font-bold text-slate-900">
                  Question {currentQuestion.questionOrder} of {allQuestions.length}
                </span>
                <span className="font-medium bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-700">
                  {currentQuestion.subject} (+1 Mark)
                </span>
              </div>

              {/* Question Text */}
              <div className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed mb-6">
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
                      className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {opt.label}
                      </div>
                      <span className="text-sm text-slate-800 leading-normal">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="py-2 px-3.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="text-xs text-slate-400 font-medium">
                {savingAnswer ? 'Saving choice...' : 'Auto-saved'}
              </div>

              <button
                disabled={currentIndex === filteredQuestions.length - 1}
                onClick={() =>
                  setCurrentIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1))
                }
                className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold disabled:opacity-30 flex items-center gap-1 cursor-pointer"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right / Sidebar: Question Palette */}
        <aside
          className={`fixed inset-y-0 right-0 z-40 w-72 bg-white border-l border-slate-200 p-4 transition-transform md:relative md:inset-auto md:w-80 md:translate-x-0 md:rounded-2xl md:border md:shadow-xs flex flex-col justify-between ${
            showPaletteMobile ? 'translate-x-0 shadow-2xl' : 'translate-x-full md:translate-x-0'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm">Question Palette</h4>
              <button
                onClick={() => setShowPaletteMobile(false)}
                className="md:hidden p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-xl">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-200 shrink-0" />
                <span>Pending ({unansweredCount})</span>
              </div>
            </div>

            {/* Grid of question buttons */}
            <div className="grid grid-cols-5 gap-2 max-h-[55vh] overflow-y-auto p-1">
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
                    className={`min-h-11 rounded-lg font-bold text-sm transition-all cursor-pointer flex items-center justify-center ${
                      isCurrent
                        ? 'ring-2 ring-blue-600 ring-offset-2'
                        : ''
                    } ${
                      isAnswered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {q.questionOrder}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowConfirmModal(true)}
              className="w-full min-h-12 py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Assessment</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Submit your test?</h3>
            <p className="text-xs text-slate-600 mt-1">
              You will immediately see your score and full explanations for any wrong answers.
            </p>

            <div className="grid grid-cols-2 gap-2 my-4 bg-slate-50 p-3 rounded-xl text-xs text-left">
              <div>
                <span className="text-slate-400">Answered:</span>
                <span className="font-bold text-emerald-600 ml-1">{answeredCount}</span>
              </div>
              <div>
                <span className="text-slate-400">Unanswered:</span>
                <span className="font-bold text-rose-600 ml-1">{unansweredCount}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 min-h-11 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Continue Test
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="flex-1 min-h-11 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer flex items-center justify-center"
              >
                {submitting ? 'Grading...' : 'Yes, Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
