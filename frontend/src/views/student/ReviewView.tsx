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
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-slate-500">
        <div className="w-10 h-10 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mb-3" />
        <p className="text-sm">Loading test performance & explanations...</p>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="p-4 bg-red-50 text-red-700 rounded-2xl mb-4 text-sm">{error}</div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl"
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7 sm:py-9">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-xs mb-5 min-h-11 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* Hero Scorecard */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md">
                {review.testType}
              </span>
              <span className="text-xs text-slate-400">
                Attempted on {new Date(review.submittedAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              {review.testTitle}
            </h1>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">{review.score}</span>
            <span className="text-sm font-semibold text-slate-400">/ {review.totalMarks} marks</span>
            <span className="ml-2 text-xs font-bold bg-blue-600 text-white px-2.5 py-1 rounded-full">
              {percent}%
            </span>
          </div>
        </div>

        {/* Detailed counts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-emerald-950 leading-tight">
                {review.correctCount}
              </div>
              <div className="text-xs text-emerald-700 font-medium">Correct</div>
            </div>
          </div>

          <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-rose-950 leading-tight">
                {review.incorrectCount}
              </div>
              <div className="text-xs text-rose-700 font-medium">Wrong</div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-300 text-slate-700 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-slate-800 leading-tight">
                {review.unansweredCount}
              </div>
              <div className="text-xs text-slate-500 font-medium">Skipped</div>
            </div>
          </div>

          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-blue-950 leading-tight">
                {minutes !== null ? `${minutes}m ${seconds}s` : '—'}
              </div>
              <div className="text-xs text-blue-700 font-medium">Time Taken</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filter Mistakes vs All + Subject Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 ml-1" />
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setOnlyWrong(true)}
              className={`text-sm font-bold px-3.5 py-2.5 rounded-lg transition-all cursor-pointer ${
                onlyWrong
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mistakes Only ({review.incorrectCount + review.unansweredCount})
            </button>
            <button
              onClick={() => setOnlyWrong(false)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
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
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['ALL', 'DCME', 'MATHEMATICS', 'PHYSICS', 'CHEMISTRY'].map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`text-xs font-semibold px-3 py-2 rounded-lg shrink-0 transition-colors cursor-pointer ${
                selectedSubject === sub
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Review List */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900">
            {onlyWrong ? 'No mistakes found here! 🎉' : 'No questions in this section.'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {onlyWrong
              ? 'Great job! You either scored 100% or selected a subject with zero mistakes.'
              : 'Try selecting a different subject filter above.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            return (
              <div
                key={q.questionId}
                className={`bg-white rounded-2xl border p-5 sm:p-7 shadow-sm transition-shadow ${
                  q.isWrong
                    ? 'border-rose-200 bg-gradient-to-b from-rose-50/20 to-white'
                    : 'border-slate-200'
                }`}
              >
                {/* Header: Question number, subject, and Result Status Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      Question {q.questionOrder}
                    </span>
                    <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {q.subject}
                    </span>
                  </div>

                  <div>
                    {q.resultStatus === 'CORRECT' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Correct (+1)
                      </span>
                    ) : q.resultStatus === 'INCORRECT' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                        <XCircle className="w-3.5 h-3.5" />
                        Wrong Answer (0)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-200 px-2.5 py-0.5 rounded-full">
                        <HelpCircle className="w-3.5 h-3.5" />
                        Unanswered
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <div className="text-base font-semibold text-slate-900 leading-relaxed mb-4">
                  {q.questionText}
                </div>

                {/* Options List */}
                <div className="space-y-2 mb-4">
                  {q.options.map((opt) => {
                    const isUserChoice = q.selectedOptionId === opt.id;
                    const isCorrectOption = opt.correct;

                    let optionBorder = 'border-slate-200 bg-white text-slate-700';
                    let labelBadge = 'bg-slate-100 text-slate-700';

                    if (isCorrectOption) {
                      optionBorder = 'border-emerald-500 bg-emerald-50/60 text-emerald-950 font-medium';
                      labelBadge = 'bg-emerald-600 text-white';
                    } else if (isUserChoice && !isCorrectOption) {
                      optionBorder = 'border-rose-400 bg-rose-50/60 text-rose-950 font-medium line-through';
                      labelBadge = 'bg-rose-600 text-white';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-xl border-2 flex items-start justify-between gap-3 text-sm transition-colors ${optionBorder}`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${labelBadge}`}
                          >
                            {opt.label}
                          </span>
                          <span className="leading-normal">{opt.text}</span>
                        </div>

                        {/* Badges on the right */}
                        <div className="shrink-0 flex items-center gap-2">
                          {isCorrectOption && (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Correct Answer
                            </span>
                          )}
                          {isUserChoice && !isCorrectOption && (
                            <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> Your Choice
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Card (Why the answer is what it is) */}
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 text-amber-950 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1 text-xs">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Explanation & Why:</span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap pl-5 text-amber-900/90">
                    {q.explanation || 'No explanation provided for this question.'}
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
