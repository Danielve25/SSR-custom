export default function Layout({ children }) {
  return (
    <div style={{ padding: 20, border: "2px solid black" }}>
      <h1>Layout raíz</h1>
      {children}
    </div>
  );
}
