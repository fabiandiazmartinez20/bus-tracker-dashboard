import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ChoferesLista from "./pages/Choferes/ChoferesLista";

import ChoferCrear from "./pages/Choferes/ChoferesCrear";
import BusesLista from "./pages/Buses/BusesLista";
import BusCrear from "./pages/Buses/BusCrear";
import BusEditar from "./pages/Buses/BusEditar";
import ChoferEditar from "./pages/Choferes/ChoferEditar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="choferes" element={<ChoferesLista />} />
        <Route path="choferes/crear" element={<ChoferCrear />} />
        <Route path="buses" element={<BusesLista />} />
        <Route path="buses/crear" element={<BusCrear />} />
        <Route path="choferes/:id/editar" element={<ChoferEditar />} />
        <Route path="buses/:id/editar" element={<BusEditar />} />

        <Route
          path="estadisticas"
          element={
            <div className="p-6 text-gray-500">Estadísticas - Próximamente</div>
          }
        />
      </Route>

      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
