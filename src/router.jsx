import { createContext, useContext, lazy, Suspense } from "react";

export const RouterContext = createContext({
  navigate: () => {},
  currentPath: "/",
  params: {}, // Nuevo estado para los parámetros
});

export function useRouter() {
  return useContext(RouterContext);
}

const pages = import.meta.glob("./app/**/page.jsx");
const layouts = import.meta.glob("./app/**/layout.jsx");

const routes = Object.keys(pages).map((path) => {
  let routePath = path.replace("./app", "").replace("/page.jsx", "");
  routePath = routePath === "/index" ? "/" : routePath;
  routePath = routePath.endsWith("/") ? routePath.slice(0, -1) : routePath;
  if (!routePath) routePath = "/";

  const Page = lazy(pages[path]);

  const segments = routePath.split("/").filter(Boolean);
  let layoutPath = "./app/layout.jsx";

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
  );

  // Manejar parámetros en la definición de la ruta
  const pathParts = routePath.split("/");
  const paramNames = pathParts
    .filter((part) => part.startsWith("[") && part.endsWith("]"))
    .map((part) => part.slice(1, -1));

  return {
    path: routePath,
    paramNames: paramNames, // Guarda los nombres de los parámetros
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
