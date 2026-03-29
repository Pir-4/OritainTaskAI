export type SampleStatus = "verified" | "failed" | "inconclusive";

export interface Sample {
  id: number;
  species: string;
  origin_country: string;
  collected_at: string | null;
  status: SampleStatus;
  created_at: string;
}

export interface CreateSampleRequest {
  species: string;
  origin_country: string;
  collected_at?: string;
}
