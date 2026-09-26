/**
 * Recibe una lista de participantes con lo que aportó cada uno y devuelve
 * el total, el promedio por persona, el balance de cada uno (a favor o en
 * contra) y la lista mínima de transacciones para saldar cuentas.
 *
 * Estrategia: se calcula el balance de cada persona respecto al promedio.
 * Quienes aportaron de más quedan "a favor" (acreedores), quienes aportaron
 * de menos quedan "en contra" (deudores). Luego se empareja siempre al
 * mayor deudor con el mayor acreedor, lo que en la práctica reduce el
 * número de transacciones frente a que cada persona le pague a cada otra.
 *
 * @param {{ name: string, amount: number }[]} participants
 * @returns {{
 *   total: number,
 *   average: number,
 *   balances: { name: string, balance: number }[],
 *   transactions: { from: string, to: string, amount: number }[]
 * }}
 */
export function calculateSettlements(participants) {
  const total = participants.reduce((sum, p) => sum + p.amount, 0);
  const average = total / participants.length;

  // Balance = lo que aportó - lo que le tocaba aportar.
  // Negativo => debe dinero. Positivo => le deben dinero.
  const balances = participants.map((p) => ({
    name: p.name,
    balance: round(p.amount - average),
  }));

  const debtors = balances
    .filter((b) => b.balance < -0.01)
    .map((b) => ({ ...b }))
    .sort((a, b) => a.balance - b.balance);

  const creditors = balances
    .filter((b) => b.balance > 0.01)
    .map((b) => ({ ...b }))
    .sort((a, b) => b.balance - a.balance);

  const transactions = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = round(Math.min(-debtor.balance, creditor.balance));

    if (amount > 0.01) {
      transactions.push({ from: debtor.name, to: creditor.name, amount });
    }

    debtor.balance = round(debtor.balance + amount);
    creditor.balance = round(creditor.balance - amount);

    if (Math.abs(debtor.balance) < 0.01) i++;
    if (Math.abs(creditor.balance) < 0.01) j++;
  }

  return { total: round(total), average: round(average), balances, transactions };
}

function round(value) {
  return Math.round(value * 100) / 100;
}
