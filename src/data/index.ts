import type { MedicalCase } from './types';
import { MEDICINE_CASES } from './medicine';
import { SURGERY_CASES } from './surgery';
import { PAEDS_CASES } from './peds';
import { GYNAE_CASES } from './gynae';

export const ALL_CASES: MedicalCase[] = [
  ...MEDICINE_CASES,
  ...SURGERY_CASES,
  ...PAEDS_CASES,
  ...GYNAE_CASES,
];

export function getCaseById(id: string): MedicalCase | undefined {
  return ALL_CASES.find((c) => c.id === id);
}

export { MEDICINE_CASES, SURGERY_CASES, PAEDS_CASES, GYNAE_CASES };
export * from './types';
