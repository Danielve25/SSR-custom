// Dentro de una de tus páginas (ej: ./app/posts/page.jsx si la ruta es /posts/[id])
import { useRouter } from "../../../router";

export default function PostPage() {
  const { params } = useRouter();
  const postId = params.id; // Accede al parámetro 'id'

  return (
    <div>
      <h1>Detalles del Post</h1>
      <p>ID del post: {postId}</p>
      {/* ... más contenido ... */}
    </div>
  );
}
