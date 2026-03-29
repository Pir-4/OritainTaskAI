import { useState } from "react";
import { createSample } from "../api/client";
import type { Sample } from "../types/sample";

interface Props {
  onSuccess: (sample: Sample) => void;
}

export function SubmitForm({ onSuccess }: Props) {
  const [productName, setProductName] = useState("");
  const [claimedOrigin, setClaimedOrigin] = useState("");
  const [isotopeO18, setIsotopeO18] = useState("");
  const [isotopeC13, setIsotopeC13] = useState("");
  const [traceSr, setTraceSr] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const sample = await createSample({
        product_name: productName,
        claimed_origin: claimedOrigin,
        sample_data: {
          isotope_ratio_o18: parseFloat(isotopeO18),
          isotope_ratio_c13: parseFloat(isotopeC13),
          trace_element_sr: parseFloat(traceSr),
        },
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
        <label htmlFor="product-name">Product Name</label>
        <input
          id="product-name"
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          data-testid="input-product-name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="claimed-origin">Claimed Origin</label>
        <input
          id="claimed-origin"
          type="text"
          value={claimedOrigin}
          onChange={(e) => setClaimedOrigin(e.target.value)}
          required
          data-testid="input-claimed-origin"
        />
      </div>

      <div className="form-group">
        <label htmlFor="isotope-o18">Isotope Ratio O18</label>
        <input
          id="isotope-o18"
          type="number"
          step="any"
          value={isotopeO18}
          onChange={(e) => setIsotopeO18(e.target.value)}
          required
          data-testid="input-isotope-o18"
        />
      </div>

      <div className="form-group">
        <label htmlFor="isotope-c13">Isotope Ratio C13</label>
        <input
          id="isotope-c13"
          type="number"
          step="any"
          value={isotopeC13}
          onChange={(e) => setIsotopeC13(e.target.value)}
          required
          data-testid="input-isotope-c13"
        />
      </div>

      <div className="form-group">
        <label htmlFor="trace-sr">Trace Element Sr</label>
        <input
          id="trace-sr"
          type="number"
          step="any"
          value={traceSr}
          onChange={(e) => setTraceSr(e.target.value)}
          required
          data-testid="input-trace-sr"
        />
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading} data-testid="submit-button">
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
