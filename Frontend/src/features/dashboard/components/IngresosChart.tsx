import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { IngresosResponse } from '../types';

interface IngresosChartProps {
    data: IngresosResponse;
}

const getPaymentLabel = (code: string) => {
    switch (code) {
        case 'CASH': return 'CASH';
        case 'CREDIT': return 'Credito';
        case 'DEBIT': return 'Transf';
        case 'MP': return 'MP';
        default: return code;
    }
};

export function IngresosChart({ data }: IngresosChartProps) {
    const chartData = data.ingresos_por_forma_pago.map(item => ({
        ...item,
        label: getPaymentLabel(item.forma_pago_codigo)
    }));

    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <h3 className="tracking-tight text-lg font-medium mb-4">Ingresos por Forma de Pago</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="label" type="category" width={100} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" fill="#8884d8" name="Ingresos Totales ($)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
