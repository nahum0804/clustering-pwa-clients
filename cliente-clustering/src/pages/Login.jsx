import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //  Esta parte es sin validaciones:
      // Puedes comentar/activar esta validación cuando lo necesites:
      // if (!form.email || !form.password) {
      //   setError("Todos los campos son obligatorios");
      //   return;
      // }

      // Simulación de login si no tienes un backend funcional:
      // Puedes cambiar esto por un llamado real a tu backend:
      const fakeToken = "token_fake_" + Date.now();
      localStorage.setItem("token", fakeToken);
      setError(null);
      navigate("/dashboard");

      // Si usas backend real, sería algo así:
      // const res = await api.post("/login", form);
      // localStorage.setItem("token", res.data.token);
      // navigate("/dashboard");
    } catch (err) {
      setError("Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
