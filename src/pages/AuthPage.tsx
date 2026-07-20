import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Stethoscope, Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

type Props = { onNavigate: (page: string) => void };

export default function AuthPage({ onNavigate }: Props) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    if (mode === 'forgot') {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      setBusy(false);
      if (err) setError(err.message);
      else setResetSent(true);
      return;
    }
    const res = mode === 'signin' ? await signIn(email, password) : await signUp(email, password, fullName);
    setBusy(false);
    if (res.error) setError(res.error);
    else onNavigate('home');
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 paper-bg">
      <div className="w-full max-w-md bg-paper-card rounded-2xl shadow-card border border-line p-6 sm:p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-med-500 to-med-600 text-white flex items-center justify-center mb-3 shadow-glow">
            <Stethoscope className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-ink font-display text-center">
            {mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Reset password'}
          </h1>
          <p className="text-ink-muted text-sm mt-1 text-center">
            {mode === 'signin'
              ? 'Sign in to access the OPD casebook.'
              : mode === 'signup'
              ? 'Join to browse common OPD cases.'
              : 'Enter your email and we will send a reset link.'}
          </p>
        </div>

        {mode === 'forgot' && resetSent ? (
          <div className="text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-med-50 text-med-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-semibold text-ink">Check your email</h3>
            <p className="mt-2 text-sm text-ink-muted">
              If an account exists for <span className="font-medium text-ink">{email}</span>, a password reset link is on its way.
            </p>
            <button
              onClick={() => { setMode('signin'); setResetSent(false); setError(null); }}
              className="mt-5 inline-flex items-center gap-2 text-med-600 font-medium hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Back to sign in
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && (
              <Field label="Full name" value={fullName} onChange={setFullName} placeholder="Dr. Ayesha Khan" required />
            )}
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@hospital.com" required />
            {mode !== 'forgot' && (
              <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 6 characters" required />
            )}

            {mode === 'signin' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setError(null); setResetSent(false); }}
                  className="text-sm text-med-600 font-medium hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

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
              {mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : (<><Mail className="w-4 h-4" /> Send reset link</>)}
            </button>
          </form>
        )}

        {mode !== 'forgot' && !resetSent && (
          <p className="text-center text-sm text-ink-muted mt-6">
            {mode === 'signin' ? "Don't have an account?" : 'Already registered?'}{' '}
            <button
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
              className="text-med-600 font-medium hover:underline"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        )}

        {mode === 'forgot' && !resetSent && (
          <p className="text-center text-sm text-ink-muted mt-6">
            <button
              onClick={() => { setMode('signin'); setError(null); }}
              className="inline-flex items-center gap-1.5 text-med-600 font-medium hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Back to sign in
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-1 w-full px-3 py-2 rounded-lg border border-line focus:border-med-500 focus:ring-2 focus:ring-med-100 outline-none transition"
      />
    </label>
  );
}
