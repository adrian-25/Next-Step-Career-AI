import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart2, Briefcase, Building2, ExternalLink, MapPin, RefreshCw, Search, Sparkles, Zap } from 'lucide-react';
import { fetchLiveJobs, LiveJobsResult } from '@/services/liveJobs.service';
import { getDataset } from '@/ai/ml/rolePredictor';

const ROLES = getDataset().map(entry => ({ key: entry.role, label: entry.display }));
const CITIES = ['Mumbai', 'Bengaluru', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'New York', 'Remote'];

function formatDate(value?: string) {
  if (!value) return 'Date not provided';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date not provided' : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function SalaryInsightsPage() {
  const [role, setRole] = useState(ROLES.find(item => item.key === 'software_developer')?.label ?? ROLES[0]?.label ?? 'Software Developer');
  const [city, setCity] = useState('Mumbai');
  const [data, setData] = useState<LiveJobsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    try { setData(await fetchLiveJobs(role, city)); }
    catch (err) { setData(null); setError(err instanceof Error ? err.message : 'Could not load current job listings.'); }
    finally { setLoading(false); }
  }, [role, city]);

  useEffect(() => { void loadJobs(); }, [loadJobs]);
  const maxSkillCount = useMemo(() => Math.max(1, ...(data?.topSkills.map(skill => skill.count) ?? [1])), [data]);

  return (
    <motion.div className="page-content max-w-6xl space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center"><BarChart2 className="h-5 w-5 text-indigo-400" /></div><div><h1 className="font-display text-2xl font-bold text-white tracking-tight">Live Job Market Insights</h1><p className="font-sans text-sm text-white/40 mt-1">Current listings filtered by role and city — no synthetic salary figures.</p></div></div>
        <Button variant="outline" onClick={loadJobs} disabled={loading} size="sm" className="font-sans gap-1.5 rounded-xl border-white/[0.08] text-white/55 hover:text-white"><RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh live data</Button>
      </div>

      <div className="rounded-2xl border border-white/[0.07] p-4 flex flex-wrap gap-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <label className="relative flex-1 min-w-[220px]"><Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" /><select value={role} onChange={event => setRole(event.target.value)} aria-label="Target role" className="w-full pl-9 pr-3 py-2.5 font-sans text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white/75 focus:outline-none focus:border-indigo-500/40">{ROLES.map(item => <option key={item.key} value={item.label}>{item.label}</option>)}</select></label>
        <label className="relative flex-1 min-w-[180px]"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" /><select value={city} onChange={event => setCity(event.target.value)} aria-label="City" className="w-full pl-9 pr-3 py-2.5 font-sans text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white/75 focus:outline-none focus:border-indigo-500/40">{CITIES.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
      </div>
      {error && <div className="rounded-2xl border border-rose-500/25 bg-rose-500/5 p-4 font-sans text-sm text-rose-300">{error}</div>}

      {loading ? <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-28 rounded-2xl border border-white/[0.06] bg-white/[0.025] animate-pulse" />)}</div> : data && <>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <Briefcase className="h-4 w-4" />, value: data.jobs.length, label: 'City matches', sub: `${city} listings on this page`, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/25' },
            { icon: <Building2 className="h-4 w-4" />, value: data.topCompanies.length, label: 'Hiring companies', sub: 'among current matches', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/25' },
            { icon: <Zap className="h-4 w-4" />, value: data.topSkills.length, label: 'Observed skills', sub: 'from listing descriptions', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/25' },
            { icon: <Sparkles className="h-4 w-4" />, value: data.totalFromSource.toLocaleString(), label: 'Source listings', sub: 'before city/role matching', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/25' },
          ].map(kpi => <div key={kpi.label} className="rounded-2xl border border-white/[0.07] p-4" style={{ background: 'rgba(255,255,255,0.025)' }}><div className={`w-7 h-7 rounded-xl flex items-center justify-center border mb-3 ${kpi.bg} ${kpi.color}`}>{kpi.icon}</div><p className={`font-display text-xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="font-display text-xs font-semibold text-white/60 mt-1">{kpi.label}</p><p className="font-sans text-xs text-white/30 mt-0.5">{kpi.sub}</p></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <section className="lg:col-span-2 rounded-2xl border border-white/[0.07] p-5" style={{ background: 'rgba(255,255,255,0.02)' }}><h2 className="font-display text-sm font-semibold text-white flex items-center gap-2"><Zap className="h-4 w-4 text-amber-400" />Skills requested in current listings</h2>{data.topSkills.length ? <div className="mt-5 space-y-3">{data.topSkills.map(skill => <div key={skill.name} className="flex items-center gap-3"><span className="w-28 truncate font-sans text-xs text-white/55">{skill.name}</span><Progress value={skill.count / maxSkillCount * 100} className="h-1.5 flex-1 bg-white/[0.06]" /><span className="w-5 font-sans text-xs text-indigo-400 text-right">{skill.count}</span></div>)}</div> : <p className="font-sans text-sm text-white/35 mt-5">No skills could be extracted from the current city matches.</p>}</section>
          <section className="lg:col-span-3 rounded-2xl border border-white/[0.07] p-5" style={{ background: 'rgba(255,255,255,0.02)' }}><h2 className="font-display text-sm font-semibold text-white flex items-center gap-2"><Building2 className="h-4 w-4 text-violet-400" />Companies with current matches</h2>{data.topCompanies.length ? <div className="mt-4 grid sm:grid-cols-2 gap-2">{data.topCompanies.map((company, index) => <div key={company.name} className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.015]"><span className="w-6 h-6 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center font-display text-xs">{index + 1}</span><span className="font-sans text-sm text-white/70 truncate flex-1">{company.name}</span><span className="font-sans text-xs text-white/35">{company.count}</span></div>)}</div> : <p className="font-sans text-sm text-white/35 mt-5">No company matches for this city and role on the latest source page.</p>}</section>
        </div>
        <section className="rounded-2xl border border-white/[0.07] overflow-hidden" style={{ background: 'rgba(255,255,255,0.015)' }}><div className="px-5 py-4 border-b border-white/[0.06]"><h2 className="font-display text-sm font-semibold text-white flex items-center gap-2"><Search className="h-4 w-4 text-indigo-400" />Current {role} openings in {city}</h2><p className="font-sans text-xs text-white/30 mt-1">Source: {data.source} · refreshed {new Date(data.queriedAt).toLocaleString()}</p></div>{data.jobs.length ? <div className="divide-y divide-white/[0.05]">{data.jobs.map(job => <article key={job.id} className="p-5 hover:bg-white/[0.025] transition-colors"><div className="flex gap-4 justify-between"><div className="min-w-0"><h3 className="font-display text-base font-semibold text-white">{job.title}</h3><p className="font-sans text-sm text-indigo-300 mt-1">{job.company}</p><p className="font-sans text-xs text-white/35 mt-1.5 flex items-center gap-1.5"><MapPin className="h-3 w-3" />{job.locations.join(' · ') || city} <span className="text-white/15">•</span> {formatDate(job.publishedAt)}</p><p className="font-sans text-sm leading-6 text-white/45 mt-3 line-clamp-2">{job.description}</p></div>{job.url && <a href={job.url} target="_blank" rel="noopener noreferrer" className="shrink-0"><Button size="sm" variant="outline" className="gap-1.5 border-white/[0.1] text-white/65"><ExternalLink className="h-3.5 w-3.5" />View</Button></a>}</div></article>)}</div> : <div className="py-14 text-center"><MapPin className="h-8 w-8 text-white/20 mx-auto mb-3" /><p className="font-display text-base text-white/70">No current city matches found</p><p className="font-sans text-sm text-white/35 mt-1">Try another city or role. The page never substitutes fictional results.</p></div>}</section>
      </>}
      <p className="font-sans text-xs text-white/20 text-center">Listings are live data from The Muse public Jobs API. Salary data is intentionally not estimated because the source does not provide verified compensation for every role.</p>
    </motion.div>
  );
}
