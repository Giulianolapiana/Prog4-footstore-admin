import type { IProducto } from '../types';
import type { ICategoria } from '../../categorias/types';
import type { IIngrediente } from '../../ingredientes/types';
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { ImageUploader } from './ImageUploader'; 

type Props = {
  productActive: IProducto | null;
  categorias: ICategoria[];
  ingredientes: IIngrediente[];
  handleCloseModal: VoidFunction;
  handleCreate: (newProduct: Omit<IProducto, "id">) => void | Promise<void>;
  handleUpdate: (id: number, newProduct: Omit<IProducto, "id">) => void | Promise<void>;
};

export const ModalProductos = ({
  productActive,
  categorias,
  ingredientes,
  handleCloseModal,
  handleCreate,
  handleUpdate,
}: Props) => {

  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      nombre: productActive?.nombre ?? "",
      descripcion: productActive?.descripcion ?? "",
      precio_base: productActive ? productActive.precio_base.toString() : "",
      stock_cantidad: productActive?.stock_cantidad?.toString() ?? "0",
      disponible: productActive?.disponible ?? true,
      imagenes_url: productActive?.imagenes_url ?? ([] as string[]),
      categoria_ids: productActive?.categorias?.map((c) => c.id!) || productActive?.categoria_ids || ([] as number[]),
      ingredientes: productActive?.ingredientes?.map((i) => ({
        ingrediente_id: i.id!,
        es_removible: false
      })) || ([] as { ingrediente_id: number, es_removible: boolean }[]),
    },
    onSubmit: async ({ value }) => {
      setApiError(null);

      const productoData: any = {
        nombre: value.nombre,
        descripcion: value.descripcion || undefined,
        precio_base: Number(value.precio_base) > 0 ? Number(value.precio_base) : 1, // Prevenir 422 gt=0
        stock_cantidad: Number(value.stock_cantidad) >= 0 ? Number(value.stock_cantidad) : 0,
        disponible: value.disponible,
        imagenes_url: value.imagenes_url, // Enviar array vacío si no hay
        categoria_ids: value.categoria_ids,
        ingredientes: value.ingredientes,
        unidad_venta_id: 3, // Unidad por defecto
      };
      try {
        if (productActive) {
          await handleUpdate(productActive.id!, productoData);
        } else {
          await handleCreate(productoData);
        }
        handleCloseModal();
      } catch (err: any) {
        setApiError(err.message || "Error al guardar");
      }
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {productActive ? "Editar producto" : "Nuevo producto"}
          </h2>
          <button
            onClick={handleCloseModal}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form
          id="producto-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">

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
                    placeholder="Nombre del producto"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}
            />

            {/* Precio y Stock */}
            <div className="grid grid-cols-2 gap-3">
              <form.Field
                name="precio_base"
                children={(field) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-600">
                      Precio ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      name={field.name}
                      type="number"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}
              />
              <form.Field
                name="stock_cantidad"
                children={(field) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-600">
                      Stock
                    </label>
                    <input
                      name={field.name}
                      type="number"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}
              />
            </div>

            {/* Disponible */}
            <form.Field
              name="disponible"
              children={(field) => (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-emerald-50/40">
                  <input
                    id="disponible-toggle"
                    name={field.name}
                    type="checkbox"
                    checked={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <label
                    htmlFor="disponible-toggle"
                    className="flex flex-col cursor-pointer select-none"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      Disponible
                    </span>
                  </label>
                </div>
              )}
            />

            {/* IMAGENES ACTUALIZADA CON CLOUDINARY */}
            <form.Field
              name="imagenes_url"
              children={(field) => {
                const urls = field.state.value as string[];
                
                const agregarImagenCloudinary = (url: string) => {
                  if (url && !urls.includes(url)) {
                    field.handleChange([...urls, url]);
                  }
                };
                
                const eliminarImagen = (idx: number) => {
                  field.handleChange(urls.filter((_, i) => i !== idx));
                };

                return (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-600">
                      Imágenes del Producto
                    </label>

                    {/* Previsualización de imágenes ya subidas */}
                    {urls.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {urls.map((url, idx) => (
                          <div key={idx} className="relative group w-20 h-20">
                            <img
                              src={url}
                              alt={`img-${idx}`}
                              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => eliminarImagen(idx)}
                              className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Componente Drag & Drop  */}
                    <ImageUploader 
                      value={null} // Pasamos null para que siempre muestre la caja de subida
                      onChange={(url) => agregarImagenCloudinary(url)}
                      onRemove={() => {}}
                    />
                  </div>
                );
              }}
            />

            {/* Categorías */}
            <form.Field
              name="categoria_ids"
              children={(field) => {
                const selectedCatIds = field.state.value as number[];
                const toggleCat = (catId: number) => {
                  if (selectedCatIds.includes(catId)) {
                    field.handleChange(selectedCatIds.filter((id) => id !== catId));
                  } else {
                    field.handleChange([...selectedCatIds, catId]);
                  }
                };

                return (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-600">
                      Categorías <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2 border border-gray-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                      {categorias.length === 0 ? (
                        <span className="text-sm text-gray-400">No hay categorías</span>
                      ) : (
                        categorias.map((cat) => (
                          <label key={cat.id} className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                              type="checkbox"
                              checked={selectedCatIds.includes(cat.id!)}
                              onChange={() => toggleCat(cat.id!)}
                              className="rounded border-gray-300 text-emerald-600"
                            />
                            <span>{cat.nombre}</span>
                          </label>
                        ))
                      )}
                    </div>
                    {selectedCatIds.length === 0 && (
                      <p className="text-xs text-red-500">Seleccioná al menos una categoría</p>
                    )}
                  </div>
                );
              }}
            />

            {/* Ingredientes */}
            <form.Field
              name="ingredientes"
              children={(field) => {
                const selectedIngs = field.state.value as { ingrediente_id: number, es_removible: boolean }[];
                const toggleIng = (ingId: number) => {
                  if (selectedIngs.some((i) => i.ingrediente_id === ingId)) {
                    field.handleChange(selectedIngs.filter((i) => i.ingrediente_id !== ingId));
                  } else {
                    field.handleChange([...selectedIngs, { ingrediente_id: ingId, es_removible: false }]);
                  }
                };
                const toggleRemovible = (ingId: number) => {
                  field.handleChange(
                    selectedIngs.map((i) =>
                      i.ingrediente_id === ingId ? { ...i, es_removible: !i.es_removible } : i
                    )
                  );
                };

                return (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-600">
                      Ingredientes
                    </label>
                    <div className="space-y-2 border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto">
                      {ingredientes.length === 0 ? (
                        <span className="text-sm text-gray-400">No hay ingredientes</span>
                      ) : (
                        ingredientes.map((ing) => {
                          const linkedIng = selectedIngs.find(
                            (s) => s.ingrediente_id === ing.id
                          );
                          return (
                            <div
                              key={ing.id}
                              className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-gray-50"
                            >
                              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={!!linkedIng}
                                  onChange={() => toggleIng(ing.id!)}
                                  className="rounded border-gray-300 text-green-600"
                                />
                                <span className="flex items-center gap-1">
                                  {ing.nombre}
                                  {ing.es_alergeno ? (
                                    <span title="Alérgeno" className="text-amber-500 text-xs">
                                      ⚠️
                                    </span>
                                  ) : (
                                    <span title="Seguro" className="text-emerald-500 text-[10px]">
                                      ✅
                                    </span>
                                  )}
                                </span>
                              </label>

                              {linkedIng && (
                                <div className="flex items-center gap-1.5 ml-auto">
                                  <input
                                    type="checkbox"
                                    id={`rem-${ing.id}`}
                                    checked={linkedIng.es_removible}
                                    onChange={() => toggleRemovible(ing.id!)}
                                    className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600"
                                  />
                                  <label
                                    htmlFor={`rem-${ing.id}`}
                                    className="text-[10px] font-medium text-gray-400 uppercase tracking-tight cursor-pointer"
                                  >
                                    Removible
                                  </label>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              }}
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
                    rows={3}
                    placeholder="Descripción del producto"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
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
              onClick={handleCloseModal}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <form.Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
                isSubmitting: state.isSubmitting,
                categoria_ids: state.values.categoria_ids,
              })}
            >
              {({ canSubmit, isSubmitting, categoria_ids }) => (
                <button
                  type="submit"
                  form="producto-form"
                  disabled={!canSubmit || isSubmitting || categoria_ids.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>}
                  {productActive ? "Guardar cambios" : "Crear producto"}
                </button>
              )}
            </form.Subscribe>
          </div>
        </div>
      </div>
    </div>
  );
};
