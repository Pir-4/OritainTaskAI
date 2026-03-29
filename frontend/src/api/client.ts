import type { CreateSampleRequest, Sample } from "../types/sample";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export function getSamples(): Promise<Sample[]> {
  return request<Sample[]>("/samples/");
}

export function getSample(id: number): Promise<Sample> {
  return request<Sample>(`/samples/${id}`);
}

export function createSample(data: CreateSampleRequest): Promise<Sample> {
  return request<Sample>("/samples/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
