import { createClient } from './supabase/client';

const BASE = process.env.NEXT_PUBLIC_API_URL!;

async function authHeaders(): Promise<HeadersInit> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) throw new Error('Not signed in');

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: await authHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: await authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PUT',
    headers: await authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

export interface Assessment {
  id: string;
  score: number;
  reasoning: string;
  matched_skills: string[];
  concerns: string[];
  jobs: {
    id: string;
    title: string;
    url: string;
    platform: string;
    work_type: string;
    budget_min: number | null;
    budget_max: number | null;
    currency: string;
    salary_is_estimate: boolean;
    client_country: string | null;
    posted_at: string | null;
  };
  alert: {
    status: string;
    proposal_draft: string | null;
    submission_instructions: string | null;
  } | null;
}