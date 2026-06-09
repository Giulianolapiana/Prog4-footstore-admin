import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../services/categories.service";
import type { ICategoria } from '../types';
import { ModalCategorias } from "../components/ModalCategorias";

type ModalState =
  | { type: "none" }
  | { type: "create" }
  | { type: "edit"; categoria: ICategoria };

export const CategoriasPage = () => {
  const queryClient = useQueryClient();

  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [searchTerm, setSearchTerm] = useState("");

  const handleCloseModal = () => {
    setModal({ type: "none" });
  };

  //==========GET =====================//
  const {
    data: categorias = [],
    isLoading,  
    isError,
  } = useQuery({
    queryKey: ["categorias"],
    queryFn: getCategorias,
    staleTime: 1000 * 60 * 5,
  });

  //==========CREATE =====================//
  const createMutation = useMutation({
    mutationFn: createCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
    onError: () => {
      console.log("Error al crear categoría");
    },    
  });

  //==========UPDATE =====================//
  const editMutation = useMutation({
    mutationFn: ({
      id,
      categoria,
    }: {
      id: number;
      categoria: Omit<ICategoria, "id">;
    }) => updateCategoria(id, categoria),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });

  //==========DELETE =====================//
  const deleteMutation = useMutation({
    mutationFn: deleteCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });

  //==========CONDICIONES DE RENDERIZADO =========//
  // Aplanar y buscar
  const filteredCategorias = useMemo(() => {
    return categorias.map((categoria) => {
      let path = categoria.nombre;
      let current = categoria;
      const visited = new Set<number>();
      if (current.id) visited.add(current.id);

      while (current.parent_id) {
        const parent = categorias.find((c) => c.id === current.parent_id);
        if (parent && parent.id && !visited.has(parent.id)) {
          visited.add(parent.id);
          path = `${parent.nombre} > ${path}`;
          current = parent;
        } else {
          break;
        }
      }
      return { ...categoria, path };
    }).filter((c) => 
      (c.path || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categorias, searchTerm]);

  //========== TANSTACK TABLE =========//
  const columnHelper = createColumnHelper<any>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("path", {
        header: "Nombre",
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex items-center gap-2">
              {row.parent_id ? (
                <>
                  <span className="text-emerald-500 font-bold" title="Subcategoría">↳</span>
                  <span className="font-medium text-gray-800">
                    {info.getValue().split(" > ").map((part: string, index: number, array: string[]) => (
                      index === array.length - 1 ? (
                        <span key={index}>{part}</span>
                      ) : (
                        <span key={index} className="text-gray-400 font-normal text-xs">{part} / </span>
                      )
                    ))}
                  </span>
                </>
              ) : (
                <span className="font-medium text-gray-800">{row.nombre}</span>
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor("descripcion", {
        header: "Descripción",
        cell: (info) => <span className="text-gray-500 max-w-xs truncate block">{info.getValue() || "—"}</span>,
      }),
      columnHelper.display({
        id: "acciones",
        header: () => <div className="text-center">Acciones</div>,
        cell: (info) => (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setModal({ type: "edit", categoria: info.row.original })}
              className="px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              Editar
            </button>
            <button
              onClick={() => deleteMutation.mutate(info.row.original.id!)}
              className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              Eliminar
            </button>
          </div>
        ),
      }),
    ],
    [deleteMutation]
  );

  const table = useReactTable({
    data: filteredCategorias,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <p>Cargando categorías...</p>;
  if (isError) return <p>Hubo un error al cargar las categorías</p>;

  //==========RENDER =========//
  return (
    <>
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {categorias.length} categorías en total
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64 lg:w-80">
              <input
                type="text"
                placeholder="Buscar por nombre o ruta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <button
              onClick={() => setModal({ type: "create" })}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap"
            >
              <span className="text-base leading-none">+</span>
              Nueva categoría
            </button>
          </div>
        </div>

        {/* Tabla TanStack */}
        <div className="rounded-2xl border border-gray-100 overflow-x-auto shadow-sm">
          <table className="w-full text-sm min-w-[700px]">
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

          {filteredCategorias.length === 0 && (
             <div className="py-16 text-center text-gray-400">
               <p className="text-4xl mb-3"></p>
               <p className="font-medium text-gray-600">
                 No se encontraron categorías
               </p>
               <p className="text-sm mt-1">
                 {searchTerm ? "Intenta con otro término de búsqueda" : "Para crear una hace clic en 'Nueva categoría'"}
               </p>
             </div>
           )}
         </div>
       </div>

       {modal.type === "create" && (
         <ModalCategorias
           categorias={categorias}
           categoriaActive={null}
           handleCreate={async (data) => { await createMutation.mutateAsync(data); }}
           handleCloseModal={handleCloseModal}
         />
       )}
       {modal.type === "edit" && (
         <ModalCategorias
           categorias={categorias}
           categoriaActive={modal.categoria}
           handleUpdate={async (id, data) => { await editMutation.mutateAsync({ id, categoria: data }); }}
           handleCloseModal={handleCloseModal}
         />
       )}
     </>
   );
};

export default CategoriasPage;
