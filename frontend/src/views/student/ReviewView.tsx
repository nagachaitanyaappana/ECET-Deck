import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/client';
import type { AttemptReview } from '../../types';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lightbulb,
  Filter,
  Clock
} from 'lucide-react';

interface ReviewViewProps {
  attemptId: string;
  onBack: () => void;
}

export const ReviewView: React.FC<ReviewViewProps> = ({ attemptId, onBack }) => {
  const [review, setReview] = useState<AttemptReview | null>(null);
  const [onlyWrong, setOnlyWrong] = useState<boolean>(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReview();
  }, [attemptId, onlyWrong]);

  const loadReview = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<AttemptReview>(
        `/api/v1/attempts/${attemptId}/review?wrongOnly=${onlyWrong}`
      );
      setReview(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load test review');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !review) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-slate-400">
        <div className="w-12 h-12 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium tracking-wide">Loading performance scorecard & deep explanations...</p>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-2xl mb-5 text-sm">
          {error || 'Unable to display test review.'}
        </div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/30"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  const percent =
    review.totalMarks > 0 ? Math.round((review.score / review.totalMarks) * 100) : 0;
  const minutes = review.elapsedSeconds ? Math.floor(review.elapsedSeconds / 60) : null;
  const seconds = review.elapsedSeconds ? review.elapsedSeconds % 60 : null;

  const filteredQuestions =
    selectedSubject === 'ALL'
      ? review.questions
      : review.questions.filter((q) => q.subject === selectedSubject);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 selection:bg-blue-600 selection:text-white">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>

      {/* Hero Scorecard (White container matching login page pattern) */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 mb-8 border border-white/20 shadow-2xl shadow-black/40 text-slate-900 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {review.testType}
              </span>
              <span className="text-xs text-slate-500">
                Attempted on {new Date(review.submittedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
              {review.testTitle}
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl shadow-xs">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-0.5">Your Score</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-heading font-black text-slate-900">{review.score}</span>
                <span className="text-sm font-semibold text-slate-500">/ {review.totalMarks}</span>
              </div>
            </div>
            <div className="w-px h-10 bg-slate-200 mx-1" />
            <div className="flex flex-col items-center">
              <span className={`text-sm font-black px-3 py-1 rounded-xl shadow-xs ${
                percent >= 75
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : percent >= 50
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {percent}%
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-1">Accuracy</span>
            </div>
          </div>
        </div>

        {/* Detailed counts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6 relative z-10">
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-heading font-bold text-slate-900">
                {review.correctCount}
              </div>
              <div className="text-xs text-emerald-700 font-semibold">Correct</div>
            </div>
          </div>

          <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-heading font-bold text-slate-900">
                {review.incorrectCount}
              </div>
              <div className="text-xs text-rose-700 font-semibold">Wrong</div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-slate-300 text-slate-700 flex items-center justify-center shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-heading font-bold text-slate-900">
                {review.unansweredCount}
              </div>
              <div className="text-xs text-slate-500 font-medium">Skipped</div>
            </div>
          </div>

          <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-heading font-bold text-slate-900">
                {minutes !== null ? `${minutes}m ${seconds}s` : '—'}
              </div>
              <div className="text-xs text-blue-700 font-semibold">Time Taken</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filter Mistakes vs All + Subject Pills (White container) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white/95 backdrop-blur-xl p-3.5 sm:p-4 rounded-2xl border border-white/20 shadow-xl text-slate-900">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 ml-1" />
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setOnlyWrong(true)}
              className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                onlyWrong
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mistakes Only ({review.incorrectCount + review.unansweredCount})
            </button>
            <button
              onClick={() => setOnlyWrong(false)}
              className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                !onlyWrong
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Questions ({review.totalQuestions})
            </button>
          </div>
        </div>

        {/* Subject Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'DCME', 'MATHEMATICS', 'PHYSICS', 'CHEMISTRY'].map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl shrink-0 transition-all cursor-pointer ${
                selectedSubject === sub
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Review List */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/20 p-12 text-center text-slate-600 shadow-2xl">
          <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-3" />
          <h3 className="text-lg font-heading font-bold text-slate-900">
            {onlyWrong ? 'Zero mistakes in this section! 🎉' : 'No questions found.'}
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
            {onlyWrong
              ? 'Outstanding performance! You answered every question correctly or had no unanswered questions in this category.'
              : 'Try selecting a different subject filter from the options above.'}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredQuestions.map((q) => {
            return (
              <div
                key={q.questionId}
                className={`bg-white/95 backdrop-blur-xl rounded-3xl border p-6 sm:p-8 shadow-2xl text-slate-900 transition-all ${
                  q.isWrong
                    ? 'border-rose-300 ring-1 ring-rose-200'
                    : 'border-white/20'
                }`}
              >
                {/* Header: Question order, subject, and Result Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60 text-xs">
                      Q{q.questionOrder}
                    </span>
                    <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                      {q.subject}
                    </span>
                  </div>

                  <div>
                    {q.resultStatus === 'CORRECT' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Correct (+1.0)
                      </span>
                    ) : q.resultStatus === 'INCORRECT' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        Wrong Answer (0.0)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                        <HelpCircle className="w-3.5 h-3.5" />
                        Unanswered
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <div className="text-base sm:text-lg font-heading font-medium text-slate-900 leading-relaxed mb-5">
                  {q.questionText}
                </div>

                {/* Options List */}
                <div className="space-y-2.5 mb-5">
                  {q.options.map((opt) => {
                    const isUserChoice = q.selectedOptionId === opt.id;
                    const isCorrectOption = opt.correct;

                    let optionBorder = 'border-slate-200 bg-white text-slate-800';
                    let labelBadge = 'bg-slate-100 text-slate-700';

                    if (isCorrectOption) {
                      optionBorder = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-medium ring-1 ring-emerald-500/20';
                      labelBadge = 'bg-emerald-600 text-white font-bold';
                    } else if (isUserChoice && !isCorrectOption) {
                      optionBorder = 'border-rose-400 bg-rose-50/70 text-rose-950 font-medium line-through';
                      labelBadge = 'bg-rose-600 text-white font-bold';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex items-start justify-between gap-3 text-sm ${optionBorder}`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${labelBadge}`}
                          >
                            {opt.label}
                          </span>
                          <span className="leading-relaxed mt-0.5">{opt.text}</span>
                        </div>

                        {/* Badges on the right */}
                        <div className="shrink-0 flex items-center gap-2">
                          {isCorrectOption && (
                            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Correct Choice
                            </span>
                          )}
                          {isUserChoice && !isCorrectOption && (
                            <span className="text-[11px] font-bold text-rose-800 bg-rose-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" /> Your Choice
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 sm:p-5 text-amber-950 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 font-heading font-bold text-amber-900 mb-1.5 text-xs">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Explanation & Conceptual Breakdown:</span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap pl-6 text-amber-900/90">
                    {q.explanation || 'No detailed explanation provided for this question.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
