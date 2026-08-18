export type ClinicalVisual = {
  image: string;
  caption: string;
  sourceLabel: string;
  sourceUrl: string;
};

const commons = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}`;
const commonsPage = (file: string) => `https://commons.wikimedia.org/wiki/File:${file.replace(/ /g, '_')}`;

const visuals: Record<string, ClinicalVisual> = {
  'Pneumonia / Acute Respiratory Infection': {
    image: commons('Pneumonia x ray.jpg'),
    caption: 'Chest radiograph showing focal right upper-lobe air-space opacity consistent with pneumonia. Look for lobar consolidation, air bronchograms and complications such as effusion.',
    sourceLabel: 'CDC / Wikimedia Commons — public domain',
    sourceUrl: commonsPage('Pneumonia x ray.jpg'),
  },
  'Vitamin D Deficiency Rickets': {
    image: commons('RicketsXray.jpg'),
    caption: 'Wrist radiograph demonstrating classic rachitic metaphyseal changes, especially cupping and widening. Correlate with clinical wrist widening and nutritional history.',
    sourceLabel: 'Radiopaedia contributor via Wikimedia Commons — CC BY-SA',
    sourceUrl: commonsPage('RicketsXray.jpg'),
  },
  'Polycystic Ovary Syndrome (PCOS)': {
    image: commons('PCOS.jpg'),
    caption: 'Transvaginal ultrasound appearance of a polyfollicular ovary. Ultrasound can support the diagnosis, but PCOS remains a clinical-biochemical diagnosis and morphology alone is not sufficient.',
    sourceLabel: 'Wikimedia Commons — reusable medical image',
    sourceUrl: commonsPage('PCOS.jpg'),
  },
  'Acute Appendicitis': {
    image: commons('CT scan of the abdomen showing acute appendicitis.jpg'),
    caption: 'Axial CT demonstrating an enlarged inflamed appendix. Key CT features include diameter >6 mm, wall thickening/enhancement and periappendiceal fat stranding.',
    sourceLabel: 'Wikimedia Commons — CC BY-SA',
    sourceUrl: commonsPage('CT scan of the abdomen showing acute appendicitis.jpg'),
  },
  'Renal Colic (Urolithiasis)': {
    image: commons('KidneyStone.JPG'),
    caption: 'Non-contrast CT showing a proximal ureteric calculus with upstream obstruction/hydronephrosis. Non-contrast CT is the most sensitive imaging test in many adult renal-colic pathways.',
    sourceLabel: 'James Heilman, MD / Wikimedia Commons — CC',
    sourceUrl: commonsPage('KidneyStone.JPG'),
  },
  'Measles': {
    image: commons('Photo of childhood rash obtained from measles.jpg'),
    caption: 'Typical measles exanthem: a confluent erythematous maculopapular rash appearing after the prodrome and spreading from the face/head downward.',
    sourceLabel: 'CDC / Wikimedia Commons — public domain',
    sourceUrl: commonsPage('Photo of childhood rash obtained from measles.jpg'),
  },
  'Uterine Fibroids': {
    image: commons('9cmFibroidUS.png'),
    caption: 'Ultrasound example of a uterine leiomyoma. Assess number, size and location (submucosal, intramural, subserosal) because these influence bleeding, fertility symptoms and management.',
    sourceLabel: 'Wikimedia Commons — ultrasound teaching image',
    sourceUrl: commonsPage('9cmFibroidUS.png'),
  },
  'Thyroid Nodule': {
    image: commons('Thyroid ultrasound 110321165224 1701260.jpg'),
    caption: 'Ultrasound image of a thyroid nodule. Risk assessment should describe composition, echogenicity, margins, shape and echogenic foci rather than relying on size alone.',
    sourceLabel: 'Nevit Dilmen / Wikimedia Commons — CC BY-SA',
    sourceUrl: commonsPage('Thyroid ultrasound 110321165224 1701260.jpg'),
  },
  'Diabetic Foot Ulcer': {
    image: commons('Diabetic foot ulceration.jpg'),
    caption: 'Clinical example of diabetic foot ulceration. Document site, size, depth, surrounding infection, perfusion and neuropathy; probe-to-bone where clinically appropriate.',
    sourceLabel: 'Milorad Dimic MD / Wikimedia Commons — CC BY-SA',
    sourceUrl: commonsPage('Diabetic foot ulceration.jpg'),
  },
  'Varicose Veins': {
    image: commons('Varicose veins.jpg'),
    caption: 'Illustration contrasting a normal venous valve with valvular incompetence and reflux in varicose veins. Use alongside standing examination and duplex assessment when indicated.',
    sourceLabel: 'NHLBI / Wikimedia Commons',
    sourceUrl: commonsPage('Varicose veins.jpg'),
  },
  'Inguinal Hernia': {
    image: commons('Inquinalhernia.png'),
    caption: 'CT example of an incarcerated inguinal hernia. Imaging is not required for an obvious uncomplicated hernia, but can help when diagnosis or complications are uncertain.',
    sourceLabel: 'James Heilman, MD / Wikimedia Commons — CC',
    sourceUrl: commonsPage('Inquinalhernia.png'),
  },
};

export function visualForCase(title: string): ClinicalVisual | null {
  return visuals[title] ?? null;
}
