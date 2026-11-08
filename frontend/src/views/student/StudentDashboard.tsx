import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/client';
import type { AvailableTest, StudentResultSummary, GrandTestRequest, FeedbackItem } from '../../types';
import { PyqStudentPanel } from './PyqStudentPanel';
import {
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Award,
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
  const [tab, setTab] = useState<'available' | 'pyq' | 'results' | 'request' | 'feedback'>('available');
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-blue-500/15 mb-7">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">ECET Preparation Arena</h1>
        <p className="text-blue-100 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
          Sharpen your skills across DCME (100 marks), Math (50), Physics (25), and Chemistry (25).
          Write daily mocks, learn from wrong answers, and improve your rank!
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-7 gap-2 overflow-x-auto">
        <button
          onClick={() => setTab('available')}
          className={`pb-3.5 px-3.5 min-h-12 text-sm sm:text-base font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
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
          onClick={() => setTab('pyq')}
          className={`pb-3.5 px-3.5 min-h-12 text-sm sm:text-base font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${tab === 'pyq' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <BookOpen className="w-4 h-4" />
          PYQ Challenge
        </button>

        <button
          onClick={() => setTab('results')}
          className={`pb-3.5 px-3.5 min-h-12 text-sm sm:text-base font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
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

        <button
          onClick={() => setTab('request')}
          className={`pb-3.5 px-3.5 min-h-12 text-sm sm:text-base font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
            tab === 'request'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          Request Grand Test
          {pendingRequest && (
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>

        <button
          onClick={() => setTab('feedback')}
          className={`pb-3.5 px-3.5 min-h-12 text-sm sm:text-base font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
            tab === 'feedback'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-indigo-500" />
          Feedback & Suggestions
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
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 text-center text-slate-500 shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-slate-700">No tests available right now</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Check back later for today's daily mock or when an admin publishes a grand test.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {tests.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between min-h-56"
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

                  <h3 className="font-bold text-slate-900 text-lg leading-snug">{t.title}</h3>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600 mt-4 pt-4 border-t border-slate-100">
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
                  className="mt-6 w-full min-h-12 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
      ) : tab === 'pyq' ? (
        <PyqStudentPanel />
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
