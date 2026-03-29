const BASE = "http://localhost:8000";

export interface SamplePayload {
  species: string;
  origin_country: string;
  collected_at?: string;
}

export interface SampleResponse {
  id: number;
  species: string;
  origin_country: string;
  collected_at: string | null;
  status: string;
  created_at: string;
}

export async function createSample(
  data: SamplePayload
): Promise<SampleResponse> {
  const res = await fetch(`${BASE}/samples`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`createSample failed: ${res.status}`);
  return res.json();
}
