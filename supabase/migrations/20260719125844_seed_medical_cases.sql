/*
# Seed medical cases

Adds a unique constraint on (title, specialty) to make seeding idempotent,
then populates the `cases` table with teaching cases across specialties.
*/

ALTER TABLE public.cases
  ADD CONSTRAINT cases_title_specialty_key UNIQUE (title, specialty);

INSERT INTO public.cases
  (title, specialty, patient_age, patient_gender, chief_complaint, excerpt,
   history, examination, investigations, diagnosis, management, discussion, image_url)
VALUES
(
  'Acute ST-Elevation Myocardial Infarction',
  'Cardiology', 58, 'male',
  'Crushing central chest pain for 2 hours',
  'A middle-aged man presents with sudden severe crushing chest pain radiating to the left arm, diaphoresis, and breathlessness. An ECG is urgently required.',
  '58-year-old male smoker (30 pack-years), hypertensive, with a family history of ischaemic heart disease. Woke at 6am with crushing central chest pain radiating to the left arm and jaw, associated with sweating, nausea, and dyspnoea. No relief from antacids. Pain score 9/10.',
  'Anxious, diaphoretic, clutching chest. Pulse 110/min, BP 150/95 mmHg, SpO2 95% on room air. JVP not raised. Heart sounds dual, no murmurs. Lungs clear. No peripheral oedema.',
  'ECG: ST elevation in leads II, III, aVF (inferior STEMI). Troponin I 12.4 ng/mL (raised). Creatinine 95 µmol/L. K 4.1 mmol/L. Glucose 7.2 mmol/L. Total cholesterol 6.8 mmol/L, LDL 4.9 mmol/L.',
  'Acute inferior ST-elevation myocardial infarction (STEMI) due to right coronary artery occlusion.',
  'Immediate: oxygen, aspirin 300mg chewed, ticagrelor 180mg, atorvastatin 80mg, morphine for pain, nitrates. Primary PCI within 120 minutes (gold standard). Post-PCI: dual antiplatelet therapy, beta-blocker, ACE inhibitor, statin, cardiac rehabilitation.',
  'Time is muscle — door-to-balloon time should be under 90 minutes. Inferior STEMIs may have right ventricular involvement; avoid nitrates if RV infarct suspected. Lifestyle modification and adherence to secondary prevention medication is critical.',
  'https://images.pexels.com/photos/4226119/pexels-photo-4226119.jpeg?auto=compress&cs=tinysrgb&w=1200'
),
(
  'Acute Ischaemic Stroke',
  'Neurology', 72, 'female',
  'Sudden right-sided weakness and slurred speech',
  'An elderly woman is brought to the ER within 1 hour of sudden right-sided weakness and slurred speech. Thrombolysis window is critical.',
  '72-year-old female, atrial fibrillation on no anticoagulation. Found by family at 8am with right-sided weakness, facial droop, and slurred speech. Last seen well 7am. No seizures, no head trauma. Hypertensive for 10 years.',
  'GCS 14 (E4V4M6). Right hemiparesis (power 2/5 arm, 3/5 leg), right facial droop, dysarthria, NIHSS 12. BP 175/100. AF on auscultation. No papilloedema.',
  'CT brain: no haemorrhage, early ischaemic changes in left MCA territory. INR 1.0. Glucose 6.5 mmol/L. ECG: atrial fibrillation. Echo pending.',
  'Acute ischaemic stroke in left middle cerebral artery territory, cardioembolic from atrial fibrillation.',
  'Within 4.5 hours of onset: IV alteplase 0.9 mg/kg (max 90mg), 10% bolus over 1 min, remainder over 60 min. Admit to stroke unit, BP target <185/110 during and <180/105 after thrombolysis for 24h. Start aspirin 300mg at 24h post-thrombolysis if no bleed. Long-term: oral anticoagulation (DOAC) for AF after 14 days.',
  'FAST recognition and time-to-needle matters. Alteplase within the window reduces disability. Exclusions include recent surgery, active bleeding, and INR elevation. Mechanical thrombectomy for large vessel occlusion up to 6-24h.',
  'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=1200'
),
(
  'Acute Appendicitis',
  'General Surgery', 24, 'male',
  'Right lower quadrant abdominal pain for 18 hours',
  'A young man with migrating abdominal pain localising to the right lower quadrant, anorexia, and low-grade fever — classic for appendicitis.',
  '24-year-old male, previously well. Pain started periumbilical 18h ago, now localised to right iliac fossa. Anorexia, one episode of vomiting, low-grade fever. No dysuria. Last meal 20h ago.',
  'T 37.9°C, HR 98, BP 120/78. Tender in right iliac fossa with guarding, Rovsing''s sign positive, psoas sign positive. No rebound initially. Bowel sounds reduced.',
  'WCC 14.2 x10^9/L (neutrophilia). CRP 48 mg/L. Urine normal. USS appendix: non-compressible appendix 9mm, no perforation.',
  'Acute uncomplicated appendicitis.',
  'NBM, IV fluids, analgesia, IV antibiotics (cefuroxime + metronidazole). Laparoscopic appendicectomy. Histopathology to exclude tumour.',
  'Migrating pain is the most specific symptom. Alvarado score >=7 supports diagnosis. Laparoscopic approach reduces wound infection and adhesions. Perforated appendicitis may be managed conservatively with antibiotics in selected patients.',
  'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=1200'
),
(
  'Community-Acquired Pneumonia',
  'Pulmonology', 45, 'female',
  'Fever, productive cough, and breathlessness for 3 days',
  'A previously healthy woman with productive cough, fever, pleuritic chest pain, and breathlessness. CURB-65 guides management.',
  '45-year-old female smoker (15 pack-years). 3 days of productive yellow sputum, fever 38.8°C, right-sided pleuritic chest pain, breathlessness on exertion. No hospital admissions. No antibiotic use in last 3 months.',
  'T 38.8°C, RR 24, SpO2 92% room air, BP 110/70. Right lower zone crackles and bronchial breathing. No cyanosis. CURB-65 = 1 (respiratory rate).',
  'CXR: right lower lobe consolidation. WCC 16.5 x10^9/L. CRP 180 mg/L. Sputum Gram stain: Gram-positive diplococci. Blood cultures pending. U&E normal.',
  'Community-acquired pneumonia, severe (CURB-65 = 1 but hypoxic).',
  'Admit for IV antibiotics: amoxicillin/clavulanate + clarithromycin. Oxygen to keep SpO2 >=94%. IV fluids. Reassess at 48h. Switch to oral when afebrile and improving. Discharge with safety-net advice.',
  'CURB-65 stratifies severity and site of care. Streptococcus pneumoniae is the commonest pathogen. Review at 6 weeks with repeat CXR to exclude underlying malignancy in smokers.',
  'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=1200'
),
(
  'Diabetic Ketoacidosis',
  'Endocrinology', 19, 'female',
  'Vomiting, abdominal pain, and drowsiness',
  'A young woman with type 1 diabetes, vomiting, abdominal pain, and drowsiness. Ketonuria and acidosis confirm DKA.',
  '19-year-old female with type 1 diabetes (diagnosed age 11). Stopped insulin 2 days ago due to vomiting. Now polyuria, polydipsia, abdominal pain, and drowsiness. No fever.',
  'Drowsy, GCS 14. Dehydrated, dry mucous membranes. Kussmaul breathing. T 36.8°C, HR 122, BP 100/60. Breath fruity (ketotic). Abdomen soft.',
  'Glucose 28 mmol/L. Ketones 6.2 mmol/L. Venous pH 7.18, HCO3 12, BE -14. K 5.6 mmol/L. Na 132. Urea 9.2. WCC 11. Urine ketones 4+. ECG sinus tachycardia.',
  'Diabetic ketoacidosis (DKA) — severe, insulin omission.',
  'Fixed-rate IV insulin 0.1 U/kg/h. IV fluids: 0.9% NaCl 1L stat, then 1L over 2h, then over 4h. Replace potassium once <5.5. Continue insulin until ketones <0.6 and pH >7.3, then switch to sliding scale + long-acting insulin. Monitor glucose hourly, K 2h. Treat trigger (infection/omission).',
  'DKA is a medical emergency. Fluid resuscitation precedes insulin. Cerebral oedema is the feared complication in young — avoid overly rapid correction. Education on sick-day rules and never stopping insulin prevents recurrence.',
  'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=1200'
),
(
  'Acute Pyelonephritis',
  'Nephrology', 33, 'female',
  'Right flank pain, fever, and dysuria',
  'A young woman with right flank pain, high fever, rigors, and dysuria — upper urinary tract infection.',
  '33-year-old female, 14 weeks pregnant. 2 days of right flank pain, fever 39.2°C, rigors, dysuria, and frequency. No previous UTIs. No allergies.',
  'T 39.2°C, HR 105, BP 105/65. Right renal angle tenderness. No suprapubic tenderness. No peritoneal signs. Mild dehydration.',
  'WCC 15.8. CRP 110. Urine: nitrites+, leucocytes++, culture pending (likely E. coli). U&E: creatinine 78 µmol/L. USS: right hydronephrosis, no stones.',
  'Acute pyelonephritis in pregnancy.',
  'Admit, IV fluids, IV co-amoxiclav (safe in pregnancy) after culture. Paracetamol. Monitor temperature and fetal wellbeing. Switch to oral when afebrile 48h, total 10-14 days. Send MSU culture at 2 weeks post-treatment.',
  'Pyelonephritis in pregnancy risks preterm labour and sepsis. Always admit for IV antibiotics. Avoid nitrofurantoin in third trimester and trimethoprim in first trimester. Recurrent UTIs in pregnancy need low-dose prophylaxis.',
  'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=1200'
),
(
  'Bronchiolitis in Infancy',
  'Pediatrics', 0, 'male',
  'Wheeze and breathing difficulty in a 4-month-old',
  'A 4-month-old infant with coryza, wheeze, and increased work of breathing. RSV bronchiolitis is the commonest cause.',
  '4-month-old male, ex-preterm (34 weeks). 3 days of coryza, now wheezy, poor feeding, and increased work of breathing. No fever. No apnoea. Immunised.',
  'T 37.0°C, RR 60, SpO2 89% room air. Subcostal and intercostal recession. Bilateral wheeze and fine crackles. Audible grunt. Cap refill 2s.',
  'Nasopharyngeal aspirate: RSV positive. CXR: hyperinflation, bilateral perihilar infiltrates. Capillary gas: pH 7.32, pCO2 6.1. Normal electrolytes.',
  'Acute viral bronchiolitis (RSV) with moderate respiratory distress.',
  'Supportive: supplemental oxygen to keep SpO2 >=92%, nasogastric feeding if poor feeding, hypertonic saline nebs may help. Avoid routine bronchodilators, steroids, and antibiotics. Monitor for apnoea in ex-preterm infants.',
  'Bronchiolitis is clinical — CXR and bloods rarely alter management. NICE recommends oxygen and hydration only. High-risk infants (preterm, congenital heart disease) may benefit from palivizumab prophylaxis.',
  'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=1200'
),
(
  'Falciparum Malaria',
  'Infectious Disease', 29, 'male',
  'High fever, chills, and rigors 10 days after returning from Africa',
  'A returning traveller with cyclical high fevers, rigors, and thrombocytopenia. Falciparum malaria is a medical emergency.',
  '29-year-old male, returned from Nigeria 10 days ago. Did not take chemoprophylaxis. 3 days of cyclical fever (every 48h), rigors, headache, myalgia, and one episode of vomiting. No bleeding, no confusion.',
  'T 39.8°C, HR 110, BP 115/70. Jaundice. No rash. No neck stiffness. No organomegaly. Cap refill 2s.',
  'Thick and thin film: Plasmodium falciparum, parasitaemia 2.4%. Hb 11.2, platelets 70 x10^9/L. Bilirubin 45 µmol/L. Creatinine 132 µmol/L. G6PD normal. Glucose 5.4.',
  'Uncomplicated falciparum malaria.',
  'Artemether-lumefantrine (Riamet) oral 6 tabs over 5 doses. If vomiting or parasitaemia >2%: IV artesunate. Monitor parasitaemia daily until negative. Check G6PD before primaquine (not needed for falciparum).',
  'Falciparum is the deadliest species. IV artesunate is first-line for severe disease (reduces mortality vs quinine). Thick film for diagnosis, thin film for species and parasitaemia. Always ask travel history in febrile returning travellers.',
  'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=1200'
)
ON CONFLICT (title, specialty) DO NOTHING;
