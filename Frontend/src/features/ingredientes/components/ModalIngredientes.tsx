import type { IIngrediente } from '../types';
import { useForm } from "@tanstack/react-form";
import { useState } from "react";

type Props = {
  ingredienteActive: IIngrediente | null;
  handleCloseModal: VoidFunction;
  handleCreate?: (ingrediente: Omit<IIngrediente, "id">) => void | Promise<void>;
  handleUpdate?: (id: number, ingrediente: Omit<IIngrediente, "id">) => void | Promise<void>;
};

export const ModalIngredientes = ({
  ingredienteActive,
  handleCloseModal,
  handleCreate,
  handleUpdate,
}: Props) => {
  const [apiError, setApiError] = useState<string | null>(null);
  const form = useForm({
    defaultValues: {
      nombre: ingredienteActive?.nombre ?? "",
      descripcion: ingredienteActive?.descripcion ?? "",
      es_alergeno: ingredienteActive?.es_alergeno ?? false,
    },
    onSubmit: async ({ value }) => {
      setApiError(null);
      const ingredienteData: Omit<IIngrediente, "id"> = {
        nombre: value.nombre,
        descripcion: value.descripcion || undefined,
        es_alergeno: value.es_alergeno,
      };
      try {
        if (ingredienteActive) {
          if (handleUpdate) await handleUpdate(ingredienteActive.id!, ingredienteData);
        } else {
          if (handleCreate) await handleCreate(ingredienteData);
        }
        handleCloseModal();
      } catch (err: any) {
        setApiError(err.message || "Error al guardar");
      }
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {ingredienteActive ? "Editar ingrediente" : "Nuevo ingrediente"}
          </h2>
          <button
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={handleCloseModal}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          id="ingrediente-form"
        >
          <div className="px-6 py-5 space-y-4">
            {/* Nombre */}
            <form.Field
              name="nombre"
              children={(field) => (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Nombre del ingrediente"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}
            />

            {/* Descripción */}
            <form.Field
              name="descripcion"
              children={(field) => (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600">
                    Descripción
                  </label>
                  <textarea
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={2}
                    placeholder="Descripción del ingrediente (opcional)"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}
            />

            {/* Es Alergeno */}
            <form.Field
              name="es_alergeno"
              children={(field) => (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    id="es-alergeno-toggle"
                    name={field.name}
                    type="checkbox"
                    checked={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <label
                    htmlFor="es-alergeno-toggle"
                    className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                  >
                    Es alérgeno
                  </label>
                </div>
              )}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex flex-col border-t border-gray-100 bg-gray-50">
          {apiError && (
            <div className="px-6 py-3 bg-red-50 border-b border-red-100 text-sm text-red-600 font-medium">
              Error: {apiError}
            </div>
          )}
          <div className="flex items-center justify-end gap-3 px-6 py-4">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={handleCloseModal}
          >
            Cancelar
          </button>
          <form.Subscribe
            selector={(state) => ({
              canSubmit: state.canSubmit,
              isSubmitting: state.isSubmitting,
            })}
          >
            {({ canSubmit, isSubmitting }) => (
              <button
                type="submit"
                form="ingrediente-form"
                disabled={!canSubmit || isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {ingredienteActive ? "Guardar cambios" : "Crear ingrediente"}
              </button>
            )}
          </form.Subscribe>
        </div>
        </div>
      </div>
    </div>
  );
};
