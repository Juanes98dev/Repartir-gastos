const money = (value) =>
  value.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function ResultsTable({ result }) {
  if (!result) return null;

  const { total, average, balances, transactions } = result;

  return (
    <div className="ledger-card ledger-card--results">
      <div className="summary">
        <div>
          <span className="summary__label">Total gastado</span>
          <span className="summary__value">${money(total)}</span>
        </div>
        <div>
          <span className="summary__label">Por persona</span>
          <span className="summary__value">${money(average)}</span>
        </div>
      </div>

      <table className="balances">
        <tbody>
          {balances.map((b) => (
            <tr key={b.name}>
              <td>{b.name || "—"}</td>
              <td className={b.balance >= 0 ? "positive" : "negative"}>
                {b.balance >= 0 ? "+" : ""}
                {money(b.balance)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="transactions-title">Cómo saldar cuentas</h2>

      {transactions.length === 0 ? (
        <p className="empty">Todos aportaron lo mismo, no hay nada que saldar.</p>
      ) : (
        <ol className="transactions">
          {transactions.map((t, i) => (
            <li key={i}>
              <span className="transactions__from">{t.from}</span>
              <span className="transactions__arrow">→</span>
              <span className="transactions__to">{t.to}</span>
              <span className="transactions__amount">${money(t.amount)}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
