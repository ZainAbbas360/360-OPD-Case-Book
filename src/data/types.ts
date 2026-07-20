export type Spec = 'medicine' | 'surgery' | 'peds' | 'gynae';

export type Rx = {
  drug: string;
  brand: string;
  dose: string;
  note: string;
};

export type MedicalCase = {
  id: string;
  spec: Spec;
  emoji: string;
  title: string;
  hook: string;
  tags: string[];
  history: string[];
  exam: string[];
  redFlags: string[];
  investigations: string[];
  guideline: string;
  management: string[];
  rx: Rx[];
  advice: string;
};

export const SPEC_META: Record<Spec, { name: string; color: string; tint: string }> = {
  medicine: { name: 'Medicine', color: '#0E7C86', tint: '#D2EFEF' },
  surgery: { name: 'Surgery', color: '#C1121F', tint: '#F9D9DA' },
  peds: { name: 'Paediatrics', color: '#E68A00', tint: '#FDE9C6' },
  gynae: { name: 'Gynae/Obs', color: '#8E2A82', tint: '#F0D2EC' },
};
