import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/client';
import type { LeaderboardEntry } from '../../types';
import {
  Sparkles,
  Zap,
  Send,
  Users,
  Trophy,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Trash2,
  Clock,
  Calendar,
  RefreshCw,
  FileText
} from 'lucide-react';

interface AdminDashboardProps {
  onReviewAttempt: (attemptId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onReviewAttempt }) => {
  const [tab, setTab] = useState<'tests' | 'analytics' | 'leaderboard'>('tests');

  // One-click AI Generation state
  const [generatingType, setGeneratingType] = useState<'DAILY' | 'GRAND' | null>(null);
  const [aiInstructions, setAiInstructions] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customScheduledDate, setCustomScheduledDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [customTitle, setCustomTitle] = useState('');

  // Draft operations state
  const [generatingForTestId, setGeneratingForTestId] = useState<string | null>(null);
  const [publishingTestId, setPublishingTestId] = useState<string | null>(null);
  const [deletingTestId, setDeletingTestId] = useState<string | null>(null);

  // Data states
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [testAttempts, setTestAttempts] = useState<any[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string>('');
  const [availableTests, setAvailableTests] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysDailyMock = availableTests.find(
    (t) => t.testType === 'DAILY' && t.scheduledDate === todayStr
  );
  const grandTestsCount = availableTests.filter((t) => t.testType === 'GRAND').length;

  useEffect(() => {
    loadTabContent();
  }, [tab]);

  const loadTabContent = async () => {
    setLoading(true);
    setMessage(null);
    try {
      if (tab === 'tests') {
        const tests = await apiRequest<any[]>('/api/v1/admin/tests');
        setAvailableTests(tests);
      } else if (tab === 'leaderboard') {
        const data = await apiRequest<LeaderboardEntry[]>('/api/v1/admin/analytics/leaderboard');
        setLeaderboard(data);
      } else if (tab === 'analytics') {
        const tests = await apiRequest<any[]>('/api/v1/admin/tests');
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

  // 1-Click Automated Generation
  const handleAutoGenerate = async (type: 'DAILY' | 'GRAND', dateOverride?: string) => {
    setGeneratingType(type);
    setMessage(null);
    try {
      const payload: any = {
        testType: type,
        instructions: aiInstructions.trim() || undefined,
      };

      if (type === 'DAILY') {
        payload.scheduledDate = dateOverride || (showAdvanced ? customScheduledDate : todayStr);
      }
      if (showAdvanced && customTitle.trim()) {
        payload.customTitle = customTitle.trim();
      }

      const res: any = await apiRequest('/api/v1/admin/tests/auto-generate', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setMessage({
        type: 'success',
        text: res.message || `Successfully generated and published ${res.title} with ${res.questionCount} questions!`,
      });
      setCustomTitle('');
      await loadTabContent();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Automated question generation failed. Check OpenRouter connection.',
      });
    } finally {
      setGeneratingType(null);
    }
  };

  const handleDeleteTest = async (testId: string, testTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${testTitle}"? This cannot be undone.`)) {
      return;
    }
    setDeletingTestId(testId);
    setMessage(null);
    try {
      await apiRequest(`/api/v1/admin/tests/${testId}`, { method: 'DELETE' });
      setMessage({ type: 'success', text: `Deleted "${testTitle}" successfully.` });
      await loadTabContent();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete test.' });
    } finally {
      setDeletingTestId(null);
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
      {/* Top Banner (Matches Student Dashboard) */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-blue-500/15 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Admin Control Center</h1>
        <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
          Generate complete question papers with a single click using OpenRouter AI, publish them instantly, and monitor student performance.
        </p>
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
              {/* Single-Click Automated Test Generation */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    Automated Question Paper Generator
                  </h2>
                  <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200/60 hidden sm:inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Powered by OpenRouter AI
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mb-5">
                  Click a button to generate complete questions with conceptual explanations across DCME, Math, Physics, and Chemistry, and automatically publish them live for students.
                </p>

                {/* Optional Topic Instructions */}
                <div className="mb-5 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Optional Syllabus Focus / Topics
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Focus on Computer Networks, Operating Systems, and Calculus (or leave blank for standard syllabus)"
                    value={aiInstructions}
                    onChange={(e) => setAiInstructions(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <div className="flex items-center justify-end mt-1.5">
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="text-[11px] text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
                    >
                      {showAdvanced ? 'Hide date/title options' : 'Customize date or title'}
                    </button>
                  </div>

                  {showAdvanced && (
                    <div className="grid sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">Scheduled Date (Daily Mocks)</label>
                        <input
                          type="date"
                          value={customScheduledDate}
                          onChange={(e) => setCustomScheduledDate(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">Custom Title Override</label>
                        <input
                          type="text"
                          placeholder="e.g. Weekend Special Mock"
                          value={customTitle}
                          onChange={(e) => setCustomTitle(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* The Two 1-Click Action Cards */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Daily Mock Card */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 hover:bg-slate-50 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-md">
                          Daily Mock
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3" /> Untimed
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-0.5">
                        50 Questions • 50 Marks
                      </h3>
                      <p className="text-xs text-slate-500 mb-3">
                        25 DCME • 13 Maths • 6 Physics • 6 Chemistry
                      </p>
                      {todaysDailyMock && todaysDailyMock.status === 'PUBLISHED' && (
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg mb-3">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Today's mock is live ({todaysDailyMock.title})
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAutoGenerate('DAILY')}
                      disabled={generatingType !== null}
                      className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {generatingType === 'DAILY' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Generating 50 MCQs & Publishing...
                        </>
                      ) : todaysDailyMock ? (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          Regenerate Today's Daily Mock
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          Auto-Generate Today's Mock (50 Qs)
                        </>
                      )}
                    </button>
                  </div>

                  {/* Grand Test Card */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 hover:bg-slate-50 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-md">
                          Full Grand Test
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3" /> 180 Mins
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-0.5">
                        200 Questions • 200 Marks
                      </h3>
                      <p className="text-xs text-slate-500 mb-3">
                        100 DCME • 50 Maths • 25 Physics • 25 Chemistry
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAutoGenerate('GRAND')}
                      disabled={generatingType !== null}
                      className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {generatingType === 'GRAND' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Generating 200 MCQs & Publishing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          Auto-Generate Grand Test #{grandTestsCount + 1}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Published & Active Tests List */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    All Test Papers ({availableTests.length})
                  </h2>
                  <button
                    onClick={loadTabContent}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                  </button>
                </div>

                {availableTests.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    No tests created yet. Click one of the buttons above to instantly generate your first test!
                  </p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {availableTests.map((t) => (
                      <div
                        key={t.id}
                        className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                t.testType === 'GRAND'
                                  ? 'bg-indigo-100 text-indigo-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {t.testType}
                            </span>
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                t.status === 'PUBLISHED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {t.status}
                            </span>
                            {t.scheduledDate && (
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {t.scheduledDate}
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm">{t.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {t.questionCount} Questions • {t.durationMinutes > 0 ? `${t.durationMinutes} mins` : 'Untimed'} • Total {t.totalMarks} Marks
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {t.status === 'DRAFT' && (
                            <>
                              <button
                                onClick={() => handleGenerateAI(t.id)}
                                disabled={generatingForTestId === t.id}
                                className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                                {generatingForTestId === t.id ? 'Generating...' : 'Fill with AI'}
                              </button>

                              <button
                                onClick={() => handlePublish(t.id)}
                                disabled={publishingTestId === t.id}
                                className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                              >
                                <Send className="w-3.5 h-3.5" />
                                {publishingTestId === t.id ? 'Publishing...' : 'Publish'}
                              </button>
                            </>
                          )}

                          {t.status === 'PUBLISHED' && (
                            <button
                              onClick={() => {
                                setSelectedTestId(t.id);
                                loadTestAttempts(t.id);
                                setTab('analytics');
                              }}
                              className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Users className="w-3.5 h-3.5" /> Submissions
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteTest(t.id, t.title)}
                            disabled={deletingTestId === t.id}
                            title="Delete test (if no student attempts exist)"
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
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
