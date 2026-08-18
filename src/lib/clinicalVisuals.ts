export type ClinicalVisual = {
  image: string;
  caption: string;
  sourceLabel: string;
  sourceUrl: string;
};

export type VisualBrief = {
  label: string;
  headline: string;
  cues: string[];
};

/* External clinical images are intentionally disabled for now.
   Case pages use lightweight disease-specific icon heroes instead. */
export function visualForCase(_title: string): ClinicalVisual | null {
  return null;
}

export function visualBriefForCase(title: string): VisualBrief {
  return {
    label: 'Clinical Case',
    headline: title,
    cues: [],
  };
}
