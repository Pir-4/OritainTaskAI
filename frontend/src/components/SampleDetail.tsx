import { useEffect, useState } from "react";
import { getSample } from "../api/client";
import type { Sample } from "../types/sample";

interface Props {
  id: number;
  onBack: () => void;
}

export function SampleDetail({ id, onBack }: Props) {
  const [sample, setSample] = useState<Sample | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSample(id)
      .then(setSample)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load")
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!sample) return null;

  return (
    <div className="sample-detail">
      <button onClick={onBack} data-testid="back-button">
        ← Back to list
      </button>
      <h2>Sample #{sample.id}</h2>
      <dl>
        <dt>Product Name</dt>
        <dd data-testid="detail-product-name">{sample.product_name}</dd>

        <dt>Claimed Origin</dt>
        <dd data-testid="detail-claimed-origin">{sample.claimed_origin}</dd>

        <dt>Status</dt>
        <dd>
          <span
            className={`status-badge status-${sample.status}`}
            data-testid="sample-status"
          >
            {sample.status}
          </span>
        </dd>

        <dt>Sample Data</dt>
        <dd>
          <dl>
            <dt>Isotope Ratio O18</dt>
            <dd data-testid="detail-isotope-o18">
              {sample.sample_data.isotope_ratio_o18}
            </dd>
            <dt>Isotope Ratio C13</dt>
            <dd data-testid="detail-isotope-c13">
              {sample.sample_data.isotope_ratio_c13}
            </dd>
            <dt>Trace Element Sr</dt>
            <dd data-testid="detail-trace-sr">
              {sample.sample_data.trace_element_sr}
            </dd>
          </dl>
        </dd>

        <dt>Created At</dt>
        <dd>{new Date(sample.created_at).toLocaleString()}</dd>
      </dl>
    </div>
  );
}
