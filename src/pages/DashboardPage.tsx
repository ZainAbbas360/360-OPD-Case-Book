import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, PaymentRequest } from '../lib/supabase';
import { Crown, ShieldCheck, ArrowRight, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

type Props = { onNavigate: (page: string) => void };

export default function DashboardPage({ onNavigate }: Props) {
  const { profile, refreshProfile } = useAuth();
  const [caseCount, setCaseCount] = useState(0);
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!profile) return;
    const [c, p] = await Promise.all([
      supabase.from('cases').select('*', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('payment_requests').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }),
    ]);
    setCaseCount(c.count ?? 0);
    setRequests((p.data as PaymentRequest[]) ?? []);
    setLoading(false);
  }, [profile]);

  useEffect(() => { load(); }, [load]);

  if (!profile) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-ink-muted">Please sign in.</p>
        <button onClick={() => onNavigate('auth')} className="mt-4 px-4 py-2 rounded-lg bg-med-600 text-white font-medium hover:bg-med-700 transition">
          Sign in
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 paper-bg">
      <h1 className="text-xl sm:text-2xl font-bold text-ink font-display">Your dashboard</h1>
      <p className="text-ink-muted text-sm mt-1">Welcome, {profile.full_name || profile.email}.</p>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card label="Total cases" value={String(caseCount)} />
        <Card label="Access" value={profile.is_premium ? 'Premium' : 'Free'} />
        <Card label="Role" value={profile.is_admin ? 'Admin' : 'Member'} />
      </div>

      <div className={`mt-6 rounded-2xl border p-5 sm:p-6 ${profile.is_premium ? 'bg-med-50 border-med-200' : 'bg-peds-50 border-peds-200'}`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${profile.is_premium ? 'bg-gradient-to-br from-med-500 to-med-600 text-white' : 'bg-gradient-to-br from-peds-500 to-peds-600 text-white'}`}>
            {profile.is_premium ? <ShieldCheck className="w-6 h-6" /> : <Crown className="w-6 h-6" />}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-ink">{profile.is_premium ? 'Premium access active' : 'Free account'}</h2>
            <p className="text-sm text-ink-muted mt-1">
              {profile.is_premium
                ? 'All cases are unlocked for life. Enjoy the full casebook.'
                : 'Upgrade to unlock all cases for life — Rs 4,499 one-time.'}
            </p>
            {!profile.is_premium && (
              <button onClick={() => onNavigate('subscribe')} className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-peds-500 to-peds-600 text-white font-medium hover:from-peds-600 hover:to-peds-700 transition shadow-soft">
                <Crown className="w-4 h-4" /> Upgrade now <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-paper-card rounded-2xl border border-line p-5 sm:p-6 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-ink">Your payment requests</h3>
          <button onClick={() => { refreshProfile(); load(); }} className="text-sm text-med-600 font-medium hover:underline">
            Refresh
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center py-8 text-ink-muted">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <p className="text-sm text-ink-muted py-4">No payment requests yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {requests.map((r) => (
              <li key={r.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{r.method} — {r.reference}</p>
                  <p className="text-xs text-ink-muted">Rs {Number(r.amount).toLocaleString()} · {new Date(r.created_at).toLocaleDateString()}</p>
                </div>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper-card p-4 sm:p-5 shadow-soft">
      <p className="text-xs text-ink-muted uppercase tracking-wide">{label}</p>
      <p className="text-lg sm:text-2xl font-bold text-ink font-display mt-1">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { icon: React.ReactNode; cls: string; label: string }> = {
    pending: { icon: <Clock className="w-3.5 h-3.5" />, cls: 'bg-peds-100 text-peds-700', label: 'Pending' },
    approved: { icon: <CheckCircle2 className="w-3.5 h-3.5" />, cls: 'bg-med-100 text-med-700', label: 'Approved' },
    rejected: { icon: <XCircle className="w-3.5 h-3.5" />, cls: 'bg-surg-100 text-surg-700', label: 'Rejected' },
  };
  const s = map[status] ?? map.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${s.cls}`}>
      {s.icon}
      {s.label}
    </span>
  );
}
