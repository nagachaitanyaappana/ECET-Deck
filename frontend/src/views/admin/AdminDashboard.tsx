import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/client';
import type { LeaderboardEntry } from '../../types';
import {
  Sparkles,
  Send,
  PlusCircle,
  Users,
  Trophy,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

interface AdminDashboardProps {
  onReviewAttempt: (attemptId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onReviewAttempt }) => {
  const [tab, setTab] = useState<'tests' | 'analytics' | 'leaderboard'>('tests');

  // Test creation state
  const [title, setTitle] = useState('');
  const [testType, setTestType] = useState<'GRAND' | 'DAILY'>('DAILY');
  const [scheduledDate, setScheduledDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [aiInstructions, setAiInstructions] = useState('');
  const [creatingTest, setCreatingTest] = useState(false);
  const [generatingForTestId, setGeneratingForTestId] = useState<string | null>(null);
  const [publishingTestId, setPublishingTestId] = useState<string | null>(null);

  // Data states
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [testAttempts, setTestAttempts] = useState<any[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string>('');
  const [availableTests, setAvailableTests] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadTabContent();
  }, [tab]);

  const loadTabContent = async () => {
    setLoading(true);
    setMessage(null);
    try {
      if (tab === 'tests') {
        const tests = await apiRequest<any[]>('/api/v1/tests');
        setAvailableTests(tests);
      } else if (tab === 'leaderboard') {
        const data = await apiRequest<LeaderboardEntry[]>('/api/v1/admin/analytics/leaderboard');
        setLeaderboard(data);
      } else if (tab === 'analytics') {
        const tests = await apiRequest<any[]>('/api/v1/tests');
        setAvailableTests(tests);
        if (tests.length > 0 && !selectedTestId) {
          setSelectedTestId(tests[0].id);
          loadTestAttempts(tests[0].id);
        }
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load content' });
    } finally {
      setLoading(false);
    }
  };

  const loadTestAttempts = async (testId: string) => {
    try {
      const attempts = await apiRequest<any[]>(`/api/v1/admin/tests/${testId}/attempts`);
      setTestAttempts(attempts);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load attempts for this test' });
    }
  };

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingTest(true);
    setMessage(null);
    try {
      const payload: any = { title, testType };
      if (testType === 'DAILY') {
        payload.scheduledDate = scheduledDate;
      }
      const created = await apiRequest<any>('/api/v1/admin/tests', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setMessage({
        type: 'success',
        text: `Created draft test "${created.title}". Now you can generate questions using AI!`,
      });
      setTitle('');
      loadTabContent();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to create test' });
    } finally {
      setCreatingTest(false);
    }
  };

  const handleGenerateAI = async (testId: string) => {
    setGeneratingForTestId(testId);
    setMessage(null);
    try {
      const res: any = await apiRequest(`/api/v1/admin/tests/${testId}/generate`, {
        method: 'POST',
        body: JSON.stringify({ instructions: aiInstructions }),
      });
      setMessage({
        type: 'success',
        text: `Success! Added ${res.questionsAdded} AI questions across subjects. You can now publish it.`,
      });
      loadTabContent();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'AI Question Generation failed.' });
    } finally {
      setGeneratingForTestId(null);
    }
  };

  const handlePublish = async (testId: string) => {
    setPublishingTestId(testId);
    setMessage(null);
    try {
      await apiRequest(`/api/v1/admin/tests/${testId}/publish`, {
        method: 'POST',
      });
      setMessage({ type: 'success', text: 'Test successfully published for students!' });
      loadTabContent();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to publish test.' });
    } finally {
      setPublishingTestId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Control Center</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create question papers, generate MCQs with OpenRouter AI, and monitor student performance.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        <button
          onClick={() => setTab('tests')}
          className={`pb-3 px-3 text-sm font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            tab === 'tests'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Test Paper Management
        </button>

        <button
          onClick={() => setTab('analytics')}
          className={`pb-3 px-3 text-sm font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            tab === 'analytics'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Student Submissions
        </button>

        <button
          onClick={() => setTab('leaderboard')}
          className={`pb-3 px-3 text-sm font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            tab === 'leaderboard'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Friends Leaderboard
        </button>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-start gap-2.5 text-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-500">
          <div className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mb-3" />
          <p className="text-sm">Loading admin data...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: Tests */}
      {tab === 'tests' && (
        <div className="space-y-6">
          {/* Create Test Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-600" />
              Create New Test Paper
            </h2>

            <form onSubmit={handleCreateTest} className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Test Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daily Mock - Day 14"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Test Type</label>
                <select
                  value={testType}
                  onChange={(e: any) => setTestType(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                >
                  <option value="DAILY">Daily Mock (50 Qs: 25 DCME, 13 Math, 6 Phys, 6 Chem - Untimed)</option>
                  <option value="GRAND">Grand Test (200 Qs: 100 DCME, 50 Math, 25 Phys, 25 Chem - 180 Mins)</option>
                </select>
              </div>

              {testType === 'DAILY' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Scheduled Date (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              )}

              <div className={testType === 'DAILY' ? 'sm:col-span-1 flex items-end' : 'sm:col-span-2'}>
                <button
                  type="submit"
                  disabled={creatingTest}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {creatingTest ? 'Creating Draft...' : 'Create Draft Test'}
                </button>
              </div>
            </form>
          </div>

          {/* AI Generator Helper Box */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-purple-900 font-bold text-sm mb-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              AI Question Generator Focus (Optional)
            </div>
            <p className="text-xs text-purple-800 mb-3">
              Give OpenRouter specific topic instructions (e.g. "Focus on Computer Networks, DBMS Normalization, and C Pointers").
            </p>
            <input
              type="text"
              placeholder="e.g. Emphasize Operating Systems scheduling and Data Structures trees"
              value={aiInstructions}
              onChange={(e) => setAiInstructions(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-purple-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 mb-3"
            />
          </div>

          {/* Available / Published tests list */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">Published & Active Tests</h2>
            {availableTests.length === 0 ? (
              <p className="text-xs text-slate-500">No active tests currently published.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {availableTests.map((t) => (
                  <div key={t.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md">
                          {t.testType}
                        </span>
                        {t.scheduledDate && <span className="text-xs text-slate-400">{t.scheduledDate}</span>}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{t.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {t.questionCount} Questions • {t.durationMinutes > 0 ? `${t.durationMinutes} mins` : 'Untimed'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleGenerateAI(t.id)}
                        disabled={generatingForTestId === t.id}
                        className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        {generatingForTestId === t.id ? 'Generating...' : 'Fill Questions with AI'}
                      </button>

                      <button
                        onClick={() => handlePublish(t.id)}
                        disabled={publishingTestId === t.id}
                        className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {publishingTestId === t.id ? 'Publishing...' : 'Publish'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Student Submissions */}
      {tab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <label className="block text-xs font-semibold text-slate-700 mb-2">Select Test to Inspect</label>
            <select
              value={selectedTestId}
              onChange={(e) => {
                setSelectedTestId(e.target.value);
                loadTestAttempts(e.target.value);
              }}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
            >
              {availableTests.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.testType})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Student Results & Submissions</h3>
            {testAttempts.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No students have submitted this test yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {testAttempts.map((att, idx) => (
                  <div key={att.attemptId} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{att.studentDisplayName}</div>
                        <div className="text-xs text-slate-400">{att.studentEmail}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-slate-900 text-sm">
                          {att.score} / {att.totalMarks}
                        </div>
                        <div className="text-xs text-emerald-600 font-semibold">{att.correctCount} Correct</div>
                      </div>

                      <button
                        onClick={() => onReviewAttempt(att.attemptId)}
                        className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Review Attempt</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Leaderboard */}
      {tab === 'leaderboard' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Friends Leaderboard</h2>
              <p className="text-xs text-slate-500">Overall standings across all completed practice tests</p>
            </div>
          </div>

          {leaderboard.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No scores recorded yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {leaderboard.map((entry, idx) => (
                <div key={entry.studentId} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                        idx === 0
                          ? 'bg-amber-400 text-white shadow-sm'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-800'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div>
                      <div className="font-bold text-slate-900 text-sm">{entry.displayName}</div>
                      <div className="text-xs text-slate-400">{entry.testsCompleted} Tests Completed</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-extrabold text-slate-900">
                      {entry.totalScore} <span className="text-xs font-normal text-slate-400">pts</span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">Avg: {entry.averageScore} marks</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
        </>
      )}
    </div>
  );
};
