import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, MedicalCase } from '../lib/supabase';
import { getFallbackCase } from '../lib/caseFallback';
import { ArrowLeft, Lock, Loader2, Crown, ClipboardList, Stethoscope, FlaskConical, Activity, Pill, MessageSquare, AlertTriangle, Lightbulb, BookOpenCheck } from 'lucide-react';

type Props = { caseId: string; onNavigate: (page: string) => void };

type Tone = 'teal' | 'amber' | 'red' | 'violet' | 'blue';
const toneClasses: Record<Tone, { wrap: string; head: string; icon: string }> = {
  teal: { wrap: 'border-med-200 bg-gradient-to-br from-white to-med-50/70', head: 'bg-med-50 border-med-100 text-med-800', icon: 'bg-med-100 text-med-700' },
  amber: { wrap: 'border-peds-200 bg-gradient-to-br from-white to-peds-50/70', head: 'bg-peds-50 border-peds-100 text-peds-700', icon: 'bg-peds-100 text-peds-700' },
  red: { wrap: 'border-surg-200 bg-gradient-to-br from-white to-surg-50/60', head: 'bg-surg-50 border-surg-100 text-surg-700', icon: 'bg-surg-100 text-surg-700' },
  violet: { wrap: 'border-line bg-gradient-to-br from-white to-purple-50/60', head: 'bg-purple-50 border-purple-100 text-purple-800', icon: 'bg-purple-100 text-purple-700' },
  blue: { wrap: 'border-line bg-gradient-to-br from-white to-sky-50/60', head: 'bg-sky-50 border-sky-100 text-sky-800', icon: 'bg-sky-100 text-sky-700' },
};

export default function CasePage({ caseId, onNavigate }: Props) {
  const { profile } = useAuth();
  const isPremium = !!profile?.is_premium;
  const [caseData, setCaseData] = useState<MedicalCase | null>(getFallbackCase(caseId));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fallback = getFallbackCase(caseId);
    setCaseData(fallback);
    supabase.from('cases').select('*').eq('id', caseId).maybeSingle().then(({ data, error }) => {
      if (!error && data) setCaseData(data as MedicalCase);
      else if (!data) setCaseData(fallback);
      setLoading(false);
    });
  }, [caseId]);

  if (loading && !caseData) return <div className="flex justify-center py-20 text-ink-muted"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  if (!caseData) return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><p className="text-ink-muted">Case not found.</p><button onClick={() => onNavigate('home')} className="mt-4 text-med-600 font-medium hover:underline">Back to cases</button></div>;

  const locked = !isPremium && !caseData.is_free;
  return <div className="max-w-5xl mx-auto px-3 sm:px-6 py-5 sm:py-8">
    <button onClick={() => onNavigate('home')} className="inline-flex items-center gap-2 text-ink-muted hover:text-ink text-sm font-medium mb-5"><ArrowLeft className="w-4 h-4" /> All cases</button>
    <article className="rounded-3xl overflow-hidden bg-paper-card border border-line shadow-card">
      {caseData.image_url && <div className="h-48 sm:h-72 overflow-hidden bg-paper-dim"><img src={caseData.image_url} alt={caseData.title} className="w-full h-full object-cover" /></div>}
      <header className="p-5 sm:p-8 border-b border-line bg-gradient-to-br from-white via-white to-med-50/50">
        <div className="flex items-center gap-2 mb-3 flex-wrap"><span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-med-100 text-med-700">{caseData.specialty}</span>{caseData.is_free && <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-peds-100 text-peds-700">Free case</span>}</div>
        <h1 className="text-2xl sm:text-4xl font-bold text-ink font-display tracking-tight">{caseData.title}</h1>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {caseData.chief_complaint && <span className="px-3 py-1.5 rounded-lg bg-paper-dim text-ink-soft"><strong>Presentation:</strong> {caseData.chief_complaint}</span>}
          {caseData.patient_age != null && <span className="px-3 py-1.5 rounded-lg bg-paper-dim text-ink-soft"><strong>Age:</strong> {caseData.patient_age}</span>}
          {caseData.patient_gender && <span className="px-3 py-1.5 rounded-lg bg-paper-dim text-ink-soft"><strong>Gender:</strong> {caseData.patient_gender}</span>}
        </div>
        <div className="mt-5 rounded-2xl border border-med-100 bg-med-50/60 p-4 sm:p-5"><div className="flex gap-3"><Lightbulb className="w-5 h-5 text-med-700 shrink-0 mt-0.5" /><div><p className="text-xs uppercase tracking-wider font-bold text-med-700 mb-1">Clinical snapshot</p><p className="text-ink-soft leading-relaxed">{cleanText(caseData.excerpt)}</p></div></div></div>
      </header>

      <div className="p-4 sm:p-8">
        {!locked ? <div className="grid gap-5">
          <ClinicalSection icon={<ClipboardList className="w-4 h-4" />} title="History" tone="teal" text={caseData.history} />
          <ClinicalSection icon={<Stethoscope className="w-4 h-4" />} title="Examination" tone="blue" text={caseData.examination} />
          <ClinicalSection icon={<FlaskConical className="w-4 h-4" />} title="Investigations" tone="amber" text={caseData.investigations} />
          <ClinicalSection icon={<Activity className="w-4 h-4" />} title="Diagnosis & Clinical Impression" tone="red" text={caseData.diagnosis} />
          <ManagementSection text={caseData.management} />
          <DiscussionSection text={caseData.discussion} />
          <EvidenceNote />
        </div> : <LockedContent onNavigate={onNavigate} loggedIn={!!profile} />}
      </div>
    </article>
  </div>;
}

function cleanText(text: string | null | undefined) {
  return (text ?? '').replace(/[•▪◦●◆►▶→✓✔]/g, '').replace(/\s{2,}/g, ' ').trim();
}

function lines(text: string | null | undefined) {
  return (text ?? '').split('\n').map(cleanText).filter(Boolean);
}

function ClinicalSection({ icon, title, tone, text }: { icon: React.ReactNode; title: string; tone: Tone; text: string | null }) {
  if (!text) return null;
  const t = toneClasses[tone];
  const items = lines(text);
  return <section className={`rounded-2xl border overflow-hidden ${t.wrap}`}>
    <div className={`px-4 sm:px-5 py-3 border-b flex items-center gap-2.5 ${t.head}`}><span className={`w-8 h-8 rounded-lg inline-flex items-center justify-center ${t.icon}`}>{icon}</span><h2 className="font-bold text-base sm:text-lg">{title}</h2></div>
    <div className="p-4 sm:p-5 text-[15px] sm:text-base text-ink-soft leading-7">
      {items.length > 1 ? <ul className="space-y-2.5">{items.map((item, i) => <li key={i} className="flex gap-3"><span className="mt-[0.7rem] w-1.5 h-1.5 rounded-full bg-current opacity-50 shrink-0" /><span>{item}</span></li>)}</ul> : <p>{items[0]}</p>}
    </div>
  </section>;
}

function ManagementSection({ text }: { text: string | null }) {
  if (!text) return null;
  const raw = text.replace(/[•▪◦●◆►▶→✓✔]/g, '').trim();
  const marker = /PRESCRIPTION\s*:/i;
  const match = raw.match(marker);
  const management = match ? raw.slice(0, match.index).trim() : raw;
  const prescription = match ? raw.slice((match.index ?? 0) + match[0].length).trim() : '';
  return <section className="rounded-2xl border border-med-200 overflow-hidden bg-gradient-to-br from-white to-med-50/60">
    <div className="px-4 sm:px-5 py-3 border-b border-med-100 bg-med-50 flex items-center gap-2.5 text-med-800"><span className="w-8 h-8 rounded-lg inline-flex items-center justify-center bg-med-100 text-med-700"><Pill className="w-4 h-4" /></span><h2 className="font-bold text-base sm:text-lg">Management Plan</h2></div>
    <div className="p-4 sm:p-5"><BulletList text={management} />{prescription && <PrescriptionPad text={prescription} />}</div>
  </section>;
}

function PrescriptionPad({ text }: { text: string }) {
  const rx = lines(text);
  return <div className="mt-5 rounded-xl border border-sky-200 bg-white overflow-hidden shadow-soft">
    <div className="px-4 py-3 border-b border-sky-100 bg-sky-50 flex items-center justify-between"><div><p className="font-serif text-2xl font-bold text-sky-800">Rx</p><p className="text-[11px] uppercase tracking-widest text-sky-700 font-semibold">Prescription</p></div><Pill className="w-5 h-5 text-sky-600" /></div>
    <div className="p-4 sm:p-5 bg-[linear-gradient(to_bottom,transparent_31px,#e0f2fe_32px)] bg-[length:100%_32px] min-h-28"><ol className="space-y-2 text-[15px] leading-6 text-ink-soft">{rx.map((r, i) => <li key={i} className="flex gap-3"><span className="font-semibold text-sky-700 min-w-5">{i + 1}.</span><span>{r}</span></li>)}</ol></div>
    <div className="px-4 py-2.5 border-t border-sky-100 text-xs text-ink-muted">Verify allergies, contraindications, interactions, renal/hepatic dosing and local formulary before prescribing.</div>
  </div>;
}

function DiscussionSection({ text }: { text: string | null }) {
  if (!text) return null;
  const parts = (text ?? '').split(/\n\n+/).map((x) => x.trim()).filter(Boolean);
  return <section className="rounded-2xl border border-line overflow-hidden bg-gradient-to-br from-white to-purple-50/50">
    <div className="px-4 sm:px-5 py-3 border-b border-purple-100 bg-purple-50 flex items-center gap-2.5 text-purple-800"><span className="w-8 h-8 rounded-lg inline-flex items-center justify-center bg-purple-100 text-purple-700"><MessageSquare className="w-4 h-4" /></span><h2 className="font-bold text-base sm:text-lg">Clinical Pearls, Red Flags & Follow-up</h2></div>
    <div className="p-4 sm:p-5 space-y-4">{parts.map((p, i) => {
      const red = /RED FLAGS|URGENT|REFER/i.test(p);
      const guide = /GUIDELINE|EVIDENCE/i.test(p);
      const Icon = red ? AlertTriangle : guide ? BookOpenCheck : Lightbulb;
      const title = red ? 'Red flags / urgent referral' : guide ? 'Guideline point' : 'Patient advice & clinical pearl';
      const body = p.replace(/^(RED FLAGS\s*\/?.*?:|GUIDELINE SUMMARY\s*:|PATIENT ADVICE.*?:)/i, '').trim();
      return <div key={i} className={`rounded-xl border p-4 ${red ? 'border-surg-200 bg-surg-50' : guide ? 'border-sky-200 bg-sky-50' : 'border-peds-200 bg-peds-50'}`}><div className="flex gap-3"><Icon className={`w-5 h-5 shrink-0 mt-0.5 ${red ? 'text-surg-700' : guide ? 'text-sky-700' : 'text-peds-700'}`} /><div><h3 className="font-semibold text-ink mb-2">{title}</h3><BulletList text={body} /></div></div></div>;
    })}</div>
  </section>;
}

function BulletList({ text }: { text: string }) {
  const items = lines(text);
  if (!items.length) return null;
  if (items.length === 1) return <p className="text-ink-soft leading-7">{items[0]}</p>;
  return <ul className="space-y-2 text-ink-soft leading-7">{items.map((x, i) => <li key={i} className="flex gap-3"><span className="mt-[0.7rem] w-1.5 h-1.5 rounded-full bg-med-600 shrink-0" /><span>{x}</span></li>)}</ul>;
}

function EvidenceNote() {
  return <aside className="rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 to-white p-4 sm:p-5"><div className="flex gap-3"><BookOpenCheck className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" /><div><h2 className="font-bold text-sky-900">Evidence-based prescribing</h2><p className="mt-1 text-sm text-ink-soft leading-6">Treatment choices should be reconciled with the latest disease-specific guideline and local resistance patterns. For antibiotics, prefer stewardship-based prescribing: confirm indication, choose the narrowest appropriate agent, correct dose/route, and shortest effective duration.</p><p className="mt-2 text-xs text-ink-muted">Core references: WHO AWaRe Antibiotic Book and current disease-specific NICE/WHO guidance. Local protocols take priority where resistance patterns differ.</p></div></div></aside>;
}

function LockedContent({ onNavigate, loggedIn }: { onNavigate: (p: string) => void; loggedIn: boolean }) {
  return <div className="mt-4 rounded-2xl border-2 border-dashed border-peds-200 bg-peds-50 p-6 sm:p-8 text-center"><div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-peds-500 to-peds-600 text-white flex items-center justify-center mb-4"><Lock className="w-7 h-7" /></div><h3 className="font-semibold text-ink text-lg">This is a premium case</h3><p className="mt-1 text-ink-muted text-sm max-w-sm mx-auto">Unlock all cases with a one-time payment of Rs 4,499. Lifetime access — no subscription.</p><button onClick={() => onNavigate(loggedIn ? 'subscribe' : 'auth')} className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-peds-500 to-peds-600 text-white font-semibold hover:from-peds-600 hover:to-peds-700 transition shadow-soft"><Crown className="w-4 h-4" />{loggedIn ? 'Unlock lifetime access — Rs 4,499' : 'Sign in to unlock'}</button></div>;
}
