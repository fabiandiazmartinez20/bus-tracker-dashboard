import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      console.log("🔑 Token encontrado, agregando al header");
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("⚠️ No hay token en localStorage");
    }

    console.log("📤 Request a:", config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => {
    console.log("✅ Response exitoso:", response.config.url);
    return response;
  },
  (error) => {
    console.error("❌ ERROR COMPLETO:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      headers: error.response?.headers,
    });

    if (error.response?.status === 401) {
      console.log("🚨 Error 401 detectado");
      console.log("🚨 Message:", error.response?.data?.message);

      // COMENTADO TEMPORALMENTE - NO REDIRIGIR
      // localStorage.removeItem('access_token');
      // localStorage.removeItem('user');
      // window.location.href = '/login';

      alert("Error 401: " + JSON.stringify(error.response?.data));
    }
    return Promise.reject(error);
  }
);

export default api;
