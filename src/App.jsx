import { useState } from "react";
import ParticipantForm from "./components/ParticipantForm.jsx";
import ResultsTable from "./components/ResultsTable.jsx";
import { calculateSettlements } from "./utils/calculateSettlements.js";
// Cuando conectes el backend, reemplaza calculateSettlements por fetchSettlements:
// import { fetchSettlements } from "./api.js";

function buildParticipants(count, previous) {
  return Array.from({ length: count }, (_, i) => previous[i] || { name: "", amount: "" });
}

export default function App() {
  const [numPeople, setNumPeople] = useState(4);
  const [participants, setParticipants] = useState(buildParticipants(4, []));
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleNumPeopleChange = (value) => {
    // 1. Permitimos que la casilla se quede vacía temporalmente para que puedan borrar
    if (value === "" || value === 0) {
      setNumPeople(""); // Guarda vacío en el estado para permitir borrar
      return;
    }

    // 2. Si escribe un número, solo limitamos el máximo (20) mientras escribe
    const safeValue = Math.min(Number(value), 20);
    
    setNumPeople(safeValue);
    setParticipants((prev) => buildParticipants(safeValue, prev));
  };

    const handleParticipantChange = (index, field, value) => {
      setParticipants((prev) =>
        prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
      );
    };

    const handleNumPeopleBlur = () => {
      // Al salir de la casilla, si quedó vacío, menor a 2 o mayor a 20, corregimos al rango correcto
      const finalValue = Math.min(Math.max(Number(numPeople) || 0, 2), 20);
      setNumPeople(finalValue);
      setParticipants((prev) => buildParticipants(finalValue, prev));
    };


  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const parsed = participants.map((p, i) => ({
      name: p.name.trim() || `Persona ${i + 1}`,
      amount: Number(p.amount) || 0,
    }));

    if (parsed.every((p) => p.amount === 0)) {
      setError("Ingresa al menos un valor mayor a cero.");
      setResult(null);
      return;
    }

    // Por ahora se calcula en el navegador. Más adelante esto se
    // convierte en: fetchSettlements(parsed).then(setResult)
    setResult(calculateSettlements(parsed));
  };

  return (
    <main className="page">
      <header className="page__header">
        <p className="page__eyebrow">registro de gastos</p>
        <h1>Cuentas del paseo</h1>
        <p className="page__subtitle">
           Aquí queda claro quién le paga a quién,
          con el menor número de transferencias posibles.
          pa que no salgan tumbados.
        </p>
      </header>

      <ParticipantForm
        numPeople={numPeople}
        onNumPeopleChange={handleNumPeopleChange}
        onNumPeopleBlur={handleNumPeopleBlur}
        participants={participants}
        onParticipantChange={handleParticipantChange}
        onSubmit={handleSubmit}
      />

      {error && <p className="error">{error}</p>}

      <ResultsTable result={result} />
    </main>
  );
}
