import React, { useState, useEffect, useMemo } from 'react';
import { apiRequest } from '../../api/client';
import type { LeaderboardEntry, GrandTestRequest, FeedbackItem } from '../../types';
import { Server } from 'lucide-react';
import { ServerSettingsPanel } from './ServerSettingsPanel';
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
  FileText,
  MessageSquare,
  UploadCloud,
  Database,
  PlusCircle
} from 'lucide-react';

interface AdminDashboardProps {
  onReviewAttempt: (attemptId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onReviewAttempt }) => {
  const [tab, setTab] = useState<'tests' | 'analytics' | 'leaderboard' | 'requests' | 'feedbacks' | 'pyq' | 'papers' | 'questions' | 'settings'>('tests');

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
  const [pyqAttempts, setPyqAttempts] = useState<any[]>([]);
  const [pyqReview, setPyqReview] = useState<any | null>(null);
  const [pyqPapers, setPyqPapers] = useState<any[]>([]);
  const [paperTitle, setPaperTitle] = useState('');
  const [paperYear, setPaperYear] = useState(String(new Date().getFullYear()));
  const [paperType, setPaperType] = useState<'QUESTION_PAPER' | 'ANSWER_KEY'>('QUESTION_PAPER');
  const [paperSource, setPaperSource] = useState('');
  const [paperAttribution, setPaperAttribution] = useState('');
  const [paperUrl, setPaperUrl] = useState('');
  const [uploadingPaper, setUploadingPaper] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<string>('');
  const [availableTests, setAvailableTests] = useState<any[]>([]);
  const [requests, setRequests] = useState<GrandTestRequest[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [pendingRequestsCount, setPendingRequestsCount] = useState<number>(0);
  const [openFeedbacksCount, setOpenFeedbacksCount] = useState<number>(0);

  // Question Bank states
  const [pyqQuestions, setPyqQuestions] = useState<any[]>([]);
  const [questionSubjectFilter, setQuestionSubjectFilter] = useState('');
  const [questionYearFilter, setQuestionYearFilter] = useState('');
  const [bulkJsonText, setBulkJsonText] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [importingBulk, setImportingBulk] = useState(false);

  // Grand test fulfillment state
  const [fulfillingId, setFulfillingId] = useState<string | null>(null);

  // Feedback response state
  const [replyingFeedbackId, setReplyingFeedbackId] = useState<string | null>(null);
  const [adminNoteDraft, setAdminNoteDraft] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysDailyMock = availableTests.find(
    (t) => t.testType === 'DAILY' && t.scheduledDate === todayStr
  );
  const grandTestsCount = availableTests.filter((t) => t.testType === 'GRAND').length;

  useEffect(() => {
    loadTabContent();
    fetchBadges();
  }, [tab]);

  const fetchBadges = async () => {
    try {
      const [reqData, fbData] = await Promise.all([
        apiRequest<GrandTestRequest[]>('/api/v1/admin/requests/grand-test').catch(() => []),
        apiRequest<FeedbackItem[]>('/api/v1/admin/feedbacks').catch(() => [])
      ]);
      setPendingRequestsCount(reqData.filter((r) => r.status === 'PENDING').length);
      setOpenFeedbacksCount(fbData.filter((f) => f.status === 'OPEN').length);
    } catch {}
  };

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
      } else if (tab === 'papers') {
        const data = await apiRequest<any[]>('/api/v1/admin/pyq/papers');
        setPyqPapers(data);
      } else if (tab === 'pyq') {
        const data = await apiRequest<any[]>('/api/v1/admin/pyq/attempts');
        setPyqAttempts(data);
        setPyqReview(null);
      } else if (tab === 'requests') {
        const data = await apiRequest<GrandTestRequest[]>('/api/v1/admin/requests/grand-test');
        setRequests(data);
        setPendingRequestsCount(data.filter((r) => r.status === 'PENDING').length);
      } else if (tab === 'feedbacks') {
        const data = await apiRequest<FeedbackItem[]>('/api/v1/admin/feedbacks');
        setFeedbacks(data);
        setOpenFeedbacksCount(data.filter((f) => f.status === 'OPEN').length);
      } else if (tab === 'questions') {
        const queryParams = new URLSearchParams();
        if (questionSubjectFilter) queryParams.set('subject', questionSubjectFilter);
        if (questionYearFilter) queryParams.set('year', questionYearFilter);
        queryParams.set('includeUnverified', 'true');
        const qs = await apiRequest<any[]>(`/api/v1/admin/pyq/questions?${queryParams.toString()}`);
        setPyqQuestions(qs);
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

  const handleRegisterPaper = async (event: React.FormEvent) => {
    event.preventDefault();
    setUploadingPaper(true); setMessage(null);
    try {
      await apiRequest('/api/v1/admin/pyq/papers/link', { method: 'POST', body: JSON.stringify({
        title: paperTitle.trim(), examYear: Number(paperYear), paperType, googleDriveUrl: paperUrl.trim(),
        sourceName: paperSource.trim(), attribution: paperAttribution.trim()
      }) });
      setMessage({ type: 'success', text: 'Google Drive paper link added to the student library.' });
      setPaperTitle(''); setPaperUrl(''); setPaperSource(''); setPaperAttribution('');
      const papers = await apiRequest<any[]>('/api/v1/admin/pyq/papers');
      setPyqPapers(papers);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Could not register the Google Drive paper.' });
    } finally { setUploadingPaper(false); }
  };

  const handleBulkImportQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setImportingBulk(true);
    setMessage(null);
    try {
      const parsed = JSON.parse(bulkJsonText.trim());
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('Please provide a non-empty JSON array of questions.');
      }
      const res = await apiRequest<any[]>('/api/v1/admin/pyq/questions/bulk', {
        method: 'POST',
        body: JSON.stringify(parsed)
      });
      setMessage({ type: 'success', text: `Successfully imported ${res.length} verified questions into the PYQ Bank!` });
      setBulkJsonText('');
      setShowBulkModal(false);
      loadTabContent();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Bulk question import failed. Please check JSON syntax.' });
    } finally {
      setImportingBulk(false);
    }
  };

  const verifiedCounts = useMemo(() => {
    const counts = { DCME: 0, MATHEMATICS: 0, PHYSICS: 0, CHEMISTRY: 0 };
    for (const q of pyqQuestions) {
      if (q.verified && counts[q.subject as keyof typeof counts] !== undefined) {
        counts[q.subject as keyof typeof counts]++;
      }
    }
    return counts;
  }, [pyqQuestions]);
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

  const handleFulfillRequest = async (requestId: string, studentNote?: string) => {
    setFulfillingId(requestId);
    setMessage(null);
    try {
      const res: any = await apiRequest(`/api/v1/admin/requests/grand-test/${requestId}/fulfill`, {
        method: 'POST',
        body: JSON.stringify({
          autoGenerate: true,
          instructions: studentNote || undefined,
        }),
      });
      setMessage({
        type: 'success',
        text: `Grand Test generated and request fulfilled! Created "${res.testTitle}".`,
      });
      await loadTabContent();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Failed to fulfill request and generate Grand Test.',
      });
    } finally {
      setFulfillingId(null);
    }
  };

  const handleDismissRequest = async (requestId: string) => {
    try {
      await apiRequest(`/api/v1/admin/requests/grand-test/${requestId}/dismiss`, { method: 'POST' });
      setMessage({ type: 'success', text: 'Request dismissed.' });
      await loadTabContent();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to dismiss request.' });
    }
  };

  const handleUpdateFeedbackStatus = async (feedbackId: string, status: 'REVIEWED' | 'RESOLVED', adminNotes?: string) => {
    try {
      await apiRequest(`/api/v1/admin/feedbacks/${feedbackId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, adminNotes: adminNotes || undefined }),
      });
      setMessage({ type: 'success', text: `Feedback marked as ${status}.` });
      setReplyingFeedbackId(null);
      setAdminNoteDraft('');
      await loadTabContent();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update feedback status.' });
    }
  };

  return (
    <div className="dashboard-shell">
      {/* Top Banner (Matches Student Dashboard) */}
      <div className="dashboard-hero">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Control Center</h1>
        <p className="text-blue-100 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
          Generate complete question papers with a single click using OpenRouter AI, publish them instantly, and monitor student performance.
        </p>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-30 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 bg-white/95 p-2 rounded-2xl border border-slate-200 mb-8 backdrop-blur-md shadow-sm">
        <button
          onClick={() => setTab('tests')}
          className={`pb-3.5 px-3.5 min-h-12 text-sm sm:text-base font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
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
          className={`pb-3.5 px-3.5 min-h-12 text-sm sm:text-base font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
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
          className={`pb-3.5 px-3.5 min-h-12 text-sm sm:text-base font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
            tab === 'leaderboard'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Friends Leaderboard
        </button>

        <button
          onClick={() => setTab('requests')}
          className={`pb-3.5 px-3.5 min-h-12 text-sm sm:text-base font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
            tab === 'requests'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          Grand Test Requests
          {pendingRequestsCount > 0 && (
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold">
              {pendingRequestsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setTab('papers')}
          className={`pb-3.5 px-3.5 min-h-12 text-sm sm:text-base font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${tab === 'papers' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <UploadCloud className="w-4 h-4" />
          PYQ Papers
        </button>

        <button
          onClick={() => setTab('questions')}
          className={`pb-3.5 px-3.5 min-h-12 text-sm sm:text-base font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${tab === 'questions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <Database className="w-4 h-4" />
          PYQ Bank
        </button>

        <button
          onClick={() => setTab('pyq')}
          className={`pb-3.5 px-3.5 min-h-12 text-sm sm:text-base font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${tab === 'pyq' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <BookOpen className="w-4 h-4" />
          PYQ Monitoring
        </button>

        <button
          onClick={() => setTab('settings')}
          className={`pb-3.5 px-3.5 min-h-12 text-sm sm:text-base font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${tab === 'settings' ? 'border-lime-600 text-lime-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <Server className="w-4 h-4" />
          Server Settings
        </button>

        <button
          onClick={() => setTab('feedbacks')}
          className={`pb-3.5 px-3.5 min-h-12 text-sm sm:text-base font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
            tab === 'feedbacks'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-indigo-500" />
          Student Feedback
          {openFeedbacksCount > 0 && (
            <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full font-bold">
              {openFeedbacksCount}
            </span>
          )}
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
          {tab === 'settings' && <ServerSettingsPanel />}

          {tab === 'papers' && (
            <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-5">
              <form onSubmit={handleRegisterPaper} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <div><h2 className="text-lg font-bold text-slate-900">Add a Google Drive paper</h2><p className="text-sm text-slate-500 mt-1">Keep the PDF in Google Drive and register its sharing link here.</p></div>
                <label className="block text-sm font-medium text-slate-700">Paper title<input required maxLength={180} value={paperTitle} onChange={e=>setPaperTitle(e.target.value)} placeholder="ECET DCME 2025 Question Paper" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5"/></label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-sm font-medium text-slate-700">Exam year<input required type="number" min="2000" max="2100" value={paperYear} onChange={e=>setPaperYear(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5"/></label>
                  <label className="block text-sm font-medium text-slate-700">Document type<select value={paperType} onChange={e=>setPaperType(e.target.value as any)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5"><option value="QUESTION_PAPER">Question paper</option><option value="ANSWER_KEY">Answer key</option></select></label>
                </div>
                <label className="block text-sm font-medium text-slate-700">Google Drive sharing link<input required type="url" value={paperUrl} onChange={e=>setPaperUrl(e.target.value)} placeholder="https://drive.google.com/file/d/..." className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5"/></label>
                <label className="block text-sm font-medium text-slate-700">Source / publisher (optional)<input value={paperSource} onChange={e=>setPaperSource(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5"/></label>
                <label className="block text-sm font-medium text-slate-700">Attribution / notes (optional)<textarea value={paperAttribution} onChange={e=>setPaperAttribution(e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5"/></label>
                <button disabled={uploadingPaper} className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 disabled:opacity-50">{uploadingPaper?'Adding link...':'Add paper to library'}</button>
                <p className="text-xs text-slate-400">Set Drive access to “Anyone with the link — Viewer” so students can open the PDF.</p>
              </form>
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h2 className="text-lg font-bold text-slate-900">Published papers</h2>
                <div className="divide-y divide-slate-100 mt-3">
                  {pyqPapers.map(p=><div key={p.id} className="py-3 flex items-center justify-between gap-3"><div><div className="font-semibold text-sm text-slate-800">{p.title}</div><div className="text-xs text-slate-500">{p.examYear} · {p.paperType==='ANSWER_KEY'?'Answer key':'Question paper'} · {p.curriculum} · {p.active?'Published':'Hidden'}</div></div><div className="flex items-center gap-3">{p.publicUrl&&<a href={p.publicUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-700">Open PDF</a>}<button onClick={async()=>{try{await apiRequest('/api/v1/admin/pyq/papers/'+p.id+'/active',{method:'PATCH',body:JSON.stringify({active:!p.active})});const updated=await apiRequest<any[]>('/api/v1/admin/pyq/papers');setPyqPapers(updated);}catch(e:any){setMessage({type:'error',text:e.message||'Could not update paper.'});}}} className="text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1.5">{p.active?'Hide':'Publish'}</button></div></div>)}
                  {pyqPapers.length===0&&<p className="text-sm text-slate-500 py-5">No papers registered yet.</p>}
                </div>
              </div>
            </div>
          )}

          {tab === 'questions' && (
            <div className="space-y-6">
              {/* Blueprint Target Status Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">PYQ Exam Blueprint Readiness (C23)</h2>
                    <p className="text-sm text-slate-500">
                      The randomized 200-question exam requires verified questions across 4 subjects.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowBulkModal(!showBulkModal)}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    {showBulkModal ? 'Close Importer' : 'Bulk Import Questions'}
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  {[
                    { subject: 'DCME', target: 100, current: verifiedCounts.DCME },
                    { subject: 'MATHEMATICS', target: 50, current: verifiedCounts.MATHEMATICS },
                    { subject: 'PHYSICS', target: 25, current: verifiedCounts.PHYSICS },
                    { subject: 'CHEMISTRY', target: 25, current: verifiedCounts.CHEMISTRY }
                  ].map((item) => {
                    const isReady = item.current >= item.target;
                    const pct = Math.min(100, Math.round((item.current / item.target) * 100));
                    return (
                      <div key={item.subject} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                        <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                          <span>{item.subject}</span>
                          <span className={isReady ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                            {item.current} / {item.target}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${isReady ? 'bg-emerald-500' : 'bg-blue-600'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {isReady ? '✓ Blueprint satisfied' : `Need ${item.target - item.current} more`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bulk Importer Form */}
              {showBulkModal && (
                <form onSubmit={handleBulkImportQuestions} className="bg-white rounded-2xl border border-blue-200 p-6 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Bulk Import Questions (JSON)</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Import 1 to 250 verified questions with 4 options each into the C23 question bank.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setBulkJsonText(JSON.stringify([
                          {
                            subject: "DCME",
                            topic: "Data Structures",
                            curriculum: "C23",
                            questionText: "Which data structure follows the LIFO principle?",
                            explanation: "Stack follows Last In First Out.",
                            sourceYear: 2025,
                            sourcePaper: "AP ECET 2025",
                            sourceQuestionNumber: 1,
                            difficulty: "MEDIUM",
                            verified: true,
                            options: [
                              { text: "Queue", correct: false },
                              { text: "Stack", correct: true },
                              { text: "Tree", correct: false },
                              { text: "Graph", correct: false }
                            ]
                          }
                        ], null, 2));
                      }}
                      className="text-xs text-blue-600 hover:underline font-semibold"
                    >
                      Load Sample Template
                    </button>
                  </div>
                  <textarea
                    required
                    rows={8}
                    value={bulkJsonText}
                    onChange={(e) => setBulkJsonText(e.target.value)}
                    placeholder='[ { "subject": "DCME", "topic": "OS", "curriculum": "C23", "questionText": "...", "sourceYear": 2025, "sourcePaper": "...", "verified": true, "options": [ ... ] } ]'
                    className="w-full font-mono text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowBulkModal(false)}
                      className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={importingBulk}
                      className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm disabled:opacity-50"
                    >
                      {importingBulk ? 'Importing Questions...' : 'Submit Batch Import'}
                    </button>
                  </div>
                </form>
              )}

              {/* Question Browser & Filter */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Questions in Bank</h3>
                    <p className="text-xs text-slate-500">{pyqQuestions.length} questions matching filters</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={questionSubjectFilter}
                      onChange={(e) => setQuestionSubjectFilter(e.target.value)}
                      className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700"
                    >
                      <option value="">All Subjects</option>
                      <option value="DCME">DCME</option>
                      <option value="MATHEMATICS">Mathematics</option>
                      <option value="PHYSICS">Physics</option>
                      <option value="CHEMISTRY">Chemistry</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Year (e.g. 2025)"
                      value={questionYearFilter}
                      onChange={(e) => setQuestionYearFilter(e.target.value)}
                      className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 w-28 bg-white text-slate-700"
                    />
                    <button
                      type="button"
                      onClick={loadTabContent}
                      className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
                      title="Refresh"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {pyqQuestions.length === 0 ? (
                  <div className="py-10 text-center text-slate-500 text-sm">
                    No questions found. Use the Bulk Importer above to populate the verified question pool.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                    {pyqQuestions.map((q) => (
                      <div key={q.id} className="py-3.5 space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700">{q.subject}</span>
                            {q.topic && <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">{q.topic}</span>}
                            <span>· {q.sourcePaper || `PYQ ${q.sourceYear}`}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400">{q.difficulty}</span>
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${q.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              {q.verified ? 'Verified' : 'Unverified'}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-800 font-medium leading-relaxed">{q.questionText}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'pyq' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h2 className="text-lg font-bold text-slate-900">PYQ Challenge monitoring</h2>
                <p className="text-sm text-slate-500 mt-1">Only administrators can view these attempts. Refresh the tab to see the latest student activity.</p>
                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase text-slate-500 bg-slate-50"><tr><th className="p-3">Student</th><th className="p-3">Status</th><th className="p-3">Score</th><th className="p-3">Started</th><th className="p-3">Action</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {pyqAttempts.map((a) => (
                        <tr key={a.attemptId}>
                          <td className="p-3"><div className="font-semibold text-slate-900">{a.studentName}</div><div className="text-xs text-slate-500">{a.studentEmail}</div></td>
                          <td className="p-3">{a.status}</td>
                          <td className="p-3">{a.score ?? '—'} / {a.totalQuestions}</td>
                          <td className="p-3">{new Date(a.startedAt).toLocaleString()}</td>
                          <td className="p-3"><button onClick={async()=>{try{setPyqReview(await apiRequest<any>(`/api/v1/admin/pyq/attempts/${a.attemptId}/review`));}catch(e:any){setMessage({type:'error',text:e.message});}}} className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold">View answers</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {pyqAttempts.length===0&&<p className="text-sm text-slate-500 py-5">No PYQ attempts yet.</p>}
                </div>
              </div>
              {pyqReview&&(
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between gap-3"><div><h3 className="font-bold text-slate-900">{pyqReview.studentName} · Attempt review</h3><p className="text-xs text-slate-500">{pyqReview.studentEmail} · {pyqReview.status} · Score {pyqReview.score ?? 'pending'}</p></div><button onClick={()=>setPyqReview(null)} className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm">Close</button></div>
                  <div className="space-y-3 mt-4 max-h-[650px] overflow-y-auto">
                    {(pyqReview.questions||[]).map((q:any)=><div key={q.questionId} className="border border-slate-100 rounded-xl p-4"><div className="text-xs text-slate-500 mb-1">Q{q.questionOrder} · {q.subject} · PYQ {q.sourceYear}</div><p className="text-sm font-medium text-slate-900">{q.questionText}</p><p className="text-xs mt-2 text-slate-600">Student answer: {q.selectedOptionText||'Unanswered'}</p><p className="text-xs text-emerald-700 mt-1">Correct answer: {q.correctOptionText}</p></div>)}
                  </div>
                </div>
              )}
            </div>
          )}

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
                <p className="text-sm sm:text-base text-slate-500 mb-5 leading-relaxed">
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
                    className="w-full px-3.5 py-2 text-sm rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                      className="w-full min-h-12 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
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
                      className="w-full min-h-12 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
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
                                className="min-h-10 py-2 px-3.5 rounded-lg text-sm font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                                {generatingForTestId === t.id ? 'Generating...' : 'Fill with AI'}
                              </button>

                              <button
                                onClick={() => handlePublish(t.id)}
                                disabled={publishingTestId === t.id}
                                className="min-h-10 py-2 px-3.5 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
                              className="min-h-10 py-2 px-3.5 rounded-lg text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60 transition-colors flex items-center gap-1 cursor-pointer"
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
                        className="min-h-10 py-2 px-3.5 rounded-lg text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
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

      {/* TAB 4: Grand Test Requests */}
      {tab === 'requests' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Grand Test Requests</h2>
                <p className="text-xs text-slate-500">Student requests to generate and schedule the 200-question full exam</p>
              </div>
            </div>
            <button
              onClick={loadTabContent}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          {requests.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">No student requests submitted yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {requests.map((r) => (
                <div key={r.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                          r.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : r.status === 'FULFILLED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {r.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        Requested on {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 text-sm">
                      {r.studentName} <span className="font-normal text-xs text-slate-500">({r.studentEmail})</span>
                    </div>

                    {r.note && (
                      <p className="text-xs text-slate-600 mt-1 bg-slate-50 border border-slate-200/60 rounded-lg p-2.5 max-w-xl">
                        <span className="font-semibold text-slate-700">Student Note: </span>
                        {r.note}
                      </p>
                    )}

                    {r.generatedTestTitle && (
                      <p className="text-xs text-emerald-700 font-semibold mt-1">
                        ✓ Generated Paper: {r.generatedTestTitle}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {r.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleFulfillRequest(r.id, r.note)}
                          disabled={fulfillingId === r.id}
                          className="py-2 px-3.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          {fulfillingId === r.id ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Generating 200 MCQs...
                            </>
                          ) : (
                            <>
                              <Zap className="w-3.5 h-3.5" />
                              Auto-Generate & Fulfill
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleDismissRequest(r.id)}
                          className="py-2 px-3 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Student Feedbacks */}
      {tab === 'feedbacks' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Student Feedback & Reports</h2>
                <p className="text-xs text-slate-500">Suggestions, question typo alerts, and issue reports</p>
              </div>
            </div>
            <button
              onClick={loadTabContent}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          {feedbacks.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">No student feedback received yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {feedbacks.map((fb) => (
                <div key={fb.id} className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {fb.category.replace('_', ' ')}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          fb.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : fb.status === 'REVIEWED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {fb.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(fb.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {fb.status !== 'RESOLVED' && (
                        <button
                          onClick={() => {
                            if (replyingFeedbackId === fb.id) {
                              setReplyingFeedbackId(null);
                            } else {
                              setReplyingFeedbackId(fb.id);
                              setAdminNoteDraft(fb.adminNotes || '');
                            }
                          }}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 p-1 cursor-pointer"
                        >
                          {replyingFeedbackId === fb.id ? 'Close' : 'Reply & Update'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{fb.subject}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      By <span className="font-medium text-slate-700">{fb.userName}</span> ({fb.userEmail})
                    </p>
                    <p className="text-xs text-slate-700 mt-2 bg-slate-50 border border-slate-200/60 rounded-xl p-3 leading-relaxed">
                      {fb.message}
                    </p>
                  </div>

                  {fb.adminNotes && replyingFeedbackId !== fb.id && (
                    <div className="bg-indigo-50 border border-indigo-200/60 rounded-xl p-3 text-xs text-indigo-950">
                      <span className="font-bold text-indigo-900 block mb-0.5">Admin Response:</span>
                      {fb.adminNotes}
                    </div>
                  )}

                  {replyingFeedbackId === fb.id && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 mt-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        Admin Response Note to Student
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Thanks for spotting this! Fixed the option explanation."
                        value={adminNoteDraft}
                        onChange={(e) => setAdminNoteDraft(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateFeedbackStatus(fb.id, 'REVIEWED', adminNoteDraft)}
                          className="py-1 px-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Mark Reviewed
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateFeedbackStatus(fb.id, 'RESOLVED', adminNoteDraft)}
                          className="py-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Resolve & Send Response
                        </button>
                      </div>
                    </div>
                  )}
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
