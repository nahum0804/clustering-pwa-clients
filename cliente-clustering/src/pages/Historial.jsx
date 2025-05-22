import { useEffect, useState } from "react";
import api from "../services/api";

function Historial() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const res = await api.get("/historial"); 
        const data = Array.isArray(res.data) ? res.data : res.data.historial;
        setHistorial(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("No se pudo cargar el historial." + (err.response ? `: ${err.response.data.message}` : ""));
        setHistorial([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 flex flex-col items-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Historial de Envíos</h2>

        {loading ? (
          <p className="text-center text-gray-500">Cargando historial...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : historial.length === 0 ? (
          <p className="text-center text-gray-500">No hay historial disponible.</p>
        ) : (
          <ul className="space-y-4">
            {historial.map((envio) => (
              <li key={envio.id} className="p-4 bg-gray-50 border rounded shadow-sm">
                <p><span className="font-semibold">Destino:</span> {envio.destino}</p>
                <p><span className="font-semibold">Dirección:</span> {envio.direccion}</p>
                <p><span className="font-semibold">Descripción:</span> {envio.descripcion}</p>
                <p><span className="font-semibold">Fecha:</span> {new Date(envio.fecha).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Historial;