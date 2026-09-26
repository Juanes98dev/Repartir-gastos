export default function ParticipantForm({
  numPeople,
  onNumPeopleChange,
  participants,
  onParticipantChange,
  onSubmit,
}) {
  return (
    <form className="ledger-card" onSubmit={onSubmit}>
      <label className="field field--inline">
        <span>Personas en el paseo</span>
        <input
          type="number"
          min={2}
          max={20}
          value={numPeople}
          onChange={(e) => onNumPeopleChange(Number(e.target.value))}
        />
      </label>

      <div className="rows">
        {participants.map((p, index) => (
          <div className="row" key={index}>
            <span className="row__index">{index + 1}</span>
            <input
              className="row__name"
              type="text"
              placeholder={`Persona ${index + 1}`}
              value={p.name}
              onChange={(e) => onParticipantChange(index, "name", e.target.value)}
            />
            <input
              className="row__amount"
              type="number"
              min={0}
              step="0.01"
              placeholder="0"
              value={p.amount}
              onChange={(e) => onParticipantChange(index, "amount", e.target.value)}
            />
          </div>
        ))}
      </div>

      <button type="submit" className="btn">
        Calcular quién le paga a quién
      </button>
    </form>
  );
}
