import { useEffect, useState } from "react";
import routes from "./router";
import { RouterContext } from "./router"; // Importa el componente Link

export default function App() {
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);

      const onPopState = () => setCurrentPath(window.location.pathname);
      window.addEventListener("popstate", onPopState);

      return () => window.removeEventListener("popstate", onPopState);
    }
  }, []);

  const navigate = (to) => {
    window.history.pushState({}, "", to);
    setCurrentPath(to);
  };

  const route = routes.find((r) => r.path === currentPath) || {
    element: <div>404 - Página no encontrada</div>,
  };

  return (
    <RouterContext.Provider value={{ navigate, currentPath }}>
      {/* Renderiza el componente correspondiente */}
      {route.element}
    </RouterContext.Provider>
  );
}
