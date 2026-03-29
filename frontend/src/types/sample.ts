export type SampleStatus = "verified" | "failed" | "inconclusive";

export interface SampleData {
  isotope_ratio_o18: number;
  isotope_ratio_c13: number;
  trace_element_sr: number;
}

export interface Sample {
  id: number;
  product_name: string;
  claimed_origin: string;
  sample_data: SampleData;
  status: SampleStatus;
  created_at: string;
}

export interface CreateSampleRequest {
  product_name: string;
  claimed_origin: string;
  sample_data: SampleData;
}
