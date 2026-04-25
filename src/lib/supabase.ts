/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// The prompt specifies NEXT_PUBLIC_SUPABASE_URL, but this is a Vite environment
// so we'll access the equivalent Vite variables if they exist, or fall back safely.
const getEnvVar = (viteKey: string, nextKey: string) => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env[viteKey]) return import.meta.env[viteKey];
  }
  if (typeof process !== 'undefined' && process.env) {
    if (process.env[nextKey]) return process.env[nextKey];
  }
  return '';
};

export const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY');

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key');
