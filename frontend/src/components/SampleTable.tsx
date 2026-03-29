import { useEffect, useState } from "react";
import { getSamples } from "../api/client";
import type { Sample } from "../types/sample";

interface Props {
  onSelect: (id: number) => void;
}

export function SampleTable({ onSelect }: Props) {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSamples()
      .then(setSamples)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>Samples</h2>
      {samples.length === 0 ? (
        <p>No samples yet.</p>
      ) : (
        <table data-testid="samples-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Claimed Origin</th>
              <th>Status</th>
              <th>Created At</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {samples.map((s) => (
              <tr key={s.id} data-testid="sample-row">
                <td>{s.id}</td>
                <td>{s.product_name}</td>
                <td>{s.claimed_origin}</td>
                <td>
                  <span
                    className={`status-badge status-${s.status}`}
                    data-testid="sample-status"
                  >
                    {s.status}
                  </span>
                </td>
                <td>{new Date(s.created_at).toLocaleString()}</td>
                <td>
                  <button onClick={() => onSelect(s.id)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
