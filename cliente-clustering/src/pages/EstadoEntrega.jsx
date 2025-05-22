import { useState } from "react";
import axios from "../services/api";

function EstadoEntrega() {
  const [id, setId] = useState("");
  const [estado, setEstado] = useState("");

  const consultarEstado = async () => {
    try {
      const { data } = await axios.get(`/estado-envio/${id}`);
      setEstado(data.estado);
    } catch {
      setEstado("Error al consultar");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Consultar Estado de Entrega</h2>
      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="ID del envío"
        className="w-full border p-2 mb-3 rounded"
      />
      <button
        onClick={consultarEstado}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Consultar
      </button>
      {estado && <p className="mt-4 text-lg font-medium">Estado: {estado}</p>}
    </div>
  );
}

export default EstadoEntrega;
