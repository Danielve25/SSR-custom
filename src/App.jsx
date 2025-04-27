import { useEffect, useState } from "react";
import routes from "./router";
import { RouterContext } from "./router";

export default function App() {
  const [currentPath, setCurrentPath] = useState("/");
  const [params, setParams] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handlePathChange = () => {
        setCurrentPath(window.location.pathname);
        // Buscar la ruta que coincide y extraer los parámetros
        const matchedRoute = routes.find((route) => {
          const routeParts = route.path.split("/");
          const currentParts = window.location.pathname.split("/");

          if (routeParts.length !== currentParts.length) {
            return false;
          }

          const currentParams = {};
          const isMatch = routeParts.every((part, index) => {
            if (part.startsWith("[") && part.endsWith("]")) {
              const paramName = part.slice(1, -1);
              currentParams[paramName] = currentParts[index];
              return true;
            }
            return part === currentParts[index];
          });

          if (isMatch) {
            setParams(currentParams);
            return true;
          }
          return false;
        });

        if (!matchedRoute) {
          setParams({}); // Limpiar los parámetros si no hay coincidencia
        }
      };

      handlePathChange(); // Llamar al inicio para establecer el estado inicial

      const onPopState = () => handlePathChange();
      window.addEventListener("popstate", onPopState);

      return () => window.removeEventListener("popstate", onPopState);
    }
  }, []);

  const navigate = (to) => {
    window.history.pushState({}, "", to);
    // No necesitamos actualizar los parámetros aquí, se harán en el useEffect al cambiar la ruta
    setCurrentPath(to);
  };

  const route = routes.find((r) => {
    const routeParts = r.path.split("/");
    const currentParts = currentPath.split("/");

    if (routeParts.length !== currentParts.length) {
      return false;
    }

    return routeParts.every((part, index) => {
      return (
        (part.startsWith("[") && part.endsWith("]")) ||
        part === currentParts[index]
      );
    });
  }) || {
    element: <div>404 - Página no encontrada</div>,
  };

  return (
    <RouterContext.Provider value={{ navigate, currentPath, params }}>
      {" "}
      {/* Pasa los params al contexto */}
      {route.element}
    </RouterContext.Provider>
  );
}
