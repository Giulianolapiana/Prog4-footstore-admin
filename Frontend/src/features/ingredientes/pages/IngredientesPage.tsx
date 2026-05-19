import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  getIngredientes,
  createIngrediente,
  updateIngrediente,
  deleteIngrediente,
} from "../services/ingredients.service";
import type { IIngrediente } from "../../../shared/types";
import { ModalIngredientes } from "../components/ModalIngredientes";

type ModalState =
  | { type: "none" }
  | { type: "create" }
  | { type: "edit"; ingrediente: IIngrediente };

export const IngredientesPage = () => {
  const queryClient = useQueryClient();

  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [searchTerm, setSearchTerm] = useState("");

  const handleCloseModal = () => {
    setModal({ type: "none" });
  };

  //==========GET
  const {
    data: ingredientes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ingredientes"],
    queryFn: getIngredientes,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
  });

  //==========CREATE
  const createMutation = useMutation({
    mutationFn: createIngrediente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
    },
    onError: () => {
      console.log("Error al crear ingrediente");
    },
  });

  //==========UPDATE
  const editMutation = useMutation({
    mutationFn: ({
      id,
      ingrediente,
    }: {
      id: number;
      ingrediente: Omit<IIngrediente, "id">;
    }) => updateIngrediente(id, ingrediente),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
    },
  });

  //==========DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteIngrediente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredientes"] });
    },
  });

  const filteredIngredientes = useMemo(() => {
    return ingredientes.filter((ingrediente) =>
      (ingrediente.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ingrediente.descripcion || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [ingredientes, searchTerm]);

  //========== TANSTACK TABLE =========//
  const columnHelper = createColumnHelper<IIngrediente>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("nombre", {
        header: "Nombre",
        cell: (info) => <span className="font-medium text-gray-800">{info.getValue()}</span>,
      }),
      columnHelper.accessor("descripcion", {
        header: "Descripción",
        cell: (info) => <span className="text-sm text-gray-500 max-w-xs truncate block">{info.getValue() || "—"}</span>,
      }),
      columnHelper.accessor("es_alergeno", {
        header: () => <div className="text-center">Alérgeno</div>,
        cell: (info) => (
          <div className="text-center">
            {info.getValue() ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                Sí
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                No
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
              onClick={() => setModal({ type: "edit", ingrediente: info.row.original })}
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
    data: filteredIngredientes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <p>Cargando ingredientes...</p>;
  if (isError) return <p>Hubo un error al cargar los ingredientes</p>;

  return (
    <>
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ingredientes</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {ingredientes.length} ingredientes en total
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64 lg:w-80">
              <input
                type="text"
                placeholder="Buscar por nombre..."
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
              Nuevo ingrediente
            </button>
          </div>
        </div>

        {/* Tabla TanStack */}
        <div className="rounded-2xl border border-gray-100 overflow-x-auto shadow-sm">
          <table className="w-full text-sm min-w-[600px]">
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

          {filteredIngredientes.length === 0 && (
            <div className="py-16 text-center text-gray-400">
              <p className="text-4xl mb-3"></p>
              <p className="font-medium text-gray-600">
                No se encontraron ingredientes
              </p>
              <p className="text-sm mt-1">
                {searchTerm ? "Intenta con otro término de búsqueda" : "Creá el primero haciendo clic en 'Nuevo ingrediente'"}
              </p>
            </div>
          )}
        </div>
      </div>

      {modal.type === "create" && (
        <ModalIngredientes
          ingredienteActive={null}
          handleCreate={async (data) => { await createMutation.mutateAsync(data); }}
          handleCloseModal={handleCloseModal}
        />
      )}
      {modal.type === "edit" && (
        <ModalIngredientes
          ingredienteActive={modal.ingrediente}
          handleUpdate={async (id, data) => { await editMutation.mutateAsync({ id, ingrediente: data }); }}
          handleCloseModal={handleCloseModal}
        />
      )}
    </>
  );
};

export default IngredientesPage;
