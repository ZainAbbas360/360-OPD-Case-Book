import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, Profile } from '../lib/supabase';
import { ArrowLeft, Crown, Loader2, Plus, Shield, Trash2, UserPlus, Users } from 'lucide-react';

type Props = { onNavigate: (page: string) => void };

type AdminUsersResponse = {
  ok?: boolean;
  users?: Profile[];
  caller_id?: string;
  error?: string;
};

export default function UsersAdminPage({ onNavigate }: Props) {
  const { profile } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [callerId, setCallerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null);

  const invoke = useCallback(async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke<AdminUsersResponse>('admin-users', { body });
    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);
    return data;
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await invoke({ action: 'list' });
      setUsers(data?.users ?? []);
      setCallerId(data?.caller_id ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [invoke]);

  useEffect(() => { void load(); }, [load]);

  async function updateUser(u: Profile, patch: Record<string, unknown>) {
    setBusy(u.id);
    setError(null);
    try {
      await invoke({ action: 'update', id: u.id, ...patch });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  async function deleteUser() {
    if (!deleteTarget) return;
    setBusy(deleteTarget.id);
    setError(null);
    try {
      await invoke({ action: 'delete', id: deleteTarget.id });
      setDeleteTarget(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  if (!profile?.is_admin) {
    return <div className="max-w-md mx-auto px-4 py-20 text-center"><Shield className="w-10 h-10 text-ink-muted mx-auto mb-3" /><p className="text-ink-muted">Admin access required.</p><button onClick={() => onNavigate('home')} className="mt-4 text-med-600 font-medium hover:underline">Back to home</button></div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <button onClick={() => onNavigate('admin')} className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-2"><ArrowLeft className="w-4 h-4" /> Back to Admin Panel</button>
          <div className="flex items-center gap-2"><Users className="w-6 h-6 text-med-600" /><h1 className="text-xl sm:text-2xl font-bold text-ink font-display">User Management</h1></div>
          <p className="text-sm text-ink-muted mt-1">Create, delete, promote and manage premium access.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-med-600 text-white font-medium hover:bg-med-700 transition"><UserPlus className="w-4 h-4" /> Add User</button>
      </div>

      {error && <div className="mb-4 rounded-xl border border-surg-200 bg-surg-50 text-surg-700 px-4 py-3 text-sm">{error}</div>}

      {loading ? <div className="flex justify-center py-20 text-ink-muted"><Loader2 className="w-6 h-6 animate-spin" /></div> : (
        <div className="bg-paper-card rounded-2xl border border-line divide-y divide-line shadow-soft">
          {users.map((u) => {
            const self = u.id === callerId;
            return <div key={u.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap"><p className="font-medium text-ink">{u.full_name || u.email}</p>{self && <span className="text-xs px-2 py-0.5 rounded-full bg-paper-dim text-ink-muted">You</span>}</div>
                <p className="text-xs text-ink-muted truncate">{u.email}</p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <button disabled={busy === u.id} onClick={() => updateUser(u, { is_premium: !u.is_premium })} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-50 ${u.is_premium ? 'bg-med-100 text-med-700' : 'bg-paper-dim text-ink-muted hover:bg-line'}`}><Crown className="w-3.5 h-3.5" /> {u.is_premium ? 'Premium ✓' : 'Set Premium'}</button>
                <button disabled={busy === u.id || self} onClick={() => updateUser(u, { is_admin: !u.is_admin })} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-50 ${u.is_admin ? 'bg-med-100 text-med-700' : 'bg-paper-dim text-ink-muted hover:bg-line'}`}><Shield className="w-3.5 h-3.5" /> {u.is_admin ? 'Admin ✓' : 'Set Admin'}</button>
                <button disabled={busy === u.id || self} onClick={() => setDeleteTarget(u)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-surg-50 text-surg-700 hover:bg-surg-100 transition disabled:opacity-50"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
              </div>
            </div>;
          })}
          {users.length === 0 && <p className="text-center text-ink-muted py-16">No users found.</p>}
        </div>
      )}

      {showAdd && <AddUserModal onClose={() => setShowAdd(false)} onCreated={async () => { setShowAdd(false); await load(); }} invoke={invoke} />}

      {deleteTarget && <div className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-4"><div className="bg-paper-card rounded-2xl shadow-card border border-line max-w-sm w-full p-6"><h3 className="font-semibold text-ink text-lg">Delete user?</h3><p className="mt-2 text-sm text-ink-muted">This will permanently remove <strong>{deleteTarget.email}</strong> from authentication and the app.</p><div className="mt-5 flex justify-end gap-3"><button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-lg text-ink-muted hover:bg-paper-dim">Cancel</button><button onClick={deleteUser} disabled={busy === deleteTarget.id} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surg-600 text-white font-medium hover:bg-surg-700 disabled:opacity-50">{busy === deleteTarget.id && <Loader2 className="w-4 h-4 animate-spin" />} Delete</button></div></div></div>}
    </div>
  );
}

function AddUserModal({ onClose, onCreated, invoke }: { onClose: () => void; onCreated: () => Promise<void>; invoke: (body: Record<string, unknown>) => Promise<AdminUsersResponse | null> }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [premium, setPremium] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      await invoke({ action: 'create', full_name: fullName, email, password, is_premium: premium, is_admin: admin });
      await onCreated();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally { setBusy(false); }
  }

  return <div className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-4"><form onSubmit={create} className="bg-paper-card rounded-2xl shadow-card border border-line max-w-md w-full p-6"><div className="flex items-center gap-2 mb-5"><Plus className="w-5 h-5 text-med-600" /><h3 className="font-semibold text-ink text-lg">Add new user</h3></div><div className="space-y-4"><Field label="Full name" value={fullName} onChange={setFullName} /><Field label="Email" type="email" value={email} onChange={setEmail} required /><Field label="Temporary password" type="password" value={password} onChange={setPassword} required /><label className="flex items-center gap-2 text-sm text-ink-soft"><input type="checkbox" checked={premium} onChange={(e) => setPremium(e.target.checked)} /> Premium access</label><label className="flex items-center gap-2 text-sm text-ink-soft"><input type="checkbox" checked={admin} onChange={(e) => setAdmin(e.target.checked)} /> Admin access</label>{error && <div className="text-sm text-surg-700 bg-surg-50 border border-surg-200 rounded-lg px-3 py-2">{error}</div>}</div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-ink-muted hover:bg-paper-dim">Cancel</button><button type="submit" disabled={busy} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-med-600 text-white font-medium hover:bg-med-700 disabled:opacity-50">{busy && <Loader2 className="w-4 h-4 animate-spin" />} Create User</button></div></form></div>;
}

function Field({ label, type = 'text', value, onChange, required }: { label: string; type?: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return <label className="block"><span className="text-sm font-medium text-ink-soft">{label}</span><input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className="mt-1 w-full px-3 py-2 rounded-lg border border-line focus:border-med-500 focus:ring-2 focus:ring-med-100 outline-none transition" /></label>;
}
