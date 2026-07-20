import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  is_premium: boolean;
  is_admin: boolean;
  premium_since: string | null;
  created_at: string;
};

export type MedicalCase = {
  id: string;
  title: string;
  specialty: string;
  patient_age: number | null;
  patient_gender: string | null;
  chief_complaint: string | null;
  excerpt: string;
  history: string | null;
  examination: string | null;
  investigations: string | null;
  diagnosis: string | null;
  management: string | null;
  discussion: string | null;
  image_url: string | null;
  is_published: boolean;
  is_free: boolean;
  created_at: string;
};

export type PaymentRequest = {
  id: string;
  user_id: string;
  amount: number;
  method: string;
  reference: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  screenshot_path: string | null;
  created_at: string;
};
