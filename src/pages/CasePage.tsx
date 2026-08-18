import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, MedicalCase } from '../lib/supabase';
import { getFallbackCase } from '../lib/caseFallback';
import { ArrowLeft, Lock, Loader2, Crown, ClipboardList, Stethoscope, FlaskConical, Activity, Pill, MessageSquare } from 'lucide-react';

type Props = { caseId: string; onNavigate: (page: string) => void };

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
  return <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
    <button onClick={() => onNavigate('home')} className="inline-flex items-center gap-2 text-ink-muted hover:text-ink text-sm font-medium mb-6"><ArrowLeft className="w-4 h-4" /> All cases</button>
    <div className="rounded-3xl overflow-hidden bg-paper-card border border-line shadow-card">
      {caseData.image_url && <div className="h-48 sm:h-72 overflow-hidden bg-paper-dim"><img src={caseData.image_url} alt={caseData.title} className="w-full h-full object-cover" /></div>}
      <div className="p-5 sm:p-8">
        <div className="flex items-center gap-2 mb-3"><span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-med-100 text-med-700">{caseData.specialty}</span>{caseData.is_free && <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-med-50 text-med-600">Free</span>}</div>
        <h1 className="text-xl sm:text-3xl font-bold text-ink font-display">{caseData.title}</h1>
        {caseData.chief_complaint && <p className="mt-2 text-ink-muted text-sm sm:text-base"><span className="font-medium text-ink-soft">Chief complaint: </span>{caseData.chief_complaint}</p>}
        {(caseData.patient_age || caseData.patient_gender) && <div className="mt-3 flex gap-4 text-sm text-ink-muted">{caseData.patient_age != null && <span>Age: {caseData.patient_age}</span>}{caseData.patient_gender && <span>Gender: {caseData.patient_gender}</span>}</div>}
        <div className="mt-6 rounded-xl bg-paper-dim p-4"><p className="text-ink-soft">{caseData.excerpt}</p></div>
        {!locked ? <div className="mt-6 space-y-6">
          <Section icon={<ClipboardList className="w-4 h-4" />} title="History" accent="#0E7C86">{caseData.history}</Section>
          <Section icon={<Stethoscope className="w-4 h-4" />} title="Examination" accent="#0E7C86">{caseData.examination}</Section>
          <Section icon={<FlaskConical className="w-4 h-4" />} title="Investigations" accent="#E68A00">{caseData.investigations}</Section>
          <Section icon={<Activity className="w-4 h-4" />} title="Diagnosis" accent="#C1121F">{caseData.diagnosis}</Section>
          <Section icon={<Pill className="w-4 h-4" />} title="Management" accent="#0E7C86">{caseData.management}</Section>
          <Section icon={<MessageSquare className="w-4 h-4" />} title="Discussion" accent="#8E2A82">{caseData.discussion}</Section>
        </div> : <LockedContent onNavigate={onNavigate} loggedIn={!!profile} />}
      </div>
    </div>
  </div>;
}

function Section({ icon, title, accent, children }: { icon: React.ReactNode; title: string; accent: string; children: React.ReactNode }) {
  if (!children) return null;
  return <div><h3 className="inline-flex items-center gap-2 font-semibold text-ink mb-2" style={{ color: accent }}>{icon} {title}</h3><p className="text-ink-soft leading-relaxed whitespace-pre-line">{children}</p></div>;
}

function LockedContent({ onNavigate, loggedIn }: { onNavigate: (p: string) => void; loggedIn: boolean }) {
  return <div className="mt-8 rounded-2xl border-2 border-dashed border-peds-200 bg-peds-50 p-6 sm:p-8 text-center"><div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-peds-500 to-peds-600 text-white flex items-center justify-center mb-4"><Lock className="w-7 h-7" /></div><h3 className="font-semibold text-ink text-lg">This is a premium case</h3><p className="mt-1 text-ink-muted text-sm max-w-sm mx-auto">Unlock all cases with a one-time payment of Rs 4,499. Lifetime access — no subscription.</p><button onClick={() => onNavigate(loggedIn ? 'subscribe' : 'auth')} className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-peds-500 to-peds-600 text-white font-semibold hover:from-peds-600 hover:to-peds-700 transition shadow-soft"><Crown className="w-4 h-4" />{loggedIn ? 'Unlock lifetime access — Rs 4,499' : 'Sign in to unlock'}</button></div>;
}
