import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      const userData = localStorage.getItem("user");

      console.log("🔍 useAuth - Verificando auth:", {
        tokenExists: !!token,
        userDataExists: !!userData,
      });

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          console.log("✅ Usuario autenticado:", parsedUser.email);
        } catch (error) {
          console.error("❌ Error parsing user data:", error);
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          setUser(null);
        }
      } else {
        console.log("⚠️ No hay token o usuario en localStorage");
        setUser(null);
      }

      setLoading(false);
    };

    checkAuth();
  }, []); // Solo ejecutar una vez al montar

  const logout = () => {
    console.log("👋 Cerrando sesión");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return { user, loading, logout };
}
