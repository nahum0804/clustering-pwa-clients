import { useState } from "react";
import QRCodeDisplay from "../components/QRCodeDisplay";
import api from "../services/api";

function RegistrarEnvio() {
  const [form, setForm] = useState({
    destino: "",
    direccion: "",
    descripcion: "",
  });
  const [qrValue, setQrValue] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const envioInfo = {
        ...form,
        id: Date.now(),
        fecha: new Date().toISOString(),
      };

      setQrValue(JSON.stringify(envioInfo));
    } catch (err) {
      alert("Error al registrar envío");
    }
  };

  const handleNuevoEnvio = () => {
    // Limpia el QR y los campos del formulario
    setQrValue(null);
    setForm({
      destino: "",
      direccion: "",
      descripcion: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 flex flex-col items-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold text-blue-700 mb-4">
          {qrValue ? "Código Generado" : "Registrar Nuevo Envío"}
        </h2>

        {!qrValue ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="destino"
              placeholder="Destino"
              value={form.destino}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="direccion"
              placeholder="Dirección"
              value={form.direccion}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="descripcion"
              placeholder="Descripción"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Generar Código QR
            </button>
          </form>
        ) : (
          <>
            <p className="mb-2 text-gray-700 text-center mt-4">
              Código QR del Envío:
            </p>
            <QRCodeDisplay value={qrValue} />
            <button
              onClick={handleNuevoEnvio}
              className="mt-4 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition w-full"
            >
              Registrar otro envío
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default RegistrarEnvio;
