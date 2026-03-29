interface NavProps {
  activeView: "list" | "submit" | "detail";
  onNavigate: (view: "list" | "submit") => void;
}

export function Nav({ activeView, onNavigate }: NavProps) {
  return (
    <nav className="nav" data-testid="nav">
      <span className="nav-brand">Origin Trace</span>
      <div className="nav-links">
        <button
          className={`nav-btn${activeView === "list" ? " active" : ""}`}
          onClick={() => onNavigate("list")}
          data-testid="nav-samples"
        >
          Samples
        </button>
        <button
          className={`nav-btn${activeView === "submit" ? " active" : ""}`}
          onClick={() => onNavigate("submit")}
          data-testid="nav-submit"
        >
          Submit Sample
        </button>
      </div>
    </nav>
  );
}
