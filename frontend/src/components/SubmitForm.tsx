import { useState } from "react";
import { createSample } from "../api/client";
import type { Sample } from "../types/sample";

interface Props {
  onSuccess: (sample: Sample) => void;
}

export function SubmitForm({ onSuccess }: Props) {
  const [species, setSpecies] = useState("");
  const [originCountry, setOriginCountry] = useState("");
  const [collectedAt, setCollectedAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const sample = await createSample({
        species,
        origin_country: originCountry,
        collected_at: collectedAt || undefined,
      });
      onSuccess(sample);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="submit-form">
      <h2>Submit Sample</h2>

      <div className="form-group">
        <label htmlFor="species">Species</label>
        <input
          id="species"
          type="text"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          required
          data-testid="input-species"
        />
      </div>

      <div className="form-group">
        <label htmlFor="origin-country">Origin Country</label>
        <input
          id="origin-country"
          type="text"
          value={originCountry}
          onChange={(e) => setOriginCountry(e.target.value)}
          required
          data-testid="input-origin-country"
        />
      </div>

      <div className="form-group">
        <label htmlFor="collected-at">Collected At (optional)</label>
        <input
          id="collected-at"
          type="datetime-local"
          value={collectedAt}
          onChange={(e) => setCollectedAt(e.target.value)}
          data-testid="input-collected-at"
        />
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading} data-testid="submit-button">
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
