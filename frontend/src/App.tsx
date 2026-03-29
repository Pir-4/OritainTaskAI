import { useState } from "react";
import { Nav } from "./components/Nav";
import { SubmitForm } from "./components/SubmitForm";
import { SampleTable } from "./components/SampleTable";
import { SampleDetail } from "./components/SampleDetail";
import type { Sample } from "./types/sample";
import "./App.css";

type View =
  | { name: "list" }
  | { name: "submit" }
  | { name: "detail"; id: number };

function App() {
  const [view, setView] = useState<View>({ name: "list" });

  function handleNav(target: "list" | "submit") {
    setView(target === "list" ? { name: "list" } : { name: "submit" });
  }

  function handleSubmitSuccess(sample: Sample) {
    setView({ name: "detail", id: sample.id });
  }

  function handleSelectRow(id: number) {
    setView({ name: "detail", id });
  }

  function handleBack() {
    setView({ name: "list" });
  }

  return (
    <div className="app">
      <Nav activeView={view.name} onNavigate={handleNav} />
      <main className="main">
        {view.name === "list" && (
          <SampleTable onSelect={handleSelectRow} />
        )}
        {view.name === "submit" && (
          <SubmitForm onSuccess={handleSubmitSuccess} />
        )}
        {view.name === "detail" && (
          <SampleDetail key={view.id} id={view.id} onBack={handleBack} />
        )}
      </main>
    </div>
  );
}

export default App;
