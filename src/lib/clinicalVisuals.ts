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

const briefs: Record<string, VisualBrief> = {
  'Type 2 Diabetes Mellitus': { label: 'Diabetes visual checklist', headline: 'Think beyond glucose', cues: ['HbA1c trend', 'Foot + pulses', 'Retina + kidneys'] },
  'Essential Hypertension': { label: 'Hypertension visual checklist', headline: 'Confirm pressure, then assess organs', cues: ['Repeat BP correctly', 'ECG / LVH', 'Fundus + renal screen'] },
  'Enteric Fever (Typhoid)': { label: 'Fever pattern', headline: 'Prolonged fever in an endemic setting', cues: ['Blood culture first', 'Abdominal signs', 'Perforation warning'] },
  'Dengue Fever': { label: 'Dengue danger map', headline: 'The warning phase matters most', cues: ['Haematocrit trend', 'Platelet trend', 'Shock / bleeding signs'] },
  'GERD / Dyspepsia': { label: 'Upper GI pathway', headline: 'Treat simple reflux — investigate alarms', cues: ['Heartburn / reflux', 'H. pylori', 'Dysphagia / weight loss'] },
  'Bronchial Asthma / COPD Exacerbation': { label: 'Airway assessment', headline: 'Severity before prescription', cues: ['SpO₂ + RR', 'Peak flow', 'Silent chest = danger'] },
  'Iron Deficiency Anaemia': { label: 'Anaemia pattern', headline: 'Confirm deficiency, then find the cause', cues: ['Microcytosis', 'Low ferritin', 'Blood-loss source'] },
  'Hypothyroidism': { label: 'Thyroid profile', headline: 'Symptoms + TSH / FT4 pattern', cues: ['Bradycardia', 'Delayed reflexes', 'Raised TSH'] },
  'Migraine / Tension-Type Headache': { label: 'Headache screen', headline: 'Primary headache only after red flags are excluded', cues: ['Aura pattern', 'Neuro exam', 'Thunderclap / papilloedema'] },
  'Urinary Tract Infection (Adult)': { label: 'UTI pathway', headline: 'Lower UTI versus pyelonephritis', cues: ['Dysuria + frequency', 'Urinalysis', 'Fever / loin pain'] },
  'Acute Gastroenteritis (Diarrhoea)': { label: 'Hydration first', headline: 'Assess dehydration before medicines', cues: ['Oral intake', 'Capillary refill', 'Urine output'] },
  'Acute Otitis Media': { label: 'Otoscopy focus', headline: 'The tympanic membrane makes the diagnosis', cues: ['Bulging TM', 'Middle-ear effusion', 'Mastoid tenderness'] },
  'Acute Pharyngitis / Tonsillitis': { label: 'Throat examination', headline: 'Viral versus streptococcal pattern', cues: ['Tonsillar exudate', 'Nodes', 'No cough / fever'] },
  'Bronchiolitis': { label: 'Infant respiratory assessment', headline: 'Work of breathing guides severity', cues: ['Chest recession', 'Feeding', 'SpO₂'] },
  'Febrile Seizures': { label: 'Seizure classification', headline: 'Simple versus complex febrile seizure', cues: ['Duration', 'Focality', 'Recurrence <24 h'] },
  'Intestinal Worm Infestation': { label: 'Parasitic disease clues', headline: 'Treat, but also address reinfection', cues: ['Stool / worm history', 'Anaemia / nutrition', 'Hygiene + deworming'] },
  'Protein-Energy Malnutrition (SAM/MAM)': { label: 'Nutrition triage', headline: 'Anthropometry + oedema define severity', cues: ['MUAC', 'Weight-for-height', 'Bilateral oedema'] },
  'Abnormal Uterine Bleeding / Menorrhagia': { label: 'AUB framework', headline: 'Think PALM–COEIN', cues: ['Pregnancy test', 'CBC / ferritin', 'Structural cause'] },
  'Anaemia in Pregnancy': { label: 'Pregnancy anaemia', headline: 'Severity + gestation + cause', cues: ['Hb level', 'Ferritin', 'Maternal symptoms'] },
  'Dysmenorrhoea (Painful Periods)': { label: 'Pelvic pain screen', headline: 'Primary pain versus secondary pathology', cues: ['Cycle relation', 'Dyspareunia', 'Pelvic examination if indicated'] },
  'Menopause': { label: 'Menopause review', headline: 'Symptoms, risk profile and shared decisions', cues: ['Vasomotor symptoms', 'Bone health', 'HRT contraindications'] },
  'Pre-eclampsia': { label: 'Obstetric emergency screen', headline: 'Hypertension plus maternal or fetal risk', cues: ['BP ≥140/90', 'Proteinuria / organs', 'Fetal assessment'] },
  'Routine Antenatal Care Visit': { label: 'Antenatal checklist', headline: 'Every visit should answer: mother well, baby well?', cues: ['BP + urine', 'Growth + FHR', 'Vaccines / supplements'] },
  'Urinary Tract Infection in Pregnancy': { label: 'Pregnancy UTI', headline: 'Culture matters because complications matter', cues: ['Urine culture', 'Pregnancy-safe antibiotic', 'Pyelonephritis signs'] },
  'Vaginal Discharge / Vaginitis': { label: 'Discharge pattern', headline: 'History, pH and examination guide the cause', cues: ['Colour / odour', 'Pruritus', 'STI risk'] },
  'Anal Fissure': { label: 'Anorectal anatomy', headline: 'Painful defecation with a linear tear', cues: ['Posterior midline', 'Sentinel tag', 'Avoid traumatic DRE'] },
};

export function visualForCase(title: string): ClinicalVisual | null {
  return visuals[title] ?? null;
}

export function visualBriefForCase(title: string): VisualBrief {
  return briefs[title] ?? { label: 'Case-specific focus', headline: title, cues: ['Key presentation', 'Focused examination', 'Red flags + next step'] };
}
