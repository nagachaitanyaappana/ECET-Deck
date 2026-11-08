import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/client';
import type { AvailableTest, StudentResultSummary } from '../../types';
import { Clock, CheckCircle2, XCircle, HelpCircle, ArrowRight, BookOpen, Award, AlertCircle } from 'lucide-react';

interface StudentDashboardProps {
  onStartTest: (attemptId: string) => void;
  onReviewAttempt: (attemptId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onStartTest,
  onReviewAttempt,
}) => {
  const [tab, setTab] = useState<'available' | 'results'>('available');
  const [tests, setTests] = useState<AvailableTest[]>([]);
  const [results, setResults] = useState<StudentResultSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startingTestId, setStartingTestId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [tab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (tab === 'available') {
        const data = await apiRequest<AvailableTest[]>('/api/v1/tests');
        setTests(data);
      } else {
        const data = await apiRequest<StudentResultSummary[]>('/api/v1/my/results');
        setResults(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async (testId: string) => {
    setStartingTestId(testId);
    setError(null);
    try {
      const response = await apiRequest<{ attemptId: string }>(`/api/v1/tests/${testId}/attempts`, {
        method: 'POST',
      });
      onStartTest(response.attemptId);
    } catch (err: any) {
      setError(err.message || 'Could not start test. You may have already attempted it.');
    } finally {
      setStartingTestId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top Welcome / Motivation banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-blue-500/15 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">ECET Preparation Arena</h1>
        <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
          Sharpen your skills across DCME (100 marks), Math (50), Physics (25), and Chemistry (25).
          Write daily mocks, learn from wrong answers, and improve your rank!
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        <button
          onClick={() => setTab('available')}
          className={`pb-3 px-3 text-sm font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            tab === 'available'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Available Tests
          {tests.length > 0 && tab === 'available' && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">
              {tests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setTab('results')}
          className={`pb-3 px-3 text-sm font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            tab === 'results'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          My Past Results
          {results.length > 0 && tab === 'results' && (
            <span className="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-full font-bold">
              {results.length}
            </span>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-500">
          <div className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mb-3" />
          <p className="text-sm">Loading tests...</p>
        </div>
      ) : tab === 'available' ? (
        tests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-slate-700">No tests available right now</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Check back later for today's daily mock or when an admin publishes a grand test.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {tests.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        t.testType === 'GRAND'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {t.testType === 'GRAND' ? 'Grand Test' : 'Daily Mock'}
                    </span>
                    {t.scheduledDate && (
                      <span className="text-xs font-medium text-slate-400">
                        {t.scheduledDate}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{t.title}</h3>

                  <div className="flex items-center gap-4 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.questionCount} Questions</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {t.durationMinutes > 0 ? `${t.durationMinutes} mins` : 'Untimed'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStart(t.id)}
                  disabled={startingTestId === t.id}
                  className="mt-5 w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {startingTestId === t.id ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Start Practice Test</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Results Tab */
        results.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-slate-700">No attempts yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Start an available mock test to see your score and analyze your mistakes here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((r) => {
              const total = r.correct + r.incorrect + r.unanswered;
              const percent = total > 0 ? Math.round((r.score / total) * 100) : 0;
              const minutes = r.elapsedSeconds ? Math.floor(r.elapsedSeconds / 60) : null;
              const seconds = r.elapsedSeconds ? r.elapsedSeconds % 60 : null;

              return (
                <div
                  key={r.attemptId}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {r.testType}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(r.submittedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base mt-1">{r.title}</h3>

                    {/* Stats pills */}
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {r.correct} Correct
                      </span>
                      <span className="flex items-center gap-1 text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-md">
                        <XCircle className="w-3.5 h-3.5" />
                        {r.incorrect} Wrong
                      </span>
                      <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        <HelpCircle className="w-3.5 h-3.5" />
                        {r.unanswered} Skipped
                      </span>
                      {minutes !== null && (
                        <span className="text-slate-500 font-medium">
                          Time: {minutes}m {seconds}s
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 gap-3">
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
                        {r.score}{' '}
                        <span className="text-xs font-normal text-slate-400">/ {total}</span>
                      </div>
                      <span className="text-xs font-semibold text-blue-600">{percent}% Score</span>
                    </div>

                    <button
                      onClick={() => onReviewAttempt(r.attemptId)}
                      className="py-2 px-3.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <span>Review Mistakes & Why</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};
