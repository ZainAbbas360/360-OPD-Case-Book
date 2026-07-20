import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, MedicalCase, PaymentRequest, Profile } from '../lib/supabase';
import { uploadCaseImage, getScreenshotUrl } from '../lib/storage';
import {
  Shield, Loader2, Plus, Pencil, Trash2, X, CheckCircle2, Clock, XCircle,
  Save, BookOpen, Users, ChevronDown, ChevronRight, Search, EyeOff, Eye,
  Crown, Unlock, Upload, Image as ImageIcon, FileText,
} from 'lucide-react';

type Props = { onNavigate: (page: string) => void };
type Tab = 'cases' | 'payments' | 'users';

export default function AdminPage({ onNavigate }: Props) {
  const { profile } = useAuth();
  const [tab, setTab] = useState<Tab>('cases');

  if (!profile?.is_admin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Shield className="w-10 h-10 text-ink-muted mx-auto mb-3" />
        <p className="text-ink-muted">Admin access required.</p>
        <button onClick={() => onNavigate('home')} className="mt-4 text-med-600 font-medium hover:underline">
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 paper-bg">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-6 h-6 text-med-600" />
        <h1 className="text-xl sm:text-2xl font-bold text-ink font-display">Admin Panel</h1>
      </div>

      <div className="flex gap-1 sm:gap-2 mb-6 border-b border-line overflow-x-auto">
        <TabBtn active={tab === 'cases'} onClick={() => setTab('cases')} icon={<BookOpen className="w-4 h-4" />} label="Cases" />
        <TabBtn active={tab === 'payments'} onClick={() => setTab('payments')} icon={<Clock className="w-4 h-4" />} label="Payments" />
        <TabBtn active={tab === 'users'} onClick={() => setTab('users')} icon={<Users className="w-4 h-4" />} label="Users" />
      </div>

      {tab === 'cases' && <CasesManager />}
      {tab === 'payments' && <PaymentsManager />}
      {tab === 'users' && <UsersManager />}
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2.5 font-medium text-sm transition border-b-2 -mb-px whitespace-nowrap ${
        active ? 'border-med-600 text-med-700' : 'border-transparent text-ink-muted hover:text-ink'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* ============================ CASES MANAGER ============================ */

type CaseForm = {
  title: string;
  specialty: string;
  patient_age: string;
  patient_gender: string;
  chief_complaint: string;
  excerpt: string;
  history: string;
  examination: string;
  investigations: string;
  diagnosis: string;
  management: string;
  discussion: string;
  image_url: string;
  is_published: boolean;
  is_free: boolean;
};

const EMPTY_FORM: CaseForm = {
  title: '', specialty: '', patient_age: '', patient_gender: '',
  chief_complaint: '', excerpt: '', history: '', examination: '',
  investigations: '', diagnosis: '', management: '', discussion: '',
  image_url: '', is_published: true, is_free: false,
};

function CasesManager() {
  const [cases, setCases] = useState<MedicalCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<MedicalCase | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<MedicalCase | null>(null);
  const [query, setQuery] = useState('');
  const [specFilter, setSpecFilter] = useState('All');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('cases').select('*').order('created_at', { ascending: true });
    setCases((data as MedicalCase[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function deleteCase(c: MedicalCase) {
    await supabase.from('cases').delete().eq('id', c.id);
    setConfirmDelete(null);
    load();
  }

  async function quickToggle(c: MedicalCase, field: 'is_published' | 'is_free') {
    await supabase.from('cases').update({ [field]: !c[field] }).eq('id', c.id);
    load();
  }

  const specialties = ['All', ...Array.from(new Set(cases.map((c) => c.specialty)))];
  const filtered = cases.filter((c) => {
    const matchSpec = specFilter === 'All' || c.specialty === specFilter;
    const q = query.toLowerCase();
    const matchQuery = !q || c.title.toLowerCase().includes(q) || c.specialty.toLowerCase().includes(q);
    return matchSpec && matchQuery;
  });

  if (loading) {
    return <div className="flex justify-center py-20 text-ink-muted"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases…"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-line bg-paper-card focus:border-med-500 focus:ring-2 focus:ring-med-100 outline-none transition shadow-soft"
          />
        </div>
        <select
          value={specFilter}
          onChange={(e) => setSpecFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-line bg-paper-card focus:border-med-500 focus:ring-2 focus:ring-med-100 outline-none transition shadow-soft"
        >
          {specialties.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-med-600 to-med-700 text-white font-medium hover:from-med-700 hover:to-med-800 transition shadow-soft whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add new case
        </button>
      </div>

      <p className="text-ink-muted text-sm mb-3">{filtered.length} of {cases.length} cases</p>

      {/* Case list */}
      <div className="space-y-3">
        {filtered.map((c) => (
          <div key={c.id} className="bg-paper-card rounded-xl border border-line p-3 sm:p-4 flex items-center gap-3 sm:gap-4 shadow-soft">
            {c.image_url ? (
              <img src={c.image_url} alt="" className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover shrink-0" />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-paper-dim flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-ink-muted" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-ink truncate">{c.title}</p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-xs text-ink-muted">{c.specialty}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${c.is_published ? 'bg-med-100 text-med-700' : 'bg-paper-dim text-ink-muted'}`}>
                  {c.is_published ? 'Published' : 'Hidden'}
                </span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${c.is_free ? 'bg-med-50 text-med-600' : 'bg-peds-50 text-peds-600'}`}>
                  {c.is_free ? 'Free' : 'Premium'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
              <button onClick={() => quickToggle(c, 'is_published')} title={c.is_published ? 'Unpublish' : 'Publish'}
                className="p-2 rounded-lg text-ink-muted hover:bg-med-50 hover:text-med-700 transition">
                {c.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => quickToggle(c, 'is_free')} title={c.is_free ? 'Make premium' : 'Make free'}
                className="p-2 rounded-lg text-ink-muted hover:bg-peds-50 hover:text-peds-600 transition">
                {c.is_free ? <Unlock className="w-4 h-4" /> : <Crown className="w-4 h-4" />}
              </button>
              <button onClick={() => setEditing(c)} title="Edit"
                className="p-2 rounded-lg text-ink-muted hover:bg-med-50 hover:text-med-700 transition">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => setConfirmDelete(c)} title="Delete"
                className="p-2 rounded-lg text-ink-muted hover:bg-surg-50 hover:text-surg-700 transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {(creating || editing) && (
        <CaseEditor
          existing={editing}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={() => { setCreating(false); setEditing(null); load(); }}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Delete this case?"
          message={`"${confirmDelete.title}" will be permanently removed.`}
          confirmLabel="Delete"
          danger
          onConfirm={() => deleteCase(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

function CaseEditor({ existing, onClose, onSaved }: { existing: MedicalCase | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<CaseForm>(
    existing
      ? {
          title: existing.title, specialty: existing.specialty,
          patient_age: existing.patient_age?.toString() ?? '', patient_gender: existing.patient_gender ?? '',
          chief_complaint: existing.chief_complaint ?? '', excerpt: existing.excerpt,
          history: existing.history ?? '', examination: existing.examination ?? '',
          investigations: existing.investigations ?? '', diagnosis: existing.diagnosis ?? '',
          management: existing.management ?? '', discussion: existing.discussion ?? '',
          image_url: existing.image_url ?? '', is_published: existing.is_published, is_free: existing.is_free,
        }
      : { ...EMPTY_FORM }
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof CaseForm>(key: K, value: CaseForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const res = await uploadCaseImage(file);
    setUploading(false);
    if ('error' in res) { setError(res.error); return; }
    set('image_url', res.url);
  }

  async function save() {
    setError(null);
    if (!form.title.trim() || !form.specialty.trim() || !form.excerpt.trim()) {
      setError('Title, specialty, and excerpt are required.');
      return;
    }
    setBusy(true);
    const payload = {
      title: form.title.trim(),
      specialty: form.specialty.trim(),
      patient_age: form.patient_age ? parseInt(form.patient_age) : null,
      patient_gender: form.patient_gender || null,
      chief_complaint: form.chief_complaint || null,
      excerpt: form.excerpt.trim(),
      history: form.history || null,
      examination: form.examination || null,
      investigations: form.investigations || null,
      diagnosis: form.diagnosis || null,
      management: form.management || null,
      discussion: form.discussion || null,
      image_url: form.image_url || null,
      is_published: form.is_published,
      is_free: form.is_free,
    };
    const res = existing
      ? await supabase.from('cases').update(payload).eq('id', existing.id)
      : await supabase.from('cases').insert(payload);
    setBusy(false);
    if (res.error) { setError(res.error.message); return; }
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink/50 flex items-start sm:items-center justify-center overflow-y-auto p-3 sm:p-4">
      <div className="bg-paper-card rounded-2xl shadow-card border border-line w-full max-w-2xl my-4">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-line sticky top-0 bg-paper-card rounded-t-2xl z-10">
          <h2 className="font-semibold text-ink text-lg">{existing ? 'Edit case' : 'New case'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-ink-muted hover:bg-paper-dim transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Title *" value={form.title} onChange={(v) => set('title', v)} placeholder="e.g. Acute Appendicitis" />
            <Input label="Specialty *" value={form.specialty} onChange={(v) => set('specialty', v)} placeholder="e.g. General Surgery" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Patient age" type="number" value={form.patient_age} onChange={(v) => set('patient_age', v)} placeholder="e.g. 24" />
            <Select label="Patient gender" value={form.patient_gender} onChange={(v) => set('patient_gender', v)} options={['', 'male', 'female', 'other']} />
          </div>
          <Input label="Chief complaint" value={form.chief_complaint} onChange={(v) => set('chief_complaint', v)} placeholder="e.g. Right lower quadrant pain" />
          <TextArea label="Excerpt (public preview) *" value={form.excerpt} onChange={(v) => set('excerpt', v)} placeholder="Short summary visible to all users" rows={2} />

          {/* Image upload */}
          <div>
            <span className="text-sm font-medium text-ink-soft">Case image</span>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <div className="mt-1 flex items-center gap-3">
              {form.image_url ? (
                <div className="relative">
                  <img src={form.image_url} alt="Case" className="w-24 h-24 rounded-lg object-cover border border-line" />
                  <button type="button" onClick={() => set('image_url', '')}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-surg-600 text-white hover:bg-surg-700 transition">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="w-24 h-24 rounded-lg border-2 border-dashed border-line hover:border-med-400 hover:bg-med-50/30 transition flex flex-col items-center justify-center text-ink-muted">
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                </button>
              )}
              <div className="flex-1">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="text-sm text-med-600 font-medium hover:underline">
                  {uploading ? 'Uploading…' : 'Upload from device'}
                </button>
                <p className="text-xs text-ink-muted mt-1">Or paste an image URL below</p>
                <input
                  value={form.image_url}
                  onChange={(e) => set('image_url', e.target.value)}
                  placeholder="https://images.pexels.com/…"
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-line focus:border-med-500 focus:ring-2 focus:ring-med-100 outline-none transition text-sm"
                />
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Toggle label="Published" desc="Visible in catalog" checked={form.is_published} onChange={(v) => set('is_published', v)} />
            <Toggle label="Free access" desc="Readable without premium" checked={form.is_free} onChange={(v) => set('is_free', v)} />
          </div>

          <Expandable label="History" value={form.history} onChange={(v) => set('history', v)} />
          <Expandable label="Examination" value={form.examination} onChange={(v) => set('examination', v)} />
          <Expandable label="Investigations" value={form.investigations} onChange={(v) => set('investigations', v)} />
          <Expandable label="Diagnosis" value={form.diagnosis} onChange={(v) => set('diagnosis', v)} />
          <Expandable label="Management" value={form.management} onChange={(v) => set('management', v)} />
          <Expandable label="Discussion" value={form.discussion} onChange={(v) => set('discussion', v)} />

          {error && (
            <div className="text-sm text-surg-700 bg-surg-50 border border-surg-200 rounded-lg px-3 py-2">{error}</div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 sm:p-5 border-t border-line sticky bottom-0 bg-paper-card rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-ink-muted hover:bg-paper-dim transition font-medium">Cancel</button>
          <button onClick={save} disabled={busy}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-med-600 to-med-700 text-white font-medium hover:from-med-700 hover:to-med-800 transition disabled:opacity-60 shadow-soft">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {existing ? 'Save changes' : 'Create case'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Expandable({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-line overflow-hidden">
      <button type="button" onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-paper-dim transition">
        {label}
        {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      {open && (
        <div className="px-4 pb-4">
          <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4}
            placeholder={`Enter ${label.toLowerCase()} content…`}
            className="w-full px-3 py-2 rounded-lg border border-line focus:border-med-500 focus:ring-2 focus:ring-med-100 outline-none transition text-sm" />
        </div>
      )}
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition flex-1 text-left ${
        checked ? 'bg-med-50 border-med-300' : 'bg-paper-dim border-line'
      }`}>
      <div className={`w-10 h-6 rounded-full transition relative ${checked ? 'bg-med-600' : 'bg-ink-muted/30'}`}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${checked ? 'left-[1.125rem]' : 'left-0.5'}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs text-ink-muted">{desc}</p>
      </div>
    </button>
  );
}

/* ============================ PAYMENTS MANAGER ============================ */

function PaymentsManager() {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [viewingShot, setViewingShot] = useState<PaymentRequest | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('payment_requests').select('*').order('created_at', { ascending: false });
    setRequests((data as PaymentRequest[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function review(id: string, userId: string, status: 'approved' | 'rejected') {
    setBusy(id);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('payment_requests').update({
      status, reviewed_by: user?.id ?? null, reviewed_at: new Date().toISOString(),
    }).eq('id', id);
    if (status === 'approved') {
      await supabase.from('profiles').update({ is_premium: true, premium_since: new Date().toISOString() }).eq('id', userId);
    }
    setBusy(null);
    load();
  }

  if (loading) {
    return <div className="flex justify-center py-20 text-ink-muted"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  const pending = requests.filter((r) => r.status === 'pending');
  const reviewed = requests.filter((r) => r.status !== 'pending');

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <div>
          <h3 className="font-semibold text-ink mb-3">Pending approval ({pending.length})</h3>
          <div className="space-y-3">
            {pending.map((r) => (
              <div key={r.id} className="bg-paper-card rounded-2xl border border-line p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-soft">
                <div className="min-w-0">
                  <p className="font-medium text-ink">{r.method} — {r.reference}</p>
                  <p className="text-sm text-ink-muted">Rs {Number(r.amount).toLocaleString()} · {new Date(r.created_at).toLocaleDateString()}</p>
                  {r.screenshot_path && (
                    <button onClick={() => setViewingShot(r)} className="mt-2 inline-flex items-center gap-1.5 text-sm text-med-600 font-medium hover:underline">
                      <ImageIcon className="w-4 h-4" /> View screenshot
                    </button>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => review(r.id, r.user_id, 'approved')} disabled={busy === r.id}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-med-600 to-med-700 text-white text-sm font-medium hover:from-med-700 hover:to-med-800 transition disabled:opacity-60 shadow-soft">
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                  <button onClick={() => review(r.id, r.user_id, 'rejected')} disabled={busy === r.id}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surg-50 text-surg-700 text-sm font-medium hover:bg-surg-100 transition disabled:opacity-60">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reviewed.length > 0 && (
        <div>
          <h3 className="font-semibold text-ink mb-3">History</h3>
          <div className="bg-paper-card rounded-2xl border border-line divide-y divide-line shadow-soft">
            {reviewed.map((r) => (
              <div key={r.id} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{r.method} — {r.reference}</p>
                  <p className="text-xs text-ink-muted">Rs {Number(r.amount).toLocaleString()} · {new Date(r.created_at).toLocaleDateString()}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {requests.length === 0 && <p className="text-center text-ink-muted py-20">No payment requests yet.</p>}

      {viewingShot && viewingShot.screenshot_path && (
        <ScreenshotViewer
          path={viewingShot.screenshot_path}
          reference={viewingShot.reference}
          onClose={() => setViewingShot(null)}
        />
      )}
    </div>
  );
}

function ScreenshotViewer({ path, reference, onClose }: { path: string; reference: string; onClose: () => void }) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getScreenshotUrl(path).then((u) => { setUrl(u); setLoading(false); });
  }, [path]);

  return (
    <div className="fixed inset-0 z-50 bg-ink/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-paper-card rounded-2xl shadow-card border border-line max-w-2xl w-full p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <p className="font-medium text-ink text-sm">Screenshot — {reference}</p>
          <button onClick={onClose} className="p-2 rounded-lg text-ink-muted hover:bg-paper-dim transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-ink-muted" /></div>
        ) : url ? (
          <img src={url} alt="Payment screenshot" className="w-full rounded-lg" />
        ) : (
          <p className="text-center text-ink-muted py-20">Could not load screenshot.</p>
        )}
      </div>
    </div>
  );
}

/* ============================ USERS MANAGER ============================ */

function UsersManager() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setUsers((data as Profile[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function togglePremium(u: Profile) {
    await supabase.from('profiles').update({
      is_premium: !u.is_premium,
      premium_since: !u.is_premium ? new Date().toISOString() : null,
    }).eq('id', u.id);
    load();
  }

  async function toggleAdmin(u: Profile) {
    await supabase.from('profiles').update({ is_admin: !u.is_admin }).eq('id', u.id);
    load();
  }

  if (loading) {
    return <div className="flex justify-center py-20 text-ink-muted"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <div className="bg-paper-card rounded-2xl border border-line divide-y divide-line shadow-soft">
      {users.map((u) => (
        <div key={u.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-medium text-ink">{u.full_name || u.email}</p>
            <p className="text-xs text-ink-muted truncate">{u.email}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => togglePremium(u)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${u.is_premium ? 'bg-med-100 text-med-700 hover:bg-med-200' : 'bg-paper-dim text-ink-muted hover:bg-line'}`}>
              {u.is_premium ? 'Premium ✓' : 'Set Premium'}
            </button>
            <button onClick={() => toggleAdmin(u)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${u.is_admin ? 'bg-med-100 text-med-700 hover:bg-med-200' : 'bg-paper-dim text-ink-muted hover:bg-line'}`}>
              {u.is_admin ? 'Admin ✓' : 'Set Admin'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================ SHARED UI ============================ */

function Input({ label, type = 'text', value, onChange, placeholder }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="mt-1 w-full px-3 py-2 rounded-lg border border-line focus:border-med-500 focus:ring-2 focus:ring-med-100 outline-none transition text-sm" />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        className="mt-1 w-full px-3 py-2 rounded-lg border border-line focus:border-med-500 focus:ring-2 focus:ring-med-100 outline-none transition text-sm" />
    </label>
  );
}

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-3 py-2 rounded-lg border border-line focus:border-med-500 focus:ring-2 focus:ring-med-100 outline-none transition text-sm bg-paper-card">
        {options.map((o) => <option key={o} value={o}>{o || '—'}</option>)}
      </select>
    </label>
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
      {s.icon}{s.label}
    </span>
  );
}

function ConfirmDialog({ title, message, confirmLabel, danger, onConfirm, onCancel }: {
  title: string; message: string; confirmLabel: string; danger?: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-4">
      <div className="bg-paper-card rounded-2xl shadow-card border border-line max-w-sm w-full p-6">
        <h3 className="font-semibold text-ink text-lg">{title}</h3>
        <p className="mt-2 text-sm text-ink-muted">{message}</p>
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-ink-muted hover:bg-paper-dim transition font-medium">Cancel</button>
          <button onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white font-medium transition ${danger ? 'bg-surg-600 hover:bg-surg-700' : 'bg-med-600 hover:bg-med-700'}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
