import { useEffect, useState } from "react";
import api from "../services/api";

function Historial() {
  const [historial, setHistorial] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesRes, historialRes] = await Promise.all([
          api.get("/clientes/"),
          api.get("/historial_envios/"),
        ]);

        setClientes(clientesRes.data || []);
        const data = Array.isArray(historialRes.data) ? historialRes.data : historialRes.data.results || [];
        setHistorial(data);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError(
          "No se pudo cargar los datos." +
            (err.response ? `: ${err.response.data.message}` : "")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const enviosFiltrados = clienteSeleccionado
    ? historial.filter((envio) => envio.cliente === clienteSeleccionado)
    : [];

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 flex flex-col items-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Historial de Envíos
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Cargando datos...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            {/* Dropdown de clientes */}
            <div className="mb-6">
              <label className="block mb-2 font-medium text-gray-700">
                Seleccionar Cliente:
              </label>
              <select
                value={clienteSeleccionado}
                onChange={(e) => setClienteSeleccionado(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2"
              >
                <option value="">-- Selecciona un cliente --</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id_cliente} value={cliente.id_cliente}>
                    {cliente.nombre_completo} ({cliente.cedula})
                  </option>
                ))}
              </select>
            </div>

            {/* Lista de envíos filtrados */}
            {clienteSeleccionado && enviosFiltrados.length === 0 ? (
              <p className="text-center text-gray-500">No hay envíos para este cliente.</p>
            ) : (
              <ul className="space-y-4">
                {enviosFiltrados.map((envio) => (
                  <li
                    key={envio.id_envio}
                    className="p-4 bg-gray-50 border rounded shadow-sm"
                  >
                    <p>
                      <span className="font-semibold">Cliente ID:</span> {envio.cliente}
                    </p>
                    <p>
                      <span className="font-semibold">Estado:</span> {envio.estado}
                    </p>
                    <p>
                      <span className="font-semibold">Costo del Envío:</span>{" "}
                      ₡{parseFloat(envio.costo_envio).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-semibold">Fecha:</span>{" "}
                      {new Date(envio.fecha_envio).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-semibold">Código QR:</span>{" "}
                      {envio.qr_codigo?.slice(0, 30)}...
                    </p>
                    <p>
                      <span className="font-semibold">IP Nodo:</span> {envio.ip_nodo}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Historial;
