import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { IngresosResponse } from '../types';

interface IngresosChartProps {
    data: IngresosResponse;
}

export function IngresosChart({ data }: IngresosChartProps) {
    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <h3 className="tracking-tight text-lg font-medium mb-4">Ingresos por Forma de Pago</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data.ingresos_por_forma_pago}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="forma_pago_codigo" type="category" width={100} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" fill="#8884d8" name="Ingresos Totales ($)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
