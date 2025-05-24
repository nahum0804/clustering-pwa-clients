import { useState, useEffect } from "react";
import Select from "react-select";
import QRCodeDisplay from "../components/QRCodeDisplay";
import api from "../services/api";
import apiC from "../services/api_high";

function RegistrarEnvio() {
  const [clientes, setClientes] = useState([]);
  const [clienteSel, setClienteSel] = useState(null);

  const [form, setForm] = useState({
    destino: "",
    peso: "",
    costo_envio: "",
    estado: "pendiente",
    qr_codigo: "",
  });

  const [qrValue, setQrValue] = useState(null);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    const fetchClientes = async () => {
      setLoadingClientes(true);
      try {
        const res = await apiC.get("/clientes/");
        setClientes(res.data);
        
      } catch (err) {
        setError("Error al cargar clientes.");
      } finally {
        setLoadingClientes(false);
      }
    };

    fetchClientes();
  }, []);

  const clienteOptions = clientes.map((cliente) => ({
    value: cliente.id_cliente,
    label: `${cliente.cedula} - ${cliente.nombre_completo}`,
  }));

  const handleClienteChange = (selectedOption) => {
    const cliente = clientes.find((c) => c.id_cliente === selectedOption?.value) || null;
    setClienteSel(cliente);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clienteSel) {
      alert("Por favor selecciona un cliente.");
      return;
    }

    const { destino, peso, costo_envio, estado, qr_codigo } = form;

    if (!destino || !peso || !costo_envio || !estado || !qr_codigo) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const envioData = {
      cliente: clienteSel.id_cliente,
      destino,
      peso: parseFloat(peso),
      costo_envio: parseFloat(costo_envio),
      estado,
      qr_codigo,
    };

    try {
      const response = await apiC.post("/historial_envios/", envioData);
      setQrValue(JSON.stringify(response.data));
    } catch (err) {
      const msg = err?.response?.data?.detail || "Error al registrar envío.";
      alert(msg);
      console.error(err.response || err);
    }
  };

  const handleNuevoEnvio = () => {
    setQrValue(null);
    setClienteSel(null);
    setForm({
      destino: "",
      peso: "",
      costo_envio: "",
      estado: "pendiente",
      qr_codigo: "",
    });
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 flex flex-col items-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold text-blue-700 mb-4">
          {qrValue ? "Código Generado" : "Registrar Nuevo Envío"}
        </h2>

        {!qrValue ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selector Cliente */}
            <div>
              <label className="block mb-1 text-gray-700">Cliente</label>
              <Select
                options={clienteOptions}
                onChange={handleClienteChange}
                value={
                  clienteSel
                    ? {
                        value: clienteSel.id_cliente,
                        label: `${clienteSel.cedula} - ${clienteSel.nombre_completo}`,
                      }
                    : null
                }
                placeholder="Buscar cliente por cédula o nombre..."
                isSearchable
                noOptionsMessage={() => "No se encontraron clientes"}
                isLoading={loadingClientes}
              />
            </div>

            <input
              type="text"
              name="destino"
              placeholder="Destino"
              value={form.destino}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              type="number"
              step="0.01"
              name="peso"
              placeholder="Peso (kg)"
              value={form.peso}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              type="number"
              step="0.01"
              name="costo_envio"
              placeholder="Costo de envío"
              value={form.costo_envio}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              name="estado"
              placeholder="Estado del envío"
              value={form.estado}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              name="qr_codigo"
              placeholder="QR generado"
              value={form.qr_codigo}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Registrar Envío
            </button>
          </form>
        ) : (
          <>
            <p className="mb-2 text-gray-700 text-center mt-4">Código QR del envío:</p>
            <QRCodeDisplay value={qrValue} />
            <button
              onClick={handleNuevoEnvio}
              className="mt-4 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition w-full"
            >
              Registrar otro envío
            </button>
          </>
        )}

        {error && <p className="mt-2 text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default RegistrarEnvio;
