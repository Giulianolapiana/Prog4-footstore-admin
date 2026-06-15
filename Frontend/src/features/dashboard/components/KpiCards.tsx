import type { ResumenResponse } from '../types';

interface KpiCardsProps {
    data: ResumenResponse;
}

export function KpiCards({ data }: KpiCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="tracking-tight text-sm font-medium">Ventas de Hoy</h3>
                </div>
                <div className="text-2xl font-bold">${Number(data.ventas_hoy).toFixed(2)}</div>
            </div>
            
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="tracking-tight text-sm font-medium">Ticket Promedio</h3>
                </div>
                <div className="text-2xl font-bold">${Number(data.ticket_promedio).toFixed(2)}</div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="tracking-tight text-sm font-medium">Pedidos Activos</h3>
                </div>
                <div className="text-2xl font-bold">{data.pedidos_activos}</div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="tracking-tight text-sm font-medium">Ventas Mes Actual</h3>
                </div>
                <div className="text-2xl font-bold">${Number(data.ventas_mes_actual).toFixed(2)}</div>
            </div>
        </div>
    );
}
