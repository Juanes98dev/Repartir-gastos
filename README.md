# Cuentas del paseo — frontend

App en React (con Vite) para calcular, dados los aportes de cada persona en
un paseo, quién le tiene que pagar a quién y cuánto, con el mínimo número
de transacciones.

## Qué necesitas instalar

Solo necesitas **Node.js** (versión 18 o superior, que ya incluye `npm`).

- Verifica si ya lo tienes: `node -v`
- Si no lo tienes, descárgalo de https://nodejs.org (elige la versión LTS)

No necesitas instalar React aparte ni nada global: todas las dependencias
del proyecto (React, Vite) están declaradas en `package.json` y se instalan
en un solo paso.

## Cómo correrlo

Desde la carpeta del proyecto:

```bash
npm install     # instala las dependencias (una sola vez)
npm run dev     # levanta el servidor de desarrollo
```

Esto abre el proyecto en `http://localhost:5173`. Cada vez que guardes un
archivo, la página se recarga sola (hot reload).

## Estructura

```
src/
  main.jsx                     punto de entrada de React
  App.jsx                      estado de la app y orquestación
  App.css                      estilos
  components/
    ParticipantForm.jsx        formulario: nº de personas + aportes
    ResultsTable.jsx           balances y transacciones sugeridas
  utils/
    calculateSettlements.js    algoritmo puro (sin dependencias de UI)
  api.js                       cliente stub para el backend (aún sin usar)
```

## Cómo está pensado para conectarse al backend después

Ahora mismo `App.jsx` calcula todo en el navegador llamando a
`calculateSettlements()` (en `src/utils/`), que es una función pura: recibe
un arreglo de `{ name, amount }` y devuelve los balances y transacciones.

Cuando tengas tu backend con el endpoint `POST /api/settlements`, el cambio
es mínimo: en `src/App.jsx` reemplazas la llamada a `calculateSettlements`
por `fetchSettlements` (ya está el stub listo en `src/api.js`, solo falta
que exista el servidor). Así separas la lógica de cálculo de cómo se
obtiene el resultado (local vs. red), que es justo lo que querías practicar.

Puedes fijar la URL del backend con una variable de entorno, creando un
archivo `.env` en la raíz del proyecto:

```
VITE_API_URL=http://localhost:3001
```

## Algoritmo (resumen)

1. Se calcula el promedio de lo que debió aportar cada persona.
2. Cada persona queda con un balance: positivo si aportó de más (le deben),
   negativo si aportó de menos (debe).
3. Se empareja siempre al mayor deudor con el mayor acreedor hasta saldar
   ambos, lo que en la práctica reduce las transacciones frente a que cada
   quien le pague a cada quien.
