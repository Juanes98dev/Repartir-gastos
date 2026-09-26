// Cuando tengas el backend corriendo, este archivo es el único lugar
// que necesitas tocar para dejar de calcular en el navegador y empezar
// a pedirle el resultado a tu API.
//
// Ejemplo de endpoint esperado: POST /api/settlements
// body:     { "participants": [{ "name": "Ana", "amount": 120000 }, ...] }
// response: { "total": ..., "average": ..., "balances": [...], "transactions": [...] }

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function fetchSettlements(participants) {
  const response = await fetch(`${API_URL}/api/settlements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ participants }),
  });

  if (!response.ok) {
    throw new Error(`El backend respondió con error ${response.status}`);
  }

  return response.json();
}
