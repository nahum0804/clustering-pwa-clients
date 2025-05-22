import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Menú Principal</h1>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/registro")}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Registrar Envío
          </button>

          <button
            onClick={() => navigate("/estado")}
            className="w-full py-3 px-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
          >
            Consultar Estado de Entrega
          </button>

          <button
            onClick={() => navigate("/historial")}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            Historial y Saldo
          </button>

          <button
            onClick={logout}
            className="w-full py-3 px-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
