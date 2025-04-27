import { createContext, useContext, lazy, Suspense } from "react";

// Crear un contexto para el enrutamiento
export const RouterContext = createContext({
  navigate: () => {},
  currentPath: "/",
});

// Hook para acceder al contexto de enrutamiento
export function useRouter() {
  return useContext(RouterContext);
}

// Cargar páginas y layouts dinámicamente usando import.meta.glob
const pages = import.meta.glob("./app/**/page.jsx");
const layouts = import.meta.glob("./app/**/layout.jsx");

const routes = Object.keys(pages).map((path) => {
  // Ajuste para manejar rutas raíz y subrutas correctamente
  let routePath = path.replace("./app", "").replace("/page.jsx", "");
  routePath = routePath === "/index" ? "/" : routePath; // Convierte /index a /
  routePath = routePath.endsWith("/") ? routePath.slice(0, -1) : routePath; //Quita el slash al final si existe
  if (!routePath) routePath = "/";

  const Page = lazy(pages[path]);

  // Buscar el layout más cercano
  const segments = routePath.split("/").filter(Boolean);
  let layoutPath = "./app/layout.jsx"; // Layout por defecto

  for (let i = segments.length; i >= 0; i--) {
    const candidate = `./app/${segments.slice(0, i).join("/")}/layout.jsx`;
    if (layouts[candidate]) {
      layoutPath = candidate;
      break;
    }
  }
  const Layout = lazy(
    layouts[layoutPath] ||
      (() =>
        ({ children }) =>
          <>{children}</>)
  ); // Si no existe layout, usa un layout vacio

  return {
    path: routePath,
    element: (
      <Suspense fallback={<div>Cargando...</div>}>
        <Layout>
          <Page />
        </Layout>
      </Suspense>
    ),
  };
});

export default routes;
