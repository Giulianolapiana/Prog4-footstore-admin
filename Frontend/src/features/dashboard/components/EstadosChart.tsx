import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { PedidosEstadoItem } from '../types';

interface EstadosChartProps {
    data: PedidosEstadoItem[];
}

const COLORS = ['#044074da', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF'];

export function EstadosChart({ data }: EstadosChartProps) {
    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <h3 className="tracking-tight text-lg font-medium mb-4">Estado de Pedidos</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="cantidad"
                            nameKey="estado_codigo"
                            label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                        >
                            {data.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
