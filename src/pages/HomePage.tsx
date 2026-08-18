import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, MedicalCase } from '../lib/supabase';
import { FALLBACK_CASES, mergeCases } from '../lib/caseFallback';
import {
  Search, Crown, ShieldCheck, Sparkles, Loader2, Stethoscope, Scissors,
  Baby, HeartPulse, Activity, Brain, Bone, Droplets, Thermometer,
  ArrowRight, Grid3X3, Syringe, Bandage,
} from 'lucide-react';

type Props = { onNavigate: (page: string) => void };
type Palette = { wrap: string; chip: string; icon: string; glow: string; border: string };

const palettes: Record<string, Palette> = {
  Medicine: { wrap: 'from-med-50 via-white to-sky-50', chip: 'bg-med-100 text-med-800', icon: 'bg-med-600 text-white', glow: 'bg-med-200/40', border: 'hover:border-med-300' },
  Surgery: { wrap: 'from-surg-50 via-white to-rose-50', chip: 'bg-surg-100 text-surg-800', icon: 'bg-surg-600 text-white', glow: 'bg-surg-200/40', border: 'hover:border-surg-300' },
  Pediatrics: { wrap: 'from-peds-50 via-white to-amber-50', chip: 'bg-peds-100 text-peds-800', icon: 'bg-peds-500 text-white', glow: 'bg-peds-200/40', border: 'hover:border-peds-300' },
  'Gynae/Obs': { wrap: 'from-purple-50 via-white to-pink-50', chip: 'bg-purple-100 text-purple-800', icon: 'bg-purple-600 text-white', glow: 'bg-purple-200/40', border: 'hover:border-purple-300' },
};

function specialtyIcon(specialty: string) {
  if (specialty === 'Surgery') return Scissors;
  if (specialty === 'Pediatrics') return Baby;
  if (specialty === 'Gynae/Obs') return HeartPulse;
  return Stethoscope;
}

function caseIcon(c: MedicalCase) {
  const t = `${c.title} ${c.chief_complaint ?? ''}`.toLowerCase();
  if (/heart|hypertension|cardiac|chest|pre-eclampsia/.test(t)) return HeartPulse;
  if (/asthma|copd|breath|lung|pneumonia|bronchiolitis/.test(t)) return Activity;
  if (/headache|migraine|neuro|seiz/.test(t)) return Brain;
  if (/fracture|bone|joint|orthop|ricket/.test(t)) return Bone;
  if (/anaemia|anemia|bleed|blood|dengue/.test(t)) return Droplets;
  if (/fever|typhoid|measles|infection/.test(t)) return Thermometer;
  if (/diabetes|insulin|glucose/.test(t)) return Syringe;
  if (/wound|abscess|ulcer|trauma|cellulitis|fissure|haemorrhoid|hemorrhoid/.test(t)) return Bandage;
  return specialtyIcon(c.specialty);
}

export default function HomePage({ onNavigate }: Props) {
  const { profile } = useAuth();
  const isPremium = !!profile?.is_premium;
  const [cases, setCases] = useState<MedicalCase[]>(FALLBACK_CASES);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [spec, setSpec] = useState('All');

  useEffect(() => {
    supabase.from('cases').select('*').eq('is_published', true).order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!error) setCases(mergeCases((data as MedicalCase[]) ?? []));
        setLoading(false);
      });
  }, []);

  const specialties = useMemo(() => ['All', ...Array.from(new Set(cases.map((c) => c.specialty)))], [cases]);

  const filtered = useMemo(() => cases.filter((c) => {
    const matchSpec = spec === 'All' || c.specialty === spec;
    const q = query.trim().toLowerCase();
    const matchQuery = !q || [c.title, c.excerpt, c.specialty, c.chief_complaint ?? ''].some((v) => v.toLowerCase().includes(q));
    return matchSpec && matchQuery;
  }), [cases, spec, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, MedicalCase[]>();
    for (const c of filtered) {
      const arr = map.get(c.specialty) ?? [];
      arr.push(c);
      map.set(c.specialty, arr);
    }
    for (const arr of map.values()) arr.sort((a, b) => a.title.localeCompare(b.title));
    return map;
  }, [filtered]);

  return <>
    <section className="relative overflow-hidden bg-gradient-to-br from-med-700 via-med-800 to-ink text-white">
      <div className="absolute inset-0 bg-hero-mesh opacity-60" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium border border-white/15 backdrop-blur"><Sparkles className="w-3.5 h-3.5" /> {cases.length} Cases · {specialties.length - 1} Specialties</span>
          <h1 className="mt-4 sm:mt-5 text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight font-display">A Clinical Field Book<span className="block bg-gradient-to-r from-med-200 via-white to-peds-200 bg-clip-text text-transparent">built for fast OPD decisions.</span></h1>
          <p className="mt-3 sm:mt-4 text-white/85 text-sm sm:text-lg">Search by disease or specialty and open the case you need in seconds.</p>
          <div className="mt-5 sm:mt-7 flex flex-wrap gap-3">
            {!profile && <button onClick={() => onNavigate('auth')} className="px-5 py-2.5 rounded-xl bg-white text-med-700 font-semibold hover:bg-white/90 transition shadow-lg">Create free account</button>}
            {!isPremium && <button onClick={() => onNavigate('subscribe')} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-peds-500 to-peds-600 text-white font-semibold transition inline-flex items-center gap-2 shadow-lg"><Crown className="w-4 h-4" /> Unlock lifetime — Rs 4,499</button>}
            {isPremium && <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 border border-white/20 font-semibold backdrop-blur"><ShieldCheck className="w-4 h-4" /> Premium unlocked</span>}
          </div>
        </div>
      </div>
    </section>

    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="sticky top-16 z-30 rounded-2xl border border-line bg-paper/90 backdrop-blur-xl shadow-soft p-3 sm:p-4 mb-7">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search disease, symptom or specialty…" className="w-full pl-9 pr-3 py-3 rounded-xl border border-line bg-white focus:border-med-500 focus:ring-2 focus:ring-med-100 outline-none transition" /></div>
          <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            {specialties.map((s) => {
              const Icon = s === 'All' ? Grid3X3 : specialtyIcon(s);
              return <button key={s} onClick={() => setSpec(s)} className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap border transition ${spec === s ? 'bg-ink text-white border-ink shadow-soft' : 'bg-white text-ink-soft border-line hover:border-med-300 hover:text-med-700'}`}><Icon className="w-4 h-4" /> {s}</button>;
            })}
          </div>
        </div>
      </div>

      {loading && cases.length === 0 ? <div className="flex justify-center py-20 text-ink-muted"><Loader2 className="w-6 h-6 animate-spin" /></div> : filtered.length === 0 ? <p className="text-center text-ink-muted py-20">No cases found.</p> : (
        <div className="space-y-10">
          {Array.from(grouped.entries()).map(([specialty, items]) => {
            const Icon = specialtyIcon(specialty);
            const p = palettes[specialty] ?? palettes.Medicine;
            return <section key={specialty}>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3"><span className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-soft ${p.icon}`}><Icon className="w-5 h-5" /></span><div><h2 className="text-xl sm:text-2xl font-bold text-ink font-display">{specialty}</h2><p className="text-sm text-ink-muted">{items.length} cases</p></div></div>
                {spec === 'All' && <button onClick={() => setSpec(specialty)} className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-med-700 hover:underline">View specialty <ArrowRight className="w-4 h-4" /></button>}
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{items.map((c) => <CaseCard key={c.id} caseData={c} locked={!isPremium && !c.is_free} onNavigate={onNavigate} palette={p} />)}</div>
            </section>;
          })}
        </div>
      )}
    </section>
  </>;
}

function CaseCard({ caseData, locked, onNavigate, palette }: { caseData: MedicalCase; locked: boolean; onNavigate: (p: string) => void; palette: Palette }) {
  const Icon = caseIcon(caseData);
  return <button onClick={() => onNavigate(`case:${caseData.id}`)} className={`group relative w-full text-left rounded-2xl border border-line overflow-hidden bg-gradient-to-br ${palette.wrap} ${palette.border} hover:shadow-card hover:-translate-y-1 transition-all duration-200`}>
    <div className={`absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl ${palette.glow}`} />
    <div className="relative p-5 min-h-[190px] flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className={`w-11 h-11 rounded-xl shadow-sm flex items-center justify-center shrink-0 ${palette.icon}`}><Icon className="w-5 h-5" /></div>
        <div className="flex items-center gap-2">
          {caseData.is_free && !locked && <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">Free</span>}
          {locked && <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-white/80 text-peds-700 border border-peds-100">Premium</span>}
        </div>
      </div>

      <h3 className="mt-4 text-lg sm:text-xl font-bold text-ink leading-snug group-hover:text-med-700 transition">{caseData.title}</h3>
      <p className="mt-2 text-sm text-ink-muted line-clamp-2">{caseData.excerpt}</p>

      <div className="mt-auto pt-5 flex items-center justify-between">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${palette.chip}`}>{caseData.specialty}</span>
        <span className="w-9 h-9 rounded-full bg-white border border-line flex items-center justify-center group-hover:bg-ink group-hover:text-white group-hover:translate-x-0.5 transition"><ArrowRight className="w-4 h-4" /></span>
      </div>
    </div>
  </button>;
}
