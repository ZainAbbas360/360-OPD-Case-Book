import { ALL_CASES, SPEC_META } from '../data';
import type { MedicalCase as LegacyCase } from '../data';
import type { MedicalCase } from './supabase';

function joinLines(items?: string[]) {
  return (items ?? []).join('\n');
}

function normalizeSpecialty(name: string) {
  const value = name.trim();
  if (value.toLowerCase() === 'paediatrics' || value.toLowerCase() === 'pediatrics') return 'Pediatrics';
  return value;
}

function mapLegacyCase(c: LegacyCase, index: number): MedicalCase {
  const rx = c.rx?.length
    ? `\n\nPRESCRIPTION:\n${c.rx.map((r) => `${r.drug}${r.brand ? ` (${r.brand})` : ''}: ${r.dose}${r.note ? ` — ${r.note}` : ''}`).join('\n')}`
    : '';

  return {
    id: c.id,
    title: c.title,
    specialty: normalizeSpecialty(SPEC_META[c.spec].name),
    patient_age: null,
    patient_gender: null,
    chief_complaint: c.tags?.join(', ') || null,
    excerpt: c.hook || '',
    history: joinLines(c.history),
    examination: joinLines(c.exam),
    investigations: joinLines(c.investigations),
    diagnosis: null,
    management: `${joinLines(c.management)}${rx}`.trim() || null,
    discussion: [
      c.redFlags?.length ? `RED FLAGS / URGENT REFERRAL:\n${joinLines(c.redFlags)}` : '',
      c.guideline ? `GUIDELINE SUMMARY:\n${c.guideline}` : '',
      c.advice ? `PATIENT ADVICE & FOLLOW-UP:\n${c.advice}` : '',
    ].filter(Boolean).join('\n\n') || null,
    image_url: null,
    is_published: true,
    is_free: index === 0,
    created_at: new Date(2026, 0, 1, 0, 0, index).toISOString(),
  };
}

export const FALLBACK_CASES: MedicalCase[] = ALL_CASES.map(mapLegacyCase);

export function mergeCases(databaseCases: MedicalCase[] = []): MedicalCase[] {
  const byTitle = new Map<string, MedicalCase>();
  for (const c of FALLBACK_CASES) byTitle.set(c.title.trim().toLowerCase(), c);
  for (const c of databaseCases) byTitle.set(c.title.trim().toLowerCase(), { ...c, specialty: normalizeSpecialty(c.specialty) });
  return Array.from(byTitle.values());
}

export function getFallbackCase(id: string): MedicalCase | null {
  return FALLBACK_CASES.find((c) => c.id === id) ?? null;
}
