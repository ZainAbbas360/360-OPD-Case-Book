import { BookOpenCheck, Copyright, ShieldCheck } from 'lucide-react';

export default function AuthorHeader() {
  return (
    <section className="bg-gradient-to-r from-ink via-ink-soft to-med-800 text-white border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.22em] font-semibold text-med-200 mb-1.5">
            Authored & curated by
          </p>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="font-display font-bold text-xl sm:text-2xl">Dr. Muhammad Zain Abbas</h2>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-white/90 font-semibold">MBBS</span>
          </div>
          <p className="text-white/70 text-sm mt-1.5">
            Clinical Author · Medical Educator · Founder, Medico 360
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <Badge icon={<BookOpenCheck className="w-4 h-4" />} label="Clinical Field Book" />
          <Badge icon={<ShieldCheck className="w-4 h-4" />} label="Original Educational Content" />
          <Badge icon={<Copyright className="w-4 h-4" />} label="All Rights Reserved" />
        </div>
      </div>
      <div className="border-t border-white/10 bg-black/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 text-[11px] sm:text-xs text-white/60">
          © 2026 Dr. Muhammad Zain Abbas · 360 OPD Case Book. Reproduction, redistribution or commercial reuse without permission is prohibited.
        </div>
      </div>
    </section>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.07] border border-white/10 text-white/80">
      {icon}
      <span>{label}</span>
    </div>
  );
}
