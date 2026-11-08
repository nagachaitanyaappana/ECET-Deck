import React, { useEffect, useMemo, useRef, useState } from 'react';
import { apiRequest } from '../../api/client';
import { BookOpen, Clock3, FileText, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

type Option = { id: string; label: string; text: string };
type Question = { id: string; subject: string; topic?: string; questionText: string; questionOrder: number; sourceYear: number; sourcePaper: string; options: Option[]; selectedOptionId?: string | null };
type Attempt = { attemptId: string; status: string; startedAt: string; durationMinutes: number; questions: Question[] };
type Paper = { id: string; title: string; examYear: number; branch: string; curriculum: string; paperType: string; publicUrl?: string; sourceName?: string; attribution?: string };

export const PyqStudentPanel: React.FC = () => {
  const [view,setView]=useState<'home'|'exam'|'result'>('home');
  const [papers,setPapers]=useState<Paper[]>([]);
  const [attempt,setAttempt]=useState<Attempt|null>(null);
  const [index,setIndex]=useState(0);
  const [secondsLeft,setSecondsLeft]=useState(180*60);
  const [busy,setBusy]=useState(true);
  const [error,setError]=useState('');
  const [result,setResult]=useState<any>(null);
  const autoSubmitStarted=useRef(false);

  useEffect(()=>{
    Promise.all([
      apiRequest<Paper[]>('/api/v1/pyq/papers'),
      apiRequest<any>('/api/v1/pyq/attempts/current')
    ]).then(([paperData,current])=>{
      setPapers(paperData);
      if(current?.active){setAttempt(current as Attempt);setView('exam');}
    }).catch(e=>setError(e.message||'Could not load the PYQ section.')).finally(()=>setBusy(false));
  },[]);
  useEffect(()=>{
    if(view!=='exam'||!attempt) return;
    const tick=()=>{
      const elapsed=Math.floor((Date.now()-new Date(attempt.startedAt).getTime())/1000);
      const remaining=Math.max(0,attempt.durationMinutes*60-elapsed);
      setSecondsLeft(remaining);
      if(remaining===0&&!autoSubmitStarted.current){
        autoSubmitStarted.current=true;
        setBusy(true);
        apiRequest('/api/v1/pyq/attempts/'+attempt.attemptId+'/submit',{method:'POST'})
          .then(data=>{setResult(data);setView('result');})
          .catch(e=>{setError(e.message||'Automatic submission failed. Please submit now.');})
          .finally(()=>setBusy(false));
      }
    };
    tick();
    const timer=window.setInterval(tick,1000);
    return ()=>window.clearInterval(timer);
  },[view,attempt]);
  const current=attempt?.questions[index];
  const answered=useMemo(()=>attempt?.questions.filter(q=>q.selectedOptionId).length??0,[attempt]);
  const formatTime=(n:number)=>`${Math.floor(n/3600).toString().padStart(2,'0')}:${Math.floor((n%3600)/60).toString().padStart(2,'0')}:${(n%60).toString().padStart(2,'0')}`;

  const start=async()=>{
    setBusy(true);setError('');
    try{
      autoSubmitStarted.current=false;
      const data=await apiRequest<Attempt>('/api/v1/pyq/attempts',{method:'POST'});
      setAttempt(data);setIndex(0);setView('exam');
    }catch(e:any){setError(e.message||'Unable to start the PYQ Challenge.');}
    finally{setBusy(false);}
  };
  const choose=async(optionId:string)=>{
    if(!attempt||!current||busy)return;
    setBusy(true);
    try{
      await apiRequest(`/api/v1/pyq/attempts/${attempt.attemptId}/answers/${current.id}`,{method:'PUT',body:JSON.stringify({optionId})});
      setAttempt(prev=>prev?({...prev,questions:prev.questions.map(q=>q.id===current.id?{...q,selectedOptionId:optionId}:q)}):prev);
    }catch(e:any){setError(e.message||'Could not save this answer.');}
    finally{setBusy(false);}
  };
  const submit=async()=>{
    if(!attempt||busy)return;
    if(!window.confirm('Submit your PYQ Challenge? You cannot change answers afterwards.'))return;
    autoSubmitStarted.current=true;
    setBusy(true);setError('');
    try{
      const data=await apiRequest('/api/v1/pyq/attempts/'+attempt.attemptId+'/submit',{method:'POST'});
      setResult(data);setView('result');
    }catch(e:any){setError(e.message||'Unable to submit the exam.');}
    finally{setBusy(false);}
  };

  if(view==='exam'&&attempt&&current){
    return <section className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-lg font-bold text-slate-900">PYQ Challenge · C23</h2><p className="text-sm text-slate-500">{answered} of {attempt.questions.length} answered</p></div>
        <div className={`flex items-center gap-2 font-bold text-lg tabular-nums ${secondsLeft<300?'text-red-600':'text-blue-700'}`}><Clock3 className="w-5 h-5"/>{formatTime(secondsLeft)}</div>
      </div>
      {error&&<div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>}
      <div className="grid lg:grid-cols-[minmax(0,1fr)_250px] gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 min-h-[360px]">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-5"><span>{current.subject}</span><span>Question {index+1} / {attempt.questions.length}</span><span>PYQ {current.sourceYear}</span></div>
          <h3 className="text-base sm:text-lg font-semibold leading-relaxed text-slate-900 mb-6">{current.questionText}</h3>
          <div className="space-y-3">
            {current.options.map(o=><button key={o.id} disabled={busy} onClick={()=>choose(o.id)} className={`w-full text-left p-4 rounded-xl border transition-colors min-h-14 ${current.selectedOptionId===o.id?'border-blue-500 bg-blue-50 text-blue-900':'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}><span className="inline-flex w-7 h-7 rounded-full bg-slate-100 items-center justify-center text-sm font-bold mr-3">{o.label}</span>{o.text}</button>)}
          </div>
          <div className="flex justify-between mt-7 gap-3"><button disabled={index===0} onClick={()=>setIndex(v=>v-1)} className="px-4 py-3 rounded-xl border border-slate-200 disabled:opacity-40 flex items-center gap-2"><ChevronLeft className="w-4 h-4"/>Previous</button><button disabled={index===attempt.questions.length-1} onClick={()=>setIndex(v=>v+1)} className="px-4 py-3 rounded-xl bg-blue-600 text-white disabled:opacity-40 flex items-center gap-2">Next<ChevronRight className="w-4 h-4"/></button></div>
        </div>
        <aside className="bg-white border border-slate-200 rounded-2xl p-4">
          <h3 className="font-bold text-slate-900 mb-3">Question palette</h3>
          <div className="grid grid-cols-5 gap-2 max-h-[330px] overflow-y-auto">{attempt.questions.map((q,i)=><button key={q.id} onClick={()=>setIndex(i)} className={`h-9 rounded-lg text-xs font-semibold ${i===index?'bg-blue-600 text-white':q.selectedOptionId?'bg-emerald-100 text-emerald-800':'bg-slate-100 text-slate-600'}`}>{i+1}</button>)}</div>
          <p className="text-xs text-slate-500 mt-3">{answered} answered · {attempt.questions.length-answered} unanswered</p>
          <button onClick={submit} disabled={busy} className="w-full mt-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold disabled:opacity-50">{busy?'Saving...':'Submit examination'}</button>
        </aside>
      </div>
    </section>;
  }
  if(view==='result'&&result){
    return <section className="bg-white border border-slate-200 rounded-2xl p-7 text-center">
      <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3"/>
      <h2 className="text-2xl font-bold text-slate-900">PYQ Challenge submitted</h2>
      <p className="text-slate-500 mt-2">{result.status==='TIMED_OUT'?'Time limit reached.':'Your result is ready.'}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7">{[['Score',result.score],['Correct',result.correctCount],['Incorrect',result.incorrectCount],['Unanswered',result.unansweredCount]].map(([label,value])=><div key={String(label)} className="bg-slate-50 rounded-xl p-4"><div className="text-2xl font-black text-slate-900">{value}</div><div className="text-xs text-slate-500">{label}</div></div>)}</div>
      <button onClick={()=>{setAttempt(null);setResult(null);setView('home');autoSubmitStarted.current=false;}} className="mt-7 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold">Back to PYQ section</button>
    </section>;
  }
  return <section className="space-y-6">
    {error&&<div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm flex gap-2"><AlertCircle className="w-4 h-4"/>{error}</div>}
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7">
      <div className="flex items-center gap-3 mb-2"><BookOpen className="w-6 h-6 text-blue-600"/><h2 className="text-xl font-bold text-slate-900">PYQ Challenge</h2></div>
      <p className="text-sm text-slate-600 leading-relaxed">A fresh, randomised 200-question C23 examination drawn only from verified previous-year ECET questions. Each attempt gets its own question and option order.</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">{[['DCME','100'],['Mathematics','50'],['Physics','30'],['Chemistry','20']].map(([s,n])=><div key={s} className="bg-slate-50 rounded-xl p-3"><div className="font-bold text-slate-900">{n}</div><div className="text-xs text-slate-500">{s}</div></div>)}</div>
      <p className="text-xs text-slate-500 mb-4">180 minutes · 200 marks · +1 correct · 0 incorrect</p>
      <button onClick={start} disabled={busy} className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-50">{busy?'Preparing your random paper...':'Start PYQ Challenge'}</button>
    </div>
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-600"/>Previous Year Papers</h3>
      {papers.length===0?<p className="text-sm text-slate-500">No papers have been published yet.</p>:<div className="divide-y divide-slate-100">{papers.map(p=><div key={p.id} className="py-3 flex flex-wrap items-center justify-between gap-3"><div><div className="font-semibold text-slate-900">{p.title}</div><div className="text-xs text-slate-500">{p.examYear} · {p.branch} · {p.curriculum} · {p.paperType.replace('_',' ')}</div>{p.attribution&&<div className="text-xs text-slate-400 mt-1">{p.attribution}</div>}</div>{p.publicUrl?<a href={p.publicUrl} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold">View / Download</a>:<span className="text-xs text-amber-600">PDF not linked yet</span>}</div>)}</div>}
    </div>
  </section>;
};
