import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../services/product.service";
import { getCategorias } from "../../categorias/services/categories.service";
import { getIngredientes } from "../../ingredientes/services/ingredients.service";
import type { IProducto, IIngrediente, ICategoria } from "../../../shared/types";
import { ModalProductos } from "../components/ModalProductos";

// IMPORTAMOS NUESTRO HOOK DE PERMISOS
import { usePermissions } from "../../../shared/hooks/usePermissions";

type ModalState =
  | { type: "none" }
  | { type: "create" }
  | { type: "edit"; producto: IProducto };

export const ProductosPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // EXTRAEMOS LOS PERMISOS DEL USUARIO LOGUEADO
  const { canCreateProduct, canEditProduct, canDeleteProduct } = usePermissions();

  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [searchTerm, setSearchTerm] = useState("");

  const handleCloseModal = () => {
    setModal({ type: "none" });
  };

  //========== GET =====================//
  const {
    data: productos = [],
    isLoading: isProdLoading,
    isError: isProdError,
  } = useQuery({
    queryKey: ["productos"],
    queryFn: getProductos,
    staleTime: 1000 * 30, 
    refetchInterval: 1000 * 30, 
  });

  const { data: categorias = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
    staleTime: 1000 * 60 * 5,
  });

  const { data: ingredientes = [] } = useQuery({
    queryKey: ["ingredientes"],
    queryFn: getIngredientes,
    staleTime: 1000 * 60 * 5,
  });

  //========== CREATE =====================//
  const createMutation = useMutation({
    mutationFn: createProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
    onError: () => {
      console.log("Error al crear producto");
    },
  });

  //========== UPDATE =====================//
  const editMutation = useMutation({
    mutationFn: ({
      id,
      producto,
    }: {
      id: number;
      producto: Omit<IProducto, "id">;
    }) => updateProducto(id, producto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      queryClient.invalidateQueries({ queryKey: ["producto"] });
    },
  });

  //========== DELETE =====================//
  const deleteMutation = useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      queryClient.invalidateQueries({ queryKey: ["producto"] });
    },
  });

  const filteredProductos = useMemo(() => {
    return productos.filter((producto) =>
      (producto.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.categorias?.some((c) => (c.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [productos, searchTerm]);

  //========== TANSTACK TABLE =========//
  const columnHelper = createColumnHelper<IProducto>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("imagenes_url", {
        header: "Imagen",
        cell: (info) => {
          const urls = info.getValue();
          const imageUrl = urls && urls.length > 0 ? urls[0] : "https://placehold.co/40x40?text=?";
          return (
            <img
              src={imageUrl}
              alt="Producto"
              className="w-10 h-10 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/40x40?text=?";
              }}
            />
          );
        },
      }),
      columnHelper.accessor("nombre", {
        header: "Producto",
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800 break-words line-clamp-2 max-w-[200px]" title={row.nombre}>{row.nombre}</span>
              {row.ingredientes?.some((i: IIngrediente) => i.es_alergeno) && (
                <span title="Contiene alérgenos" className="text-amber-500 cursor-help text-xs font-bold">
                  (A)
                </span>
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor("categorias", {
        header: "Categoría",
        cell: (info) => {
          const cats = info.getValue();
          return <span className="text-gray-500">{cats?.map((c: ICategoria) => c.nombre).join(", ") ?? "—"}</span>;
        },
      }),
      columnHelper.accessor("precio_base", {
        header: () => <div className="text-right">Precio</div>,
        cell: (info) => (
          <div className="text-right font-medium text-gray-800">
            ${Number(info.getValue() || 0).toLocaleString("es-AR")}
          </div>
        ),
      }),
      columnHelper.accessor("stock_cantidad", {
        header: () => <div className="text-center">Stock</div>,
        cell: (info) => {
          const stock = info.getValue();
          return (
            <div className="text-center">
              {stock === 0 ? (
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
                  Sin stock
                </span>
              ) : (
                <span className="text-sm text-gray-700 font-medium">{stock}</span>
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor("disponible", {
        header: () => <div className="text-center">Estado</div>,
        cell: (info) => (
          <div className="text-center">
            {info.getValue() ? (
              <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                Activo
              </span>
            ) : (
              <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                Inactivo
              </span>
            )}
          </div>
        ),
      }),
      columnHelper.display({
        id: "acciones",
        header: () => <div className="text-center">Acciones</div>,
        cell: (info) => (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => navigate(`/productos/detalle/${info.row.original.id}`)}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Ver
            </button>
            
            {/*   Solo visible si tiene permiso de editar */}
            {canEditProduct && (
              <button
                onClick={() => setModal({ type: "edit", producto: info.row.original })}
                className="px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                Editar
              </button>
            )}

            {/*  Solo visible si tiene permiso de borrar */}
            {canDeleteProduct && (
              <button
                onClick={() => deleteMutation.mutate(info.row.original.id!)}
                className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                Eliminar
              </button>
            )}
          </div>
        ),
      }),
    ],
    // Agregamos las variables de permisos a las dependencias del useMemo
    [deleteMutation, navigate, canEditProduct, canDeleteProduct]
  );

  const table = useReactTable({
    data: filteredProductos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isProdLoading) return <p>Cargando productos...</p>;
  if (isProdError) return <p>Hubo un error al cargar los productos</p>;

  return (
    <>
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {productos.length} productos en total
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64 lg:w-80">
              <input
                type="text"
                placeholder="Buscar por nombre o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/*   Solo visible si tiene permiso de crear */}
            {canCreateProduct && (
              <button
                onClick={() => setModal({ type: "create" })}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap"
              >
                <span className="text-base leading-none">+</span>
                Nuevo producto
              </button>
            )}
          </div>
        </div>

        {/* Tabla TanStack */}
        <div className="rounded-2xl border border-gray-100 overflow-x-auto shadow-sm">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 text-left font-medium">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-emerald-50/40 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProductos.length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <p className="font-medium text-gray-600">
                No se encontraron productos
              </p>
              <p className="text-sm mt-1">
                {searchTerm ? "Intenta con otro término de búsqueda" : "Creá el primero haciendo clic en 'Nuevo producto'"}
              </p>
            </div>
          )}
        </div>
      </div>

      {modal.type === "create" && (
        <ModalProductos
          productActive={null}
          categorias={categorias}
          ingredientes={ingredientes}
          handleCreate={async (data) => { await createMutation.mutateAsync(data); }}
          handleUpdate={() => { }}
          handleCloseModal={handleCloseModal}
        />
      )}
      {modal.type === "edit" && (
        <ModalProductos
          productActive={modal.producto}
          categorias={categorias}
          ingredientes={ingredientes}
          handleCreate={() => { }}
          handleUpdate={async (id, data) => { await editMutation.mutateAsync({ id, producto: data }); }}
          handleCloseModal={handleCloseModal}
        />
      )}
    </>
  );
};

export default ProductosPage;