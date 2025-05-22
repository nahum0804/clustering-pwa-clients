import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RegisterShipment from "./pages/RegistrarEnvio";
import DeliveryStatus from "./pages/EstadoEntrega";
import History from "./pages/Historial";

const isAuthenticated = () => !!localStorage.getItem("token");

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/registro"
          element={
            <PrivateRoute>
              <RegisterShipment />
            </PrivateRoute>
          }
        />
        <Route
          path="/estado"
          element={
            <PrivateRoute>
              <DeliveryStatus />
            </PrivateRoute>
          }
        />
        <Route
          path="/historial"
          element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          }
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
