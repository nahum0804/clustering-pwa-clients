import { useState, useEffect } from "react";
import api from "../services/api"; // instancia axios con baseURL = "http://localhost:8000/api"

function EstadoEntrega() {
  /* ---------------- Estados ---------------- */
  const [query, setQuery] = useState("");
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);

  const [clienteSel, setClienteSel] = useState(null);
  const [envios, setEnvios] = useState([]);
  const [loadingEnvios, setLoadingEnvios] = useState(false);
  const [error, setError] = useState(null);

  /* ---------------- Buscar clientes ---------------- */
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response= await api.get("/clientes/");
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Clientes cargados:', data);
        setClientes(data);
      } catch (err) {
        console.error('Error al obtener clientes:', err);
        setError('No se pudieron cargar los clientes');
      }
    };

    fetchClientes();
  }, []);

  /* ---------------- Seleccionar cliente ---------------- */
  const obtenerEnvios = async (cliente) => {
    setClienteSel(cliente);
    setEnvios([]);
    setError(null);
    if (!cliente) return;

    setLoadingEnvios(true);
    try {
      const { data } = await api.get("/historial_envios/", {
        params: { cliente: cliente.id_cliente }, // ?cliente=<uuid>
      });
      setEnvios(data);
    } catch (e) {
      console.error(e);
      setError("Error al obtener los envíos");
    } finally {
      setLoadingEnvios(false);
    }
  };

  /* ---------------- Render ---------------- */
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-6 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-xl">
        <h2 className="text-xl font-bold text-blue-700 mb-4">
          Consultar estado de envíos
        </h2>

        {/* ---- Buscador ---- */}
        <input
          type="text"
          placeholder="Buscar cliente por nombre o cédula"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        {/* ---- Lista de clientes ---- */}
        {loadingClientes && (
          <p className="text-sm text-gray-500 mb-2">Buscando clientes…</p>
        )}

        {clientes.length > 0 && (
          <ul className="max-h-40 overflow-y-auto border rounded mb-4">
            {clientes.map((c) => (
              <li
                key={c.id_cliente}
                className="px-3 py-2 cursor-pointer hover:bg-blue-50"
                onClick={() => obtenerEnvios(c)}
              >
                {c.nombre_completo} – {c.cedula}
              </li>
            ))}
          </ul>
        )}

        {/* ---- Cliente seleccionado ---- */}
        {clienteSel && (
          <div className="mb-4">
            <p className="font-semibold">
              Cliente:{" "}
              <span className="text-blue-700">
                {clienteSel.nombre_completo} – {clienteSel.cedula}
              </span>
            </p>
          </div>
        )}

        {/* ---- Tabla de envíos ---- */}
        {loadingEnvios && (
          <p className="text-sm text-gray-500">Cargando envíos…</p>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        {envios.length > 0 && !loadingEnvios && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Envíos del cliente</h3>
            <table className="w-full text-sm border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-2 py-1">ID</th>
                  <th className="border px-2 py-1">Fecha</th>
                  <th className="border px-2 py-1">Estado</th>
                  <th className="border px-2 py-1">Costo (₡)</th>
                </tr>
              </thead>
              <tbody>
                {envios.map((e) => (
                  <tr key={e.id_envio}>
                    <td className="border px-2 py-1">{e.id_envio}</td>
                    <td className="border px-2 py-1">
                      {new Date(e.fecha_envio).toLocaleDateString()}
                    </td>
                    <td className="border px-2 py-1">{e.estado}</td>
                    <td className="border px-2 py-1 text-right">
                      {Number(e.costo_envio).toLocaleString("es-CR", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ---- Reiniciar ---- */}
        {clienteSel && (
          <button
            className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            onClick={() => {
              setClienteSel(null);
              setEnvios([]);
              setQuery("");
            }}
          >
            Nueva consulta
          </button>
        )}
      </div>
    </div>
  );
}

export default EstadoEntrega;
