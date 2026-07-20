import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, MedicalCase } from '../lib/supabase';
import { Search, Lock, Crown, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';

type Props = { onNavigate: (page: string) => void };

export default function HomePage({ onNavigate }: Props) {
  const { profile } = useAuth();
  const isPremium = !!profile?.is_premium;
  const [cases, setCases] = useState<MedicalCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [spec, setSpec] = useState('All');

  useEffect(() => {
    supabase
      .from('cases')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!error) setCases((data as MedicalCase[]) ?? []);
        setLoading(false);
      });
  }, []);

  const specialties = useMemo(
    () => ['All', ...Array.from(new Set(cases.map((c) => c.specialty)))],
    [cases],
  );

  const filtered = useMemo(
    () =>
      cases.filter((c) => {
        const matchSpec = spec === 'All' || c.specialty === spec;
        const q = query.toLowerCase();
        const matchQuery =
          !q ||
          c.title.toLowerCase().includes(q) ||
          c.excerpt.toLowerCase().includes(q) ||
          c.specialty.toLowerCase().includes(q);
        return matchSpec && matchQuery;
      }),
    [cases, spec, query],
  );

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-med-700 via-med-800 to-ink text-white">
        <div className="absolute inset-0 bg-hero-mesh opacity-60" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium border border-white/15 backdrop-blur">
              <Sparkles className="w-3.5 h-3.5" /> {cases.length} Cases · {specialties.length - 1} Specialties
            </span>
            <h1 className="mt-4 sm:mt-5 text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight font-display">
              A Clinical Field Book
              <span className="block bg-gradient-to-r from-med-200 via-white to-peds-200 bg-clip-text text-transparent">
                for the OPD.
              </span>
            </h1>
            <p className="mt-3 sm:mt-4 text-white/85 text-sm sm:text-lg">
              Real-world cases across Medicine, Surgery, Paediatrics and more — each with history,
              examination, red flags, guideline summaries, and ready OPD prescriptions.
            </p>
            <div className="mt-5 sm:mt-7 flex flex-wrap gap-3">
              {!profile && (
                <button
                  onClick={() => onNavigate('auth')}
                  className="px-5 py-2.5 rounded-xl bg-white text-med-700 font-semibold hover:bg-white/90 transition shadow-lg"
                >
                  Create free account
                </button>
              )}
              {!isPremium && (
                <button
                  onClick={() => onNavigate('subscribe')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-peds-500 to-peds-600 text-white font-semibold hover:from-peds-600 hover:to-peds-700 transition inline-flex items-center gap-2 shadow-lg"
                >
                  <Crown className="w-4 h-4" /> Unlock lifetime — Rs 4,499
                </button>
              )}
              {isPremium && (
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 border border-white/20 text-white font-semibold backdrop-blur">
                  <ShieldCheck className="w-4 h-4" /> Premium unlocked
                </span>
              )}
            </div>

            {/* Stats — 2x2 grid on mobile, 4 cols on desktop. Fixes overlap. */}
            <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-lg">
              <Stat value={String(cases.length)} label="Cases" />
              <Stat value={String(specialties.length - 1)} label="Specialties" />
              <Stat value="Lifetime" label="Access" />
              <Stat value="Rs 4,499" label="One-time" />
            </div>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-ink font-display">Browse Cases</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cases…"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-line bg-paper-card focus:border-med-500 focus:ring-2 focus:ring-med-100 outline-none transition shadow-soft"
              />
            </div>
            <select
              value={spec}
              onChange={(e) => setSpec(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-line bg-paper-card focus:border-med-500 focus:ring-2 focus:ring-med-100 outline-none transition shadow-soft"
            >
              {specialties.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-ink-muted">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-ink-muted py-20">No cases found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map((c) => (
              <CaseCard key={c.id} caseData={c} locked={!isPremium && !c.is_free} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white/10 border border-white/15 px-3 py-2.5 backdrop-blur">
      <div className="text-base sm:text-xl font-bold font-display leading-tight">{value}</div>
      <div className="text-white/70 text-xs sm:text-sm">{label}</div>
    </div>
  );
}

function CaseCard({
  caseData,
  locked,
  onNavigate,
}: {
  caseData: MedicalCase;
  locked: boolean;
  onNavigate: (p: string) => void;
}) {
  return (
    <button
      onClick={() => onNavigate(`case:${caseData.id}`)}
      className="group fade-up text-left bg-paper-card rounded-2xl border border-line overflow-hidden hover:shadow-card hover:-translate-y-0.5 transition-all duration-200"
    >
      {caseData.image_url && (
        <div className="relative h-36 sm:h-40 overflow-hidden bg-paper-dim">
          <img
            src={caseData.image_url}
            alt={caseData.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {locked && (
            <div className="absolute inset-0 bg-ink/50 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white/90" />
            </div>
          )}
        </div>
      )}
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-med-100 text-med-700">
            {caseData.specialty}
          </span>
          {caseData.is_free && !locked && (
            <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-med-50 text-med-600">
              Free
            </span>
          )}
        </div>
        <h3 className="font-semibold text-ink leading-snug group-hover:text-med-700 transition">
          {caseData.title}
        </h3>
        <p className="mt-1.5 text-sm text-ink-muted line-clamp-2">{caseData.excerpt}</p>
        {locked && (
          <p className="mt-3 text-xs text-peds-600 font-medium inline-flex items-center gap-1">
            <Crown className="w-3.5 h-3.5" /> Premium case
          </p>
        )}
      </div>
    </button>
  );
}
