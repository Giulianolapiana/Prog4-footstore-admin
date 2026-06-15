import { useAuthStore } from '../../../store/useAuthStore';
import { 
  useResumenKpis, 
  useVentasPeriodo, 
  useProductosTop, 
  usePedidosPorEstado, 
  useIngresosPorFormaPago 
} from '../hooks/useDashboard';
import { KpiCards } from '../components/KpiCards';
import { VentasChart } from '../components/VentasChart';
import { ProductosChart } from '../components/ProductosChart';
import { EstadosChart } from '../components/EstadosChart';
import { IngresosChart } from '../components/IngresosChart';

export const AdminDashboardPage = () => {
  const { user } = useAuthStore();

  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1);

  const formatQueryDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const { data: resumen, isLoading: loadingResumen } = useResumenKpis();
  const { data: ventas, isLoading: loadingVentas } = useVentasPeriodo(
    formatQueryDate(lastMonth), 
    formatQueryDate(today), 
    'day'
  );
  const { data: topProductos, isLoading: loadingProductos } = useProductosTop(5);
  const { data: pedidosEstado, isLoading: loadingEstados } = usePedidosPorEstado();
  const { data: ingresos, isLoading: loadingIngresos } = useIngresosPorFormaPago();

  return (
    <>
      <div 
        className="fixed inset-0 z-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: "url('/watermark.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />

      <div className="relative z-10 p-6 space-y-6">
        <div className="flex flex-col mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Dashboard de {user?.nombre || 'Administrador'}
            </h1>
            <p className="text-on-surface-variant">Resumen y métricas clave del negocio.</p>
        </div>

        {loadingResumen ? (
           <div>Cargando KPIs...</div>
        ) : (
           resumen && <KpiCards data={resumen} />
        )}

        <div className="grid gap-6 md:grid-cols-2">
            {loadingVentas ? <div>Cargando Ventas...</div> : (ventas && <VentasChart data={ventas} />)}
            {loadingProductos ? <div>Cargando Productos...</div> : (topProductos && <ProductosChart data={topProductos} />)}
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-6">
            {loadingEstados ? <div>Cargando Estados...</div> : (pedidosEstado && <EstadosChart data={pedidosEstado} />)}
            {loadingIngresos ? <div>Cargando Ingresos...</div> : (ingresos && <IngresosChart data={ingresos} />)}
        </div>
      </div>
    </>
  );
};
