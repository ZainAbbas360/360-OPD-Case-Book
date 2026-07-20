import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, PaymentRequest } from '../lib/supabase';
import { uploadPaymentScreenshot } from '../lib/storage';
import {
  Crown,
  Banknote,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  Copy,
  Check,
  Smartphone,
  ListChecks,
  Wallet,
  MessageCircle,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';

type Props = { onNavigate: (page: string) => void };

const BANK = {
  accountTitle: 'Muhammad Zain Abbas',
  bankName: 'Allied Bank Limited',
  iban: 'PK17ABPA0010049773790013',
  swift: 'ABPAPKKAXXX',
  branch: 'Khayaban-e-Jinnah, Lahore, Pakistan',
};

const JAZZCASH = { number: '0300-1234567', title: 'Muhammad Zain Abbas' };
const EASYPESA = { number: '0300-7654321', title: 'Muhammad Zain Abbas' };
const WHATSAPP = 'https://wa.me/923001234567';

export default function SubscribePage({ onNavigate }: Props) {
  const { profile, refreshProfile } = useAuth();
  const [reference, setReference] = useState('');
  const [method, setMethod] = useState('Bank Transfer');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!profile) return;
    supabase
      .from('payment_requests')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setRequests((data as PaymentRequest[]) ?? []);
      });
  }, [profile]);

  if (!profile) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-ink-muted">Please sign in to subscribe.</p>
        <button onClick={() => onNavigate('auth')} className="mt-4 px-4 py-2 rounded-lg bg-med-600 text-white font-medium hover:bg-med-700 transition">
          Sign in
        </button>
      </div>
    );
  }

  if (profile.is_premium) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-med-100 text-med-600 flex items-center justify-center mb-4">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-semibold text-ink font-display">Premium access active</h2>
        <p className="mt-2 text-ink-muted text-sm">Enjoy all cases — unlocked for life.</p>
        <button onClick={() => onNavigate('home')} className="mt-5 px-5 py-2.5 rounded-xl bg-med-600 text-white font-medium hover:bg-med-700 transition">
          Browse cases
        </button>
      </div>
    );
  }

  function pickScreenshot(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setError('Screenshot must be under 5 MB.');
      return;
    }
    setScreenshotFile(f);
    setScreenshotPreview(URL.createObjectURL(f));
    setError(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!reference.trim()) {
      setError('Please enter your payment reference / transaction ID.');
      return;
    }
    setBusy(true);

    let screenshotPath: string | null = null;
    if (screenshotFile) {
      const res = await uploadPaymentScreenshot(screenshotFile, profile!.id);
      if ('error' in res) {
        setError(res.error);
        setBusy(false);
        return;
      }
      screenshotPath = res.path;
    }

    const { error: insError } = await supabase.from('payment_requests').insert({
      user_id: profile!.id,
      amount: 4499,
      method,
      reference: reference.trim(),
      status: 'pending',
      screenshot_path: screenshotPath,
    });
    setBusy(false);
    if (insError) {
      setError(insError.message);
      return;
    }
    setDone(true);
    await refreshProfile();
  }

  function copy(key: string, value: string) {
    navigator.clipboard?.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 paper-bg">
      {/* Price header — responsive, no overlap */}
      <div className="text-center mb-8">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-peds-500 to-peds-600 text-white flex items-center justify-center mb-3 shadow-soft">
          <Crown className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink font-display">Lifetime Premium Access</h1>
        <p className="mt-2 text-ink-muted text-sm sm:text-base">One payment. Unlimited access to all cases — forever.</p>
        <div className="mt-4 inline-flex flex-col items-center sm:flex-row sm:items-baseline sm:gap-1">
          <span className="text-3xl sm:text-4xl font-bold text-ink font-display">Rs 4,499</span>
          <span className="text-ink-muted text-sm sm:text-base">/ lifetime</span>
        </div>
      </div>

      {/* How it works */}
      <div className="mb-8 bg-paper-card rounded-2xl border border-line p-5 sm:p-6 shadow-soft">
        <h2 className="inline-flex items-center gap-2 font-semibold text-ink mb-4">
          <ListChecks className="w-5 h-5 text-med-600" /> How to pay & get access
        </h2>
        <ol className="space-y-3">
          <Step n={1} title="Choose a payment method">
            Bank transfer (Allied Bank), JazzCash, EasyPaisa, or Stripe card payment.
          </Step>
          <Step n={2} title="Send Rs 4,499">
            Transfer the exact amount to the account details shown below. Keep your transaction ID / reference handy.
          </Step>
          <Step n={3} title="Submit your reference & screenshot">
            Enter your transaction ID, upload a screenshot of the payment, and submit. Your request goes to the admin for verification.
          </Step>
          <Step n={4} title="Get unlocked — usually within hours">
            Once the admin verifies your payment, premium access is granted automatically and all cases unlock instantly.
          </Step>
        </ol>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={WHATSAPP} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200 text-sm font-medium hover:bg-green-100 transition">
            <MessageCircle className="w-4 h-4" /> WhatsApp for help
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Payment accounts */}
        <div className="space-y-6">
          <div className="bg-paper-card rounded-2xl border border-line p-5 sm:p-6 shadow-soft">
            <h3 className="inline-flex items-center gap-2 font-semibold text-ink">
              <Banknote className="w-5 h-5 text-med-600" /> Bank Transfer
            </h3>
            <dl className="mt-4 space-y-1 text-sm">
              <Row label="Account Title" value={BANK.accountTitle} onCopy={() => copy('title', BANK.accountTitle)} copied={copied === 'title'} />
              <Row label="Bank" value={BANK.bankName} onCopy={() => copy('bank', BANK.bankName)} copied={copied === 'bank'} />
              <Row label="IBAN" value={BANK.iban} mono onCopy={() => copy('iban', BANK.iban)} copied={copied === 'iban'} />
              <Row label="SWIFT/BIC" value={BANK.swift} mono onCopy={() => copy('swift', BANK.swift)} copied={copied === 'swift'} />
              <Row label="Branch" value={BANK.branch} onCopy={() => copy('branch', BANK.branch)} copied={copied === 'branch'} />
            </dl>
          </div>

          <div className="bg-paper-card rounded-2xl border border-line p-5 sm:p-6 shadow-soft">
            <h3 className="inline-flex items-center gap-2 font-semibold text-ink">
              <Smartphone className="w-5 h-5 text-peds-600" /> Mobile Wallets
            </h3>
            <div className="mt-4 space-y-4">
              <div className="rounded-xl bg-peds-50 border border-peds-200 p-4">
                <p className="inline-flex items-center gap-2 text-sm font-medium text-peds-700">
                  <Wallet className="w-4 h-4" /> JazzCash
                </p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-ink-muted">Number</p>
                    <p className="font-mono text-ink font-medium">{JAZZCASH.number}</p>
                    <p className="text-xs text-ink-muted mt-1">Title: {JAZZCASH.title}</p>
                  </div>
                  <button onClick={() => copy('jazz', JAZZCASH.number)} className="p-2 rounded-lg text-ink-muted hover:bg-paper-dim hover:text-ink transition">
                    {copied === 'jazz' ? <Check className="w-4 h-4 text-med-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="rounded-xl bg-med-50 border border-med-200 p-4">
                <p className="inline-flex items-center gap-2 text-sm font-medium text-med-700">
                  <Wallet className="w-4 h-4" /> EasyPaisa
                </p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-ink-muted">Number</p>
                    <p className="font-mono text-ink font-medium">{EASYPESA.number}</p>
                    <p className="text-xs text-ink-muted mt-1">Title: {EASYPESA.title}</p>
                  </div>
                  <button onClick={() => copy('easy', EASYPESA.number)} className="p-2 rounded-lg text-ink-muted hover:bg-paper-dim hover:text-ink transition">
                    {copied === 'easy' ? <Check className="w-4 h-4 text-med-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-ink-muted">
              For Stripe card payment, message on WhatsApp to receive a secure payment link.
            </p>
          </div>
        </div>

        {/* Submit reference */}
        <div className="bg-paper-card rounded-2xl border border-line p-5 sm:p-6 shadow-soft">
          <h2 className="inline-flex items-center gap-2 font-semibold text-ink">
            <ShieldCheck className="w-5 h-5 text-med-600" /> Submit your payment
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Enter the transaction reference and upload a screenshot of your payment.
          </p>

          {done ? (
            <div className="mt-6 rounded-xl bg-med-50 border border-med-200 p-6 text-center">
              <CheckCircle2 className="w-10 h-10 text-med-600 mx-auto" />
              <h3 className="mt-3 font-semibold text-med-700">Request submitted!</h3>
              <p className="mt-1 text-sm text-med-700/80">
                Your payment is pending verification. Access unlocks automatically once approved.
              </p>
              <button onClick={() => onNavigate('dashboard')} className="mt-4 px-4 py-2 rounded-lg bg-med-600 text-white font-medium hover:bg-med-700 transition">
                Go to dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-ink-soft">Payment method</span>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-line focus:border-med-500 focus:ring-2 focus:ring-med-100 outline-none transition bg-paper-card"
                >
                  <option>Bank Transfer</option>
                  <option>JazzCash</option>
                  <option>EasyPaisa</option>
                  <option>Stripe</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-ink-soft">Transaction ID / Reference</span>
                <input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. FT24011500012345 or TID 998877"
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-line focus:border-med-500 focus:ring-2 focus:ring-med-100 outline-none transition"
                />
              </label>

              {/* Screenshot upload */}
              <div>
                <span className="text-sm font-medium text-ink-soft">Payment screenshot (optional)</span>
                <input ref={fileRef} type="file" accept="image/*" onChange={pickScreenshot} className="hidden" />
                {screenshotPreview ? (
                  <div className="mt-1 relative rounded-lg overflow-hidden border border-line">
                    <img src={screenshotPreview} alt="Screenshot" className="w-full h-40 object-cover" />
                    <button
                      type="button"
                      onClick={() => { setScreenshotFile(null); setScreenshotPreview(null); if (fileRef.current) fileRef.current.value = ''; }}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-ink/70 text-white hover:bg-ink transition"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="mt-1 w-full py-6 rounded-lg border-2 border-dashed border-line hover:border-med-400 hover:bg-med-50/30 transition flex flex-col items-center gap-2 text-ink-muted"
                  >
                    <Upload className="w-6 h-6" />
                    <span className="text-sm">Click to upload a screenshot</span>
                    <span className="text-xs">PNG, JPG up to 5 MB</span>
                  </button>
                )}
              </div>

              {error && (
                <div className="text-sm text-surg-700 bg-surg-50 border border-surg-200 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-med-600 to-med-700 text-white font-medium hover:from-med-700 hover:to-med-800 transition disabled:opacity-60 flex items-center justify-center gap-2 shadow-soft"
              >
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit payment for verification
              </button>
              <p className="text-xs text-ink-muted text-center">
                Your account: <span className="font-medium text-ink">{profile.email}</span>
              </p>
            </form>
          )}
        </div>
      </div>

      {requests.length > 0 && (
        <div className="mt-8 bg-paper-card rounded-2xl border border-line p-5 sm:p-6 shadow-soft">
          <h3 className="font-semibold text-ink">Your payment history</h3>
          <ul className="mt-3 divide-y divide-line">
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
        </div>
      )}
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="shrink-0 w-7 h-7 rounded-full bg-med-600 text-white text-sm font-semibold flex items-center justify-center">
        {n}
      </span>
      <div>
        <p className="font-medium text-ink">{title}</p>
        <p className="text-sm text-ink-muted">{children}</p>
      </div>
    </li>
  );
}

function Row({
  label,
  value,
  mono,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  mono?: boolean;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-line last:border-0">
      <div className="min-w-0">
        <dt className="text-xs text-ink-muted uppercase tracking-wide">{label}</dt>
        <dd className={`text-ink font-medium truncate ${mono ? 'font-mono text-sm' : ''}`}>{value}</dd>
      </div>
      <button onClick={onCopy} className="p-2 rounded-lg text-ink-muted hover:bg-paper-dim hover:text-ink transition shrink-0" title="Copy">
        {copied ? <Check className="w-4 h-4 text-med-600" /> : <Copy className="w-4 h-4" />}
      </button>
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
