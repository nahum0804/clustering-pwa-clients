import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-xl font-semibold">Gestor de Envíos</h1>
        </header>
        <nav className="bg-white shadow p-4 flex gap-4">
          <Link to="/" className="text-blue-600 font-medium">Inicio</Link>
        </nav>
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
