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
        <dt>Species</dt>
        <dd data-testid="detail-species">{sample.species}</dd>

        <dt>Origin Country</dt>
        <dd data-testid="detail-origin-country">{sample.origin_country}</dd>

        <dt>Collected At</dt>
        <dd data-testid="detail-collected-at">
          {sample.collected_at
            ? new Date(sample.collected_at).toLocaleString()
            : "—"}
        </dd>

        <dt>Status</dt>
        <dd>
          <span
            className={`status-badge status-${sample.status}`}
            data-testid="sample-status"
          >
            {sample.status}
          </span>
        </dd>

        <dt>Created At</dt>
        <dd>{new Date(sample.created_at).toLocaleString()}</dd>
      </dl>
    </div>
  );
}
