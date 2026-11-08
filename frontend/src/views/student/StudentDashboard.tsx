import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/client';
import type { AvailableTest, StudentResultSummary, GrandTestRequest, FeedbackItem } from '../../types';
import { PyqStudentPanel } from './PyqStudentPanel';
import { StudentAnalyticsPanel } from './StudentAnalyticsPanel';
import {
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Award,
  Activity,
  AlertCircle,
  Zap,
  MessageSquare,
  Send,
  Sparkles,
  Mail
} from 'lucide-react';

interface StudentDashboardProps {
  onStartTest: (attemptId: string) => void;
  onReviewAttempt: (attemptId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onStartTest,
  onReviewAttempt,
}) => {
  const [tab, setTab] = useState<'available' | 'pyq' | 'results' | 'analytics' | 'request' | 'feedback'>('available');
  const [tests, setTests] = useState<AvailableTest[]>([]);
  const [results, setResults] = useState<StudentResultSummary[]>([]);
  const [requests, setRequests] = useState<GrandTestRequest[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startingTestId, setStartingTestId] = useState<string | null>(null);

  // Request form state
  const [requestNote, setRequestNote] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);

  // Feedback form state
  const [fbCategory, setFbCategory] = useState<'GENERAL' | 'QUESTION_ERROR' | 'FEATURE_REQUEST' | 'BUG'>('GENERAL');
  const [fbSubject, setFbSubject] = useState('');
  const [fbMessage, setFbMessage] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

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
      } else if (tab === 'analytics') {
        // The analytics panel loads its own student-scoped summary.
      } else if (tab === 'results') {
        const data = await apiRequest<StudentResultSummary[]>('/api/v1/my/results');
        setResults(data);
      } else if (tab === 'request') {
        const data = await apiRequest<GrandTestRequest[]>('/api/v1/requests/grand-test');
        setRequests(data);
      } else if (tab === 'feedback') {
        const data = await apiRequest<FeedbackItem[]>('/api/v1/feedbacks');
        setFeedbacks(data);
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

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingRequest(true);
    setError(null);
    setRequestSuccess(null);
    try {
      await apiRequest('/api/v1/requests/grand-test', {
        method: 'POST',
        body: JSON.stringify({ note: requestNote }),
      });
      setRequestSuccess('Grand Test request submitted! The admin has been notified to generate your 200-question paper.');
      setRequestNote('');
      const data = await apiRequest<GrandTestRequest[]>('/api/v1/requests/grand-test');
      setRequests(data);
    } catch (err: any) {
      setError(err.message || 'Failed to submit Grand Test request');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbSubject.trim() || !fbMessage.trim()) return;
    setSubmittingFeedback(true);
    setError(null);
    setFeedbackSuccess(null);
    try {
      await apiRequest('/api/v1/feedbacks', {
        method: 'POST',
        body: JSON.stringify({
          category: fbCategory,
          subject: fbSubject.trim(),
          message: fbMessage.trim(),
        }),
      });
      setFeedbackSuccess('Thank you! Your feedback has been submitted to the admin.');
      setFbSubject('');
      setFbMessage('');
      const data = await apiRequest<FeedbackItem[]>('/api/v1/feedbacks');
      setFeedbacks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const pendingRequest = requests.find((r) => r.status === 'PENDING');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7 sm:py-9">
      {/* Top Welcome / Motivation banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/20 mb-8 border border-white/10">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-violet-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-blue-200 text-xs font-semibold mb-3 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>AP & TS ECET · C23 DCME Specialization</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-heading leading-tight">
              Master Your ECET Rank
            </h1>
            <p className="text-blue-100/80 text-xs sm:text-sm mt-2 leading-relaxed">
              Target top engineering colleges through daily 50-mark mocks and full 200-question timed practice papers.
            </p>
          </div>

          {/* Subject Pills Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-2.5 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 px-3 border border-white/10">
              <div className="text-[11px] text-blue-200/80 font-semibold">DCME Core</div>
              <div className="text-base sm:text-lg font-extrabold text-white">100 Marks</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 px-3 border border-white/10">
              <div className="text-[11px] text-blue-200/80 font-semibold">Mathematics</div>
              <div className="text-base sm:text-lg font-extrabold text-white">50 Marks</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 px-3 border border-white/10">
              <div className="text-[11px] text-blue-200/80 font-semibold">Physics</div>
              <div className="text-base sm:text-lg font-extrabold text-white">25 Marks</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 px-3 border border-white/10">
              <div className="text-[11px] text-blue-200/80 font-semibold">Chemistry</div>
              <div className="text-base sm:text-lg font-extrabold text-white">25 Marks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-950/80 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-800 mb-8 gap-1.5 overflow-x-auto shadow-2xl">
        <button
          onClick={() => setTab('available')}
          className={`py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
            tab === 'available'
              ? 'bg-white text-indigo-700 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Available Tests</span>
          {tests.length > 0 && (
            <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
              {tests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setTab('pyq')}
          className={`py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
            tab === 'pyq'
              ? 'bg-white text-indigo-700 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>PYQ Challenge (200 Qs)</span>
        </button>

        <button
          onClick={() => setTab('analytics')}
          className={`py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
            tab === 'analytics'
              ? 'bg-white text-indigo-700 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>My Progress</span>
        </button>

        <button
          onClick={() => setTab('results')}
          className={`py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
            tab === 'results'
              ? 'bg-white text-indigo-700 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Award className="w-4 h-4 text-violet-600" />
          <span>Past Results</span>
          {results.length > 0 && (
            <span className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {results.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setTab('request')}
          className={`py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
            tab === 'request'
              ? 'bg-white text-indigo-700 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Request Grand Test</span>
          {pendingRequest && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setTab('feedback')}
          className={`py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
            tab === 'feedback'
              ? 'bg-white text-indigo-700 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-blue-500" />
          <span>Feedback</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50/80 border border-red-200/80 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-red-700 shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center text-slate-500">
          <div className="w-9 h-9 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-3" />
          <p className="text-sm font-semibold text-slate-600">Loading your ECET tests...</p>
        </div>
      ) : tab === 'available' ? (
        tests.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-10 text-center text-slate-500 shadow-xs">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No mock tests available right now</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Check back soon for today's daily mock or jump into the <strong>PYQ Challenge</strong> tab to practice with 200 previous year questions!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {tests.map((t) => (
              <div
                key={t.id}
                className="bg-white/95 backdrop-blur-xl hover-lift rounded-3xl p-6 sm:p-7 flex flex-col justify-between min-h-64 border border-white/20 shadow-2xl shadow-black/40 text-slate-900 relative overflow-hidden group"
              >
                {/* Decorative accent top line */}
                <div className={`absolute top-0 inset-x-0 h-1.5 ${
                  t.testType === 'GRAND'
                    ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600'
                    : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500'
                }`} />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <span
                      className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-xs ${
                        t.testType === 'GRAND'
                          ? 'bg-purple-100 text-purple-900 border border-purple-200'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}
                    >
                      {t.testType === 'GRAND' ? (
                        <>
                          <Zap className="w-3.5 h-3.5 text-purple-700" />
                          Full Grand Test
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-emerald-700" />
                          Daily Mock
                        </>
                      )}
                    </span>

                    {t.scheduledDate && (
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                        {t.scheduledDate}
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-black text-slate-900 text-lg sm:text-xl leading-snug group-hover:text-blue-600 transition-colors">
                    {t.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 mt-4 pt-3.5 border-t border-slate-100 font-medium">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-semibold text-slate-800">{t.questionCount} Questions</span>
                      <span className="text-slate-400">({t.totalMarks} Marks)</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="font-semibold text-slate-800">
                        {t.durationMinutes > 0 ? `${t.durationMinutes} Mins` : 'Untimed'}
                      </span>
                    </div>
                  </div>

                  {/* Multi-segment subject proportion bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="w-full h-2 rounded-full overflow-hidden flex gap-0.5 bg-slate-100 p-0.5 border border-slate-200/60">
                      <div className="bg-blue-600 h-full rounded-l-full" style={{ width: '50%' }} title="DCME: 50%" />
                      <div className="bg-amber-500 h-full" style={{ width: '25%' }} title="Mathematics: 25%" />
                      <div className="bg-cyan-500 h-full" style={{ width: '12.5%' }} title="Physics: 12.5%" />
                      <div className="bg-emerald-500 h-full rounded-r-full" style={{ width: '12.5%' }} title="Chemistry: 12.5%" />
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 pt-0.5">
                      <span className="text-blue-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        {t.testType === 'GRAND' ? '100 DCME' : '25 DCME'}
                      </span>
                      <span className="text-amber-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {t.testType === 'GRAND' ? '50 Math' : '13 Math'}
                      </span>
                      <span className="text-cyan-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        {t.testType === 'GRAND' ? '25 Phys' : '6 Phys'}
                      </span>
                      <span className="text-emerald-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {t.testType === 'GRAND' ? '25 Chem' : '6 Chem'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStart(t.id)}
                  disabled={startingTestId === t.id}
                  className="mt-6 w-full min-h-12 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 active:scale-[0.99] transition-all shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {startingTestId === t.id ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Start Mock Exam</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )
      ) : tab === 'pyq' ? (
        <PyqStudentPanel />
      ) : tab === 'analytics' ? (
        <StudentAnalyticsPanel />
      ) : tab === 'results' ? (
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
      ) : tab === 'request' ? (
        <div className="space-y-6">
          {/* Explanation Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-600" /> Full Mock Simulation
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Ready for the 200-Question Grand Test?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              Daily mocks run everyday to keep you sharp. When you and your friends feel prepared across the entire syllabus (100 DCME, 50 Math, 25 Physics, 25 Chemistry • 180 Minutes), submit a request below. The admin will review and generate a full AI Grand Test paper!
            </p>
          </div>

          {requestSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-sm text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{requestSuccess}</span>
            </div>
          )}

          {/* Active / Pending Request Card */}
          {pendingRequest ? (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold bg-amber-200/80 text-amber-900 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Pending Admin Review
                </span>
                <span className="text-xs text-amber-800">
                  Requested on {new Date(pendingRequest.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">
                Grand Test Request Active
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 mb-2">
                Your request has been queued for the admin. As soon as the admin clicks to generate the paper, it will appear in your <strong>Available Tests</strong>.
              </p>
              {pendingRequest.note && (
                <div className="mt-3 bg-white/80 border border-amber-200/60 rounded-xl p-3 text-xs text-slate-700">
                  <span className="font-semibold text-slate-900">Your note: </span>
                  {pendingRequest.note}
                </div>
              )}
            </div>
          ) : (
            /* Request Submission Form */
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Submit New Grand Test Request
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                You can add an optional note for the admin (e.g. topics you want emphasized, or when your group plans to write the test).
              </p>

              <form onSubmit={handleCreateRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Readiness Note / Special Topic Requests (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Our group is ready for Grand Test! Please emphasize Computer Networks, DBMS normalization, and Calculus."
                    value={requestNote}
                    onChange={(e) => setRequestNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 focus:bg-white transition-all"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submittingRequest}
                    className="py-3 px-5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {submittingRequest ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Request Grand Test
                      </>
                    )}
                  </button>

                  <a
                    href={`mailto:paradoxofficial2008@gmail.com?subject=${encodeURIComponent('[ECET Desk] Grand Test Request')}&body=${encodeURIComponent(requestNote || 'Hi, we are ready to write the 200-question ECET Grand Test!')}`}
                    className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium underline"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Or email paradoxofficial2008@gmail.com directly
                  </a>
                </div>
              </form>
            </div>
          )}

          {/* Past Requests History */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-4">
              Your Request History ({requests.length})
            </h3>
            {requests.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No past requests submitted yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {requests.map((req) => (
                  <div key={req.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                            req.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : req.status === 'FULFILLED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {req.status}
                        </span>
                        <span className="text-slate-400">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {req.note && <p className="text-slate-700 mt-1">{req.note}</p>}
                      {req.generatedTestTitle && (
                        <p className="text-emerald-700 font-semibold mt-1">
                          Generated: {req.generatedTestTitle}
                        </p>
                      )}
                    </div>

                    {req.status === 'FULFILLED' && req.generatedTestId && (
                      <button
                        onClick={() => {
                          setTab('available');
                        }}
                        className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors self-start sm:self-auto cursor-pointer"
                      >
                        View in Available Tests
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* TAB: Feedback */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              Student Feedback & Issue Reports
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Found a mistake in a question or explanation? Have an idea to make practice smoother? Send your suggestions directly to the admin.
            </p>
          </div>

          {feedbackSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-sm text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{feedbackSuccess}</span>
            </div>
          )}

          {/* Feedback Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-4">
              Submit New Feedback
            </h3>

            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Category
                  </label>
                  <select
                    value={fbCategory}
                    onChange={(e: any) => setFbCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="QUESTION_ERROR">Question Error / Typo</option>
                    <option value="FEATURE_REQUEST">Feature Request</option>
                    <option value="BUG">Bug / App Issue</option>
                    <option value="GENERAL">General Feedback</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Subject / Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Question 12 option B explanation was incorrect"
                    value={fbSubject}
                    onChange={(e) => setFbSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Detailed Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe what happened, what could be improved, or why the question was flawed..."
                  value={fbMessage}
                  onChange={(e) => setFbMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50 focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {submittingFeedback ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Feedback
                    </>
                  )}
                </button>

                <a
                  href={`mailto:paradoxofficial2008@gmail.com?subject=${encodeURIComponent(`[ECET Desk Feedback] ${fbCategory}: ${fbSubject || 'Student Feedback'}`)}&body=${encodeURIComponent(fbMessage || '')}`}
                  className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-medium underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Or email paradoxofficial2008@gmail.com directly
                </a>
              </div>
            </form>
          </div>

          {/* Past Feedback History */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-4">
              Your Feedback History ({feedbacks.length})
            </h3>
            {feedbacks.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No feedback submitted yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {feedbacks.map((fb) => (
                  <div key={fb.id} className="py-4 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold px-2 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-700">
                          {fb.category.replace('_', ' ')}
                        </span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${
                            fb.status === 'RESOLVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : fb.status === 'REVIEWED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {fb.status}
                        </span>
                      </div>
                      <span className="text-slate-400 text-[11px]">
                        {new Date(fb.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{fb.subject}</h4>
                    <p className="text-slate-600 leading-relaxed">{fb.message}</p>

                    {fb.adminNotes && (
                      <div className="mt-2 bg-indigo-50/70 border border-indigo-200/60 rounded-xl p-3 text-xs text-indigo-950">
                        <span className="font-bold text-indigo-900 block mb-0.5">Admin Response:</span>
                        {fb.adminNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
