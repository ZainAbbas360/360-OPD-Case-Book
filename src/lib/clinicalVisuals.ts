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

const commons = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}`;
const commonsPage = (file: string) => `https://commons.wikimedia.org/wiki/File:${file.replace(/ /g, '_')}`;

const visuals: Record<string, ClinicalVisual> = {
  'Pneumonia / Acute Respiratory Infection': { image: commons('Pneumonia x ray.jpg'), caption: 'Chest radiograph showing focal air-space opacity consistent with pneumonia. Look for lobar consolidation, air bronchograms and complications such as pleural effusion.', sourceLabel: 'CDC / Wikimedia Commons — public domain', sourceUrl: commonsPage('Pneumonia x ray.jpg') },
  'Vitamin D Deficiency Rickets': { image: commons('RicketsXray.jpg'), caption: 'Wrist radiograph demonstrating classic rachitic metaphyseal changes, especially cupping and widening.', sourceLabel: 'Wikimedia Commons — reusable teaching image', sourceUrl: commonsPage('RicketsXray.jpg') },
  'Polycystic Ovary Syndrome (PCOS)': { image: commons('PCOS.jpg'), caption: 'Ultrasound appearance of a polyfollicular ovary. Ovarian morphology can support, but does not by itself establish, the diagnosis of PCOS.', sourceLabel: 'Wikimedia Commons — reusable medical image', sourceUrl: commonsPage('PCOS.jpg') },
  'Acute Appendicitis': { image: commons('CT scan of the abdomen showing acute appendicitis.jpg'), caption: 'Axial CT demonstrating an enlarged inflamed appendix. Key CT features include enlargement, wall thickening or enhancement and periappendiceal fat stranding.', sourceLabel: 'Wikimedia Commons — CC BY-SA', sourceUrl: commonsPage('CT scan of the abdomen showing acute appendicitis.jpg') },
  'Renal Colic (Urolithiasis)': { image: commons('KidneyStone.JPG'), caption: 'Non-contrast CT showing a ureteric calculus with upstream obstruction. Look for the calculus, hydroureter or hydronephrosis and secondary inflammatory change.', sourceLabel: 'James Heilman, MD / Wikimedia Commons', sourceUrl: commonsPage('KidneyStone.JPG') },
  'Measles': { image: commons('Photo of childhood rash obtained from measles.jpg'), caption: 'Typical measles exanthem: a confluent erythematous maculopapular rash appearing after the prodrome and spreading from the face downward.', sourceLabel: 'CDC / Wikimedia Commons — public domain', sourceUrl: commonsPage('Photo of childhood rash obtained from measles.jpg') },
  'Uterine Fibroids': { image: commons('9cmFibroidUS.png'), caption: 'Ultrasound example of a uterine leiomyoma. Number, size and location influence symptoms and management.', sourceLabel: 'Wikimedia Commons — ultrasound teaching image', sourceUrl: commonsPage('9cmFibroidUS.png') },
  'Thyroid Nodule': { image: commons('Thyroid ultrasound 110321165224 1701260.jpg'), caption: 'Ultrasound image of a thyroid nodule. Describe composition, echogenicity, margins, shape and echogenic foci as part of risk stratification.', sourceLabel: 'Nevit Dilmen / Wikimedia Commons — CC BY-SA', sourceUrl: commonsPage('Thyroid ultrasound 110321165224 1701260.jpg') },
  'Diabetic Foot Ulcer': { image: commons('Diabetic foot ulceration.jpg'), caption: 'Clinical example of diabetic foot ulceration. Document site, size, depth, surrounding infection, perfusion and neuropathy.', sourceLabel: 'Wikimedia Commons — CC BY-SA', sourceUrl: commonsPage('Diabetic foot ulceration.jpg') },
  'Varicose Veins': { image: commons('Varicose veins.jpg'), caption: 'Illustration contrasting a normal venous valve with valvular incompetence and reflux in varicose veins.', sourceLabel: 'NHLBI / Wikimedia Commons', sourceUrl: commonsPage('Varicose veins.jpg') },
  'Inguinal Hernia': { image: commons('Inquinalhernia.png'), caption: 'CT example of an incarcerated inguinal hernia. Imaging is mainly useful when the diagnosis or complications are uncertain.', sourceLabel: 'James Heilman, MD / Wikimedia Commons', sourceUrl: commonsPage('Inquinalhernia.png') },
  'Breast Lump (Fibroadenoma / Ca Screening)': { image: commons('Breast US Fibroadenoma 0531092019656 Nevit.jpg'), caption: 'Breast ultrasound demonstrating a fibroadenoma. Typical benign features include an oval, circumscribed, wider-than-tall hypoechoic lesion.', sourceLabel: 'Nevit Dilmen / Wikimedia Commons — CC BY-SA 3.0', sourceUrl: commonsPage('Breast US Fibroadenoma 0531092019656 Nevit.jpg') },
  'Cellulitis': { image: commons('Cellulitis (of right leg).jpg'), caption: 'Clinical appearance of lower-limb cellulitis with diffuse erythema and swelling. Reassess spread, systemic features and signs of deeper infection.', sourceLabel: 'S.M. Samee / Wikimedia Commons — CC BY-SA 4.0', sourceUrl: commonsPage('Cellulitis (of right leg).jpg') },
  'Haemorrhoids (Piles)': { image: commons('Hemorrhoids.png'), caption: 'Illustration of haemorrhoidal disease showing the anatomic concept of internal and external disease.', sourceLabel: 'BruceBlaus / Wikimedia Commons — CC BY-SA 4.0', sourceUrl: commonsPage('Hemorrhoids.png') },
};

export function visualForCase(title: string): ClinicalVisual | null {
  return visuals[title] ?? null;
}

export function visualBriefForCase(title: string): VisualBrief {
  return {
    label: 'Clinical Case',
    headline: title,
    cues: [],
  };
}
