const BASE = "http://localhost:8000";

export interface SampleData {
  isotope_ratio_o18: number;
  isotope_ratio_c13: number;
  trace_element_sr: number;
}

export interface SamplePayload {
  product_name: string;
  claimed_origin: string;
  sample_data: SampleData;
}

export interface SampleResponse {
  id: number;
  product_name: string;
  claimed_origin: string;
  sample_data: SampleData;
  status: string;
  created_at: string;
}

export async function createSample(
  data: SamplePayload
): Promise<SampleResponse> {
  const res = await fetch(`${BASE}/samples/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`createSample failed: ${res.status}`);
  return res.json();
}

export function randomSampleData(): SampleData {
  return {
    isotope_ratio_o18: parseFloat((Math.random() * 10 - 5).toFixed(3)),
    isotope_ratio_c13: parseFloat((Math.random() * 10 - 30).toFixed(3)),
    trace_element_sr: parseFloat((Math.random() * 0.5 + 0.5).toFixed(4)),
  };
}
