import { useState, useEffect } from "react";
import Select from "react-select";
import api from "../services/api";
import apiC from "../services/api_high";

function EstadoEntrega() {
  const [clientes, setClientes] = useState([]);
  const [clienteSel, setClienteSel] = useState(null);
  const [estadoSel, setEstadoSel] = useState(null);
  const [envios, setEnvios] = useState([]);
  const [todosEnvios, setTodosEnvios] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [loadingEnvios, setLoadingEnvios] = useState(false);
  const [error, setError] = useState(null);

  // Cargar clientes y todos los envíos inicialmente
  useEffect(() => {
    const fetchDatos = async () => {
      setLoadingClientes(true);
      setLoadingEnvios(true);
      try {
        const [clientesRes, enviosRes] = await Promise.all([
          apiC.get("/clientes"),
          apiC.get("/historial_envios/")
        ]);

        setClientes(clientesRes.data);
        setTodosEnvios(enviosRes.data); 
        setEnvios(enviosRes.data); 
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar clientes o envíos.");
      } finally {
        setLoadingClientes(false);
        setLoadingEnvios(false);
      }
    };

    fetchDatos();
  }, []);

  // Opciones de clientes
  const clienteOptions = clientes.map((cliente) => ({
    value: cliente.id_cliente,
    label: `${cliente.cedula} - ${cliente.nombre_completo}`,
  }));

  // Opciones de estados
  const estadoOptions = [
    { value: "pendiente", label: "Pendiente" },
    { value: "enviado", label: "Enviado" },
    { value: "entregado", label: "Entregado" },
  ];

  // Filtrar envíos según cliente y estado
  const filtrarEnvios = (cliente, estado) => {
    let filtrados = todosEnvios;

    if (cliente) {
      filtrados = filtrados.filter(
        (e) => e.cliente === cliente.id_cliente
      );
    }

    if (estado) {
      filtrados = filtrados.filter(
        (e) => e.estado?.toLowerCase().trim() === estado.value.toLowerCase().trim()
      );
    }

    setEnvios(filtrados);
  };

  // Handle cambio de cliente
  const handleClienteChange = (selectedOption) => {
    const cliente = clientes.find((c) => c.id_cliente === selectedOption?.value);
    setClienteSel(cliente);
    filtrarEnvios(cliente, estadoSel);
  };

  // Handle cambio de estado
  const handleEstadoChange = (selectedOption) => {
    setEstadoSel(selectedOption);
    filtrarEnvios(clienteSel, selectedOption);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-6 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-xl">
        <h2 className="text-xl font-bold text-blue-700 mb-4">
          Consultar estado de envíos
        </h2>

        {/* ---- Selector de cliente ---- */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Buscar Cliente</label>
          <Select
            options={clienteOptions}
            onChange={handleClienteChange}
            placeholder="Buscar por cédula o nombre..."
            isSearchable
            value={clienteSel ? { value: clienteSel.id_cliente, label: `${clienteSel.cedula} - ${clienteSel.nombre_completo}` } : null}
            noOptionsMessage={() => "No se encontraron clientes"}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        {/* ---- Selector de estado ---- */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Filtrar por estado</label>
          <Select
            options={estadoOptions}
            onChange={handleEstadoChange}
            placeholder="Selecciona un estado"
            isClearable
            value={estadoSel}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        {/* ---- Información del cliente seleccionado ---- */}
        {clienteSel && (
          <div className="mb-4 text-sm">
            <p className="font-semibold text-gray-700">
              Cliente seleccionado:{" "}
              <span className="text-blue-700">
                {clienteSel.nombre_completo} – {clienteSel.cedula}
              </span>
            </p>
          </div>
        )}

        {/* ---- Estado de carga o errores ---- */}
        {loadingEnvios && (
          <p className="text-sm text-gray-500">Cargando envíos…</p>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* ---- Tabla de envíos ---- */}
        {envios.length > 0 && !loadingEnvios && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Resultados</h3>
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
        {(clienteSel || estadoSel) && (
          <button
            className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            onClick={() => {
              setClienteSel(null);
              setEstadoSel(null);
              setEnvios(todosEnvios); // muestra todo si deseas
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
