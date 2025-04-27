import { useRouter } from "./router";

export function Link({ to, children, ...props }) {
  // Agrega ...props para pasar otros atributos
  const { navigate } = useRouter();

  return (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
      {...props} // Pasa los atributos adicionales al elemento <a>
    >
      {children}
    </a>
  );
}
