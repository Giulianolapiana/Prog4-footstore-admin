import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProducto } from "../services/product.service";


export const ProductoDetallePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: producto,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["producto", id],
    queryFn: () => getProducto(Number(id)),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <p>Cargando detalle del producto...</p>;
  if (isError || !producto) return <p>No existe el producto</p>;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      {/* Encabezado */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/productos")}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          title="Volver"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{producto.nombre}</h1>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-6 flex flex-col gap-5">
        {/* Imagen */}
        <div className="flex justify-center mb-4">
          <img
            src={producto.imagenes_url && producto.imagenes_url.length > 0 ? producto.imagenes_url[0] : `https://placehold.co/200x200?text=${encodeURIComponent(producto.nombre?.charAt(0) || "?")}`}
            alt={producto.nombre}
            className="w-48 h-48 object-cover rounded-xl border border-gray-200 shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/200x200?text=?";
            }}
          />
        </div>

        {/* Categorías */}
        {producto.categorias && producto.categorias.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {producto.categorias.map((cat) => (
              <span
                key={cat.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
              >
                {cat.nombre}
              </span>
            ))}
          </div>
        )}

        <hr className="border-gray-100" />

        {/* Descripción */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Descripción
          </span>
          <p className="text-sm text-gray-700 leading-relaxed">
            {producto.descripcion || "Sin descripción"}
          </p>
        </div>

        {/* Precio */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Precio
          </span>
          <span className="text-lg font-bold text-gray-900">
            ${Number(producto.precio_base || 0).toLocaleString("es-AR")}
          </span>
        </div>

        {/* Ingredientes */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Ingredientes
          </span>
          <div className="flex flex-wrap gap-2">
            {producto.ingredientes && producto.ingredientes.length > 0 ? (
              producto.ingredientes.map((ing) => (
                <span
                  key={ing.id}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    ing.es_alergeno
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {ing.es_alergeno && <span className="font-bold">(A) </span>}
                  {ing.nombre}
                </span>
              ))
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Sin ingredientes
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetallePage;
