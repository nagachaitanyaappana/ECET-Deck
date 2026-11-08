import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../api/client';
import { Activity, TrendingUp, TrendingDown, Target, BookOpen, Lightbulb, RefreshCw, Award, Sparkles } from 'lucide-react';

type Analytics = {
  summary: { completedAttempts:number; recentAverage:number; personalBest:number; preparationStatus:string; statusBasedOnAttempts:number };
  history: Array<{attemptId:string;assessmentType:string;testCategory:string;title:string;score:number;totalMarks:number;percentage:number;changeFromPrevious:number|null;submittedAt:string}>;
  subjects: Array<{subject:string;questionsSeen:number;correctCount:number;accuracy:number;status:string}>;
  weakTopics: Array<{topic:string;subject:string;questionsSeen:number;correctCount:number;accuracy:number}>;
  recommendations: string[];
};

const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
  GETTING_STARTED: { label: 'Getting Started', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
  NEEDS_IMPROVEMENT: { label: 'Needs Improvement', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  MAKING_PROGRESS: { label: 'Making Progress', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  GOOD_PREPARATION: { label: 'Good Preparation', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  EXAM_READY: { label: 'Exam Ready', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
};

export const StudentAnalyticsPanel: React.FC = () => {
  const [data, setData] = useState<Analytics|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    apiRequest<Analytics>('/api/v1/my/analytics')
      .then(setData)
      .catch(e => setError(e.message || 'Unable to load your progress.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-500">
        <div className="w-8 h-8 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold">Analyzing your practice attempts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 flex items-center justify-between">
        <span>{error}</span>
        <button onClick={load} className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs cursor-pointer">
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;
  const { summary, history, subjects, weakTopics, recommendations } = data;
  const statusInfo = statusConfig[summary.preparationStatus] || { label: summary.preparationStatus, bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };

  return (
    <section className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
              Personalized
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              Preparation Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track your score trajectories, subject accuracy, and high-yield focus areas.
          </p>
        </div>

        <button
          onClick={load}
          className="p-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer shadow-xs"
          title="Refresh stats"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Completed Tests</span>
            <Award className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            {summary.completedAttempts}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Total submitted papers</div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Recent Average</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            {summary.recentAverage}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Last 5 practice tests</div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Personal Best</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-heading">
            {summary.personalBest.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Highest achieved score</div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>Readiness Status</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-extrabold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}>
            {statusInfo.label}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Based on {summary.statusBasedOnAttempts} recent sessions
          </div>
        </div>
      </div>

      {/* Subject Performance Meters */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <h3 className="font-bold text-slate-900 font-heading text-base flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-indigo-600" />
          Subject Mastery Breakdown
        </h3>

        {subjects.length === 0 ? (
          <p className="text-xs sm:text-sm text-slate-500 py-3">Complete your first test attempt to view subject mastery stats.</p>
        ) : (
          <div className="space-y-4">
            {subjects.map(s => {
              const barColor =
                s.subject === 'DCME' ? 'bg-blue-600' :
                s.subject === 'MATHEMATICS' ? 'bg-amber-500' :
                s.subject === 'PHYSICS' ? 'bg-cyan-500' : 'bg-emerald-500';

              return (
                <div key={s.subject} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="font-bold text-slate-800">{s.subject}</span>
                    <span className="font-semibold text-slate-600">
                      <strong className="text-slate-900">{s.accuracy}%</strong> ({s.correctCount}/{s.questionsSeen} correct)
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200/40">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${s.accuracy}%` }}
                    />
                  </div>
                  <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    {s.status === 'STRONG' && <span className="text-emerald-600 font-bold">✓ Strong syllabus domain</span>}
                    {s.status === 'DEVELOPING' && <span className="text-amber-600 font-bold">• Developing proficiency</span>}
                    {s.status === 'NEEDS_ATTENTION' && <span className="text-rose-600 font-bold">⚠️ Needs revision</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Score History */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <h3 className="font-bold text-slate-900 font-heading text-base flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-blue-600" />
          Score Trajectory & History
        </h3>

        {history.length === 0 ? (
          <p className="text-xs sm:text-sm text-slate-500 py-3">
            Your performance timeline will populate as you complete mock exams.
          </p>
        ) : (
          <div className="space-y-3">
            {[...history].reverse().map(a => (
              <div
                key={a.attemptId}
                className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 flex items-center justify-between gap-4 transition-colors"
              >
                <div className="min-w-0">
                  <div className="font-bold text-sm text-slate-800 truncate">
                    {a.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {a.assessmentType === 'PYQ' ? 'Previous-Year Mock' : `${a.testCategory} Mock`} • {new Date(a.submittedAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-black text-slate-900 text-sm sm:text-base">
                    {a.score} / {a.totalMarks}{' '}
                    <span className="text-xs font-bold text-indigo-600">({a.percentage.toFixed(1)}%)</span>
                  </div>
                  {a.changeFromPrevious !== null && (
                    <div className={`text-[11px] font-bold flex items-center justify-end gap-0.5 mt-0.5 ${
                      a.changeFromPrevious >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {a.changeFromPrevious >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {a.changeFromPrevious > 0 ? '+' : ''}{a.changeFromPrevious.toFixed(1)}% vs prior attempt
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weak Topics & Next Steps */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="glass-card rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <h3 className="font-bold text-slate-900 font-heading text-base flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-amber-600" />
            Priority Topics to Revisit
          </h3>
          {weakTopics.length === 0 ? (
            <p className="text-xs sm:text-sm text-slate-500 py-3">
              Topic-level weakness analysis is calculated as you answer questions across tests.
            </p>
          ) : (
            <div className="space-y-2.5">
              {weakTopics.slice(0, 5).map(t => (
                <div key={t.subject + t.topic} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800">{t.topic}</div>
                    <div className="text-[11px] text-slate-500">{t.subject} • {t.questionsSeen} questions attempted</div>
                  </div>
                  <span className="text-xs font-black text-rose-700 bg-rose-50 border border-rose-100 px-2 py-1 rounded-lg">
                    {t.accuracy}% acc
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <h3 className="font-bold text-slate-900 font-heading text-base flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Recommended Next Actions
          </h3>
          <ul className="space-y-3">
            {recommendations.map((r, i) => (
              <li key={i} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100/60 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
