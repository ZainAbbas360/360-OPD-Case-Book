import { useAuth } from '../context/AuthContext';
import { Stethoscope, LogOut, LayoutDashboard, Shield, Crown } from 'lucide-react';

type Props = {
  onNavigate: (page: string) => void;
  current: string;
};

export default function Navbar({ onNavigate, current }: Props) {
  const { profile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-paper/85 backdrop-blur-md border-b border-line">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-med-600 font-semibold text-base sm:text-lg shrink-0"
        >
          <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="font-display hidden xs:inline sm:inline">OPD Casebook</span>
        </button>

        <nav className="flex items-center gap-0.5 sm:gap-2 text-sm">
          <NavBtn label="Cases" active={current === 'home'} onClick={() => onNavigate('home')} />
          {profile && (
            <NavBtn
              label="Dashboard"
              active={current === 'dashboard'}
              onClick={() => onNavigate('dashboard')}
              icon={<LayoutDashboard className="w-4 h-4" />}
            />
          )}
          {profile?.is_admin && (
            <NavBtn
              label="Admin"
              active={current === 'admin'}
              onClick={() => onNavigate('admin')}
              icon={<Shield className="w-4 h-4" />}
            />
          )}
          {!profile?.is_premium && profile && (
            <button
              onClick={() => onNavigate('subscribe')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-peds-500 to-peds-600 text-white font-medium hover:from-peds-600 hover:to-peds-700 transition shadow-soft"
            >
              <Crown className="w-4 h-4" />
              Get Lifetime
            </button>
          )}

          {profile ? (
            <div className="flex items-center gap-1.5 sm:gap-2 ml-1">
              {profile.is_premium && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-med-100 text-med-700 font-medium">
                  <Crown className="w-3 h-3" /> Premium
                </span>
              )}
              <button
                onClick={signOut}
                title="Sign out"
                className="p-2 rounded-lg text-ink-muted hover:bg-paper-dim hover:text-ink transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('auth')}
              className="px-3 py-1.5 rounded-lg bg-med-600 text-white font-medium hover:bg-med-700 transition shadow-soft"
            >
              Sign in
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

function NavBtn({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg font-medium transition ${
        active ? 'bg-med-100 text-med-700' : 'text-ink-muted hover:bg-paper-dim'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
