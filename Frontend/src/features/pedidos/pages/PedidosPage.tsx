import { usePedidosAdmin } from "../hook/usePedidosAdmin";
import { usePermissions } from "../../../shared/hooks/usePermissions";
import type { IPedido, EstadoPedidoCodigo } from '../types';

export const PedidosPage = () => {
    const {
        pedidos,
        isLoading,
        isError,
        avanzarEstado,
        cancelarPedido,
        isModifying,
    } = usePedidosAdmin();
    const { canManageOrders, canCancelOrders } = usePermissions();

    // Definición de las columnas del tablero Kanban
    const columnas: {
        titulo: string;
        color: string;
        estados: EstadoPedidoCodigo[];
    }[] = [
            {
                titulo: "Nuevos (Pendientes)",
                color: "border-t-amber-500 bg-amber-50/20",
                estados: ["PENDIENTE", "CONFIRMADO"],
            },
            {
                titulo: "En Cocina / Prep",
                color: "border-t-blue-500 bg-blue-50/20",
                estados: ["EN_PREP"],
            },
            {
                titulo: "En Reparto / Camino",
                color: "border-t-indigo-500 bg-indigo-50/20",
                estados: ["EN_CAMINO"],
            },
            {
                titulo: "Finalizados",
                color: "border-t-gray-300 bg-gray-50/10",
                estados: ["ENTREGADO", "CANCELADO"],
            },
        ];

    // Helper para saber cuál es el siguiente paso lógico en el flujo
    const getSiguienteEstado = (
        actual: EstadoPedidoCodigo,
    ): EstadoPedidoCodigo | null => {
        switch (actual) {
            case "PENDIENTE":
                return "CONFIRMADO";
            case "CONFIRMADO":
                return "EN_PREP";
            case "EN_PREP":
                return "EN_CAMINO";
            case "EN_CAMINO":
                return "ENTREGADO";
            default:
                return null;
        }
    };

    // Helper para textos amigables de botones
    const getTextoBotonAccion = (actual: EstadoPedidoCodigo): string => {
        switch (actual) {
            case "PENDIENTE":
                return "Confirmar Pedido";
            case "CONFIRMADO":
                return "Empezar Cocción";
            case "EN_PREP":
                return "Enviar con Moto";
            case "EN_CAMINO":
                return "Marcar Entregado";
            default:
                return "";
        }
    };

    if (isLoading)
        return (
            <div className="p-6 text-center text-gray-500">
                Cargando tablero de pedidos...
            </div>
        );
    if (isError)
        return (
            <div className="p-6 text-center text-red-500">
                Error al conectar con la cocina.
            </div>
        );

    return (
        <div className="w-full h-full flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Monitoreo de Pedidos (Kanban)
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                    Control de comandas en tiempo real y flujo de despacho.
                </p>
            </div>

            {/* Grid del Tablero Kanban */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 items-start">
                {columnas.map((col) => {
                    // Filtramos los pedidos que pertenecen a los estados de esta columna
                    const pedidosColumna = pedidos.filter((p) =>
                        col.estados.includes(p.estado_actual.codigo),
                    );

                    return (
                        <div
                            key={col.titulo}
                            className={`flex flex-col rounded-xl border border-gray-100 border-t-4 p-4 shadow-sm h-[70vh] overflow-y-auto ${col.color}`}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-gray-700 text-sm tracking-tight">
                                    {col.titulo}
                                </h3>
                                <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold border border-gray-200 text-gray-500">
                                    {pedidosColumna.length}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {pedidosColumna.map((pedido: IPedido) => {
                                    const siguiente = getSiguienteEstado(
                                        pedido.estado_actual.codigo,
                                    );
                                    const esFinalizado = ["ENTREGADO", "CANCELADO"].includes(
                                        pedido.estado_actual.codigo,
                                    );

                                    return (
                                        <div
                                            key={pedido.id}
                                            className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col gap-3"
                                        >
                                            {/* Cabecera de la tarjeta */}
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-bold text-gray-400 uppercase">
                                                    Orden #{pedido.id}
                                                </span>
                                                <span
                                                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${pedido.estado_actual.codigo === "CANCELADO"
                                                            ? "bg-red-100 text-red-700"
                                                            : pedido.estado_actual.codigo === "ENTREGADO"
                                                                ? "bg-gray-100 text-gray-700"
                                                                : pedido.estado_actual.codigo === "PENDIENTE"
                                                                    ? "bg-amber-100 text-amber-700 font-bold animate-pulse"
                                                                    : "bg-blue-100 text-blue-700"
                                                        }`}
                                                >
                                                    {pedido.estado_actual.nombre}
                                                </span>
                                            </div>

                                            {/* Información de entrega */}
                                            <div className="text-xs text-gray-600 space-y-0.5">
                                                <p className="font-medium text-gray-800">
                                                    📍 {pedido.direccion_entrega?.calle || 'Sin calle'}{" "}
                                                    {pedido.direccion_entrega?.numero || ''}
                                                </p>
                                                <p className="text-gray-400">
                                                    💳 {pedido.forma_pago.nombre}
                                                </p>
                                            </div>

                                            {/* Detalles comprimidos del pedido */}
                                            <div className="bg-gray-50 rounded-lg p-2 text-xs border border-gray-100">
                                                <ul className="space-y-1 divide-y divide-gray-200/50">
                                                    {pedido.detalles.map((det) => (
                                                        <li
                                                            key={det.id}
                                                            className="pt-1 first:pt-0 flex justify-between text-gray-700"
                                                        >
                                                            <span>
                                                                <strong className="text-emerald-700">
                                                                    {det.cantidad}x
                                                                </strong>{" "}
                                                                {det.producto_nombre}
                                                            </span>
                                                            <span className="text-gray-400">
                                                                ${det.subtotal}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div className="mt-2 pt-1 border-t border-gray-200 flex justify-between font-bold text-gray-950 text-[13px]">
                                                    <span>Total:</span>
                                                    <span>${pedido.total.toLocaleString("es-AR")}</span>
                                                </div>
                                            </div>

                                            {/* Botones de acción controlados por RBAC */}
                                            {!esFinalizado && canManageOrders && (
                                                <div className="flex flex-col gap-1.5 mt-1">
                                                    {siguiente && (
                                                        <button
                                                            disabled={isModifying}
                                                            onClick={() =>
                                                                avanzarEstado({
                                                                    id: pedido.id,
                                                                    nuevoEstado: siguiente,
                                                                })
                                                            }
                                                            className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                                                        >
                                                            <span>
                                                                {getTextoBotonAccion(
                                                                    pedido.estado_actual.codigo,
                                                                )}
                                                            </span>
                                                            <span className="material-symbols-outlined text-sm">
                                                                chevron_right
                                                            </span>
                                                        </button>
                                                    )}

                                                    {canCancelOrders && (
                                                        <button
                                                            disabled={isModifying}
                                                            onClick={() => {
                                                                if (confirm("¿Seguro de cancelar este pedido?"))
                                                                    cancelarPedido(pedido.id);
                                                            }}
                                                            className="w-full py-1 px-3 text-red-600 hover:bg-red-50 font-medium text-xs rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                        >
                                                            Rechazar / Cancelar
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {pedidosColumna.length === 0 && (
                                    <div className="text-center py-8 text-gray-300 text-xs border border-dashed border-gray-200 rounded-xl">
                                        Sin pedidos en esta fase
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PedidosPage;
