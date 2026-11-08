import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../api/client';
import { Activity, TrendingUp, TrendingDown, Target, BookOpen, Lightbulb, RefreshCw } from 'lucide-react';

type Analytics = {
  summary: { completedAttempts:number; recentAverage:number; personalBest:number; preparationStatus:string; statusBasedOnAttempts:number };
  history: Array<{attemptId:string;assessmentType:string;testCategory:string;title:string;score:number;totalMarks:number;percentage:number;changeFromPrevious:number|null;submittedAt:string}>;
  subjects: Array<{subject:string;questionsSeen:number;correctCount:number;accuracy:number;status:string}>;
  weakTopics: Array<{topic:string;subject:string;questionsSeen:number;correctCount:number;accuracy:number}>;
  recommendations: string[];
};
const statusLabel=(s:string)=>({GETTING_STARTED:'Getting started',NEEDS_IMPROVEMENT:'Needs improvement',MAKING_PROGRESS:'Making progress',GOOD_PREPARATION:'Good preparation',EXAM_READY:'Exam ready'} as Record<string,string>)[s]||s;
export const StudentAnalyticsPanel:React.FC=()=>{
  const [data,setData]=useState<Analytics|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const load=()=>{setLoading(true);setError('');apiRequest<Analytics>('/api/v1/my/analytics').then(setData).catch(e=>setError(e.message||'Unable to load your progress.')).finally(()=>setLoading(false));};
  useEffect(()=>{load();},[]);
  if(loading)return <div className="py-12 text-center text-slate-500">Loading your personal progress...</div>;
  if(error)return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}<button onClick={load} className="ml-3 underline">Retry</button></div>;
  if(!data)return null;
  const {summary,history,subjects,weakTopics,recommendations}=data;
  const label=statusLabel(summary.preparationStatus);
  return <section className="space-y-5">
    <div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-bold text-slate-900">My preparation</h2><p className="text-sm text-slate-500">Your progress compared only with your own previous attempts.</p></div><button onClick={load} className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50" aria-label="Refresh analytics"><RefreshCw className="w-4 h-4"/></button></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[['Completed tests',summary.completedAttempts],['Recent average',summary.recentAverage+'%'],['Personal best',summary.personalBest.toFixed(1)+'%'],['Preparation status',label]].map(([name,value])=><div key={String(name)} className="bg-white border border-slate-200 rounded-xl p-4"><div className="text-xs text-slate-500">{name}</div><div className="mt-2 text-xl font-black text-slate-900">{value}</div>{name==='Preparation status'&&<div className="text-[11px] text-slate-400 mt-1">Based on {summary.statusBasedOnAttempts} recent attempts</div>}</div>)}
    </div>
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <h3 className="font-bold text-slate-900 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-600"/>Your score history</h3>
      {history.length===0?<p className="text-sm text-slate-500 mt-3">Complete a mock test or PYQ Challenge to start building your progress history.</p>:<div className="space-y-3 mt-4">{[...history].reverse().map((a,i)=><div key={a.attemptId} className="grid grid-cols-[1fr_auto] gap-3 items-center border-b border-slate-100 pb-3 last:border-0"><div className="min-w-0"><div className="font-semibold text-sm text-slate-800 truncate">{a.title}</div><div className="text-xs text-slate-500">{a.assessmentType==='PYQ'?'Previous-year questions':a.testCategory+' mock'} · {new Date(a.submittedAt).toLocaleDateString()}</div></div><div className="text-right"><div className="font-bold text-slate-900">{a.score}/{a.totalMarks} <span className="text-xs text-slate-500">({a.percentage.toFixed(1)}%)</span></div>{a.changeFromPrevious!==null&&<div className={'text-xs flex items-center justify-end gap-1 '+(a.changeFromPrevious>=0?'text-emerald-700':'text-rose-700')}>{a.changeFromPrevious>=0?<TrendingUp className="w-3 h-3"/>:<TrendingDown className="w-3 h-3"/>}{a.changeFromPrevious>0?'+':''}{a.changeFromPrevious.toFixed(1)} pp vs previous {a.assessmentType} attempt</div>}</div></div>)}</div>}
    </div>
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <h3 className="font-bold text-slate-900 flex items-center gap-2"><Target className="w-4 h-4 text-indigo-600"/>Subject performance</h3>
      {subjects.length===0?<p className="text-sm text-slate-500 mt-3">Subject insights appear after you complete a test.</p>:<div className="space-y-4 mt-4">{subjects.map(s=><div key={s.subject}><div className="flex justify-between gap-2 text-sm mb-1"><span className="font-semibold text-slate-700">{s.subject}</span><span className="text-slate-600">{s.accuracy}% · {s.correctCount}/{s.questionsSeen}</span></div><div className="h-2.5 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-blue-600" style={{width:s.accuracy+'%'}}/></div><div className="text-[11px] text-slate-400 mt-1">{s.status==='STRONG'?'Strong area':s.status==='DEVELOPING'?'Developing':'Needs attention'}</div></div>)}</div>}
    </div>
    <div className="grid lg:grid-cols-2 gap-5">
      <div className="bg-white border border-slate-200 rounded-2xl p-5"><h3 className="font-bold text-slate-900 flex items-center gap-2"><BookOpen className="w-4 h-4 text-amber-600"/>Topics to revisit</h3>{weakTopics.length===0?<p className="text-sm text-slate-500 mt-3">Topic-level insights will appear as you complete PYQ attempts with topic-tagged questions.</p>:<div className="space-y-3 mt-3">{weakTopics.slice(0,5).map(t=><div key={t.subject+t.topic} className="flex items-center justify-between gap-3"><div><div className="text-sm font-semibold text-slate-800">{t.topic}</div><div className="text-xs text-slate-500">{t.subject} · {t.questionsSeen} questions</div></div><span className="text-sm font-bold text-rose-700">{t.accuracy}%</span></div>)}</div>}</div>
      <div className="bg-white border border-slate-200 rounded-2xl p-5"><h3 className="font-bold text-slate-900 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-500"/>What to work on next</h3><ul className="space-y-3 mt-3">{recommendations.map((r,i)=><li key={i} className="text-sm text-slate-600 flex gap-2"><span className="text-blue-600 font-bold">{i+1}.</span>{r}</li>)}</ul></div>
    </div>
    <p className="text-xs text-slate-400">Insights are based on your submitted attempts only. PYQ topic analysis depends on questions having accurate topic tags. No other student's scores are used.</p>
  </section>;
};
