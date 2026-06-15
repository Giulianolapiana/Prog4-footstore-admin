import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ProductoTopItem } from '../types';

interface ProductosChartProps {
    data: ProductoTopItem[];
}

export function ProductosChart({ data }: ProductosChartProps) {
    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <h3 className="tracking-tight text-lg font-medium mb-4">Top Productos Vendidos</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nombre" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="ingresos" fill="#8884d8" name="Ingresos ($)" />
                        <Bar dataKey="cantidad_vendida" fill="#82ca9d" name="Cantidad Vendida" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
