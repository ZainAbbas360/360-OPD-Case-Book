import { GraduationCap, BookOpen, Award } from 'lucide-react';

export default function AuthorHeader() {
  return (
    <div className="bg-gradient-to-r from-ink via-ink-soft to-med-800 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-med-400 to-med-600 flex items-center justify-center text-white font-bold text-xl font-display shadow-glow">
            MZA
          </div>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <h2 className="font-display font-semibold text-lg">Dr. Muhammad Zain Abbas</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/80">
              MBBS
            </span>
          </div>
          <p className="text-white/70 text-sm mt-0.5">
            Founder, 360 Medico Forum · Clinical Author & Medical Educator
          </p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 text-white/80">
          <Badge icon={<GraduationCap className="w-4 h-4" />} label="Clinical Teaching" />
          <Badge icon={<BookOpen className="w-4 h-4" />} label="OPD Cases" />
          <Badge icon={<Award className="w-4 h-4" />} label="Evidence-based" />
        </div>
      </div>
    </div>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="hidden md:flex items-center gap-1.5 text-xs">
      {icon}
      {label}
    </div>
  );
}
