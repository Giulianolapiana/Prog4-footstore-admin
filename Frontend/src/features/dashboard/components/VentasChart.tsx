import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { VentasPeriodoItem } from '../types';

interface VentasChartProps {
    data: VentasPeriodoItem[];
}

export function VentasChart({ data }: VentasChartProps) {
    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <h3 className="tracking-tight text-lg font-medium mb-4">Ventas por Periodo</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="periodo" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="total_ventas" stroke="#8884d8" activeDot={{ r: 8 }} name="Total Ventas ($)" />
                        <Line yAxisId="right" type="monotone" dataKey="cantidad_pedidos" stroke="#82ca9d" name="Cant. Pedidos" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
