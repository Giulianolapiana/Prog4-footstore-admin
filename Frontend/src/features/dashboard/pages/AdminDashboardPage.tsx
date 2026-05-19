const StatCard = ({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  badge,
  badgeColor,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  badge?: string;
  badgeColor?: string;
}) => (
  <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center ${iconColor}`}>
        <span className="material-symbols-outlined text-[22px]">{icon}</span>
      </div>
      {badge && (
        <span className={`flex items-center text-[12px] font-medium px-2 py-1 rounded-full ${badgeColor}`}>
          {badge}
        </span>
      )}
    </div>
    <p className="font-body-sm text-body-sm text-on-surface-variant">{label}</p>
    <h3 className="font-headline-md text-headline-md text-on-surface mt-1">{value}</h3>
  </div>
);

const recentOrders = [
  { id: "#ORD-9021", items: "Risotto de Trufa, Vino",      status: "En preparación", statusClass: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { id: "#ORD-9020", items: "Lomo con Papas (x2)",          status: "Pendiente",       statusClass: "bg-surface-container-high text-on-surface border-outline-variant/50" },
  { id: "#ORD-9019", items: "Ensalada César",               status: "Listo",           statusClass: "bg-blue-100 text-blue-800 border-blue-200" },
  { id: "#ORD-9018", items: "Pasta de Mariscos",            status: "Entregado",       statusClass: "bg-green-100 text-green-800 border-green-200" },
];

export const AdminDashboardPage = () => (
  <div className="space-y-gutter">

    {/* ── Bento Grid: KPIs ── */}
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon="payments"
        iconBg="bg-primary-container/20"
        iconColor="text-primary"
        label="Ventas Totales"
        value="$4,850.00"
        badge="↑ +12.5%"
        badgeColor="text-green-700 bg-green-100"
      />
      <StatCard
        icon="receipt_long"
        iconBg="bg-secondary-container/50"
        iconColor="text-on-surface"
        label="Pedidos Activos"
        value="42"
      />
      <StatCard
        icon="star"
        iconBg="bg-surface-container-high"
        iconColor="text-on-surface"
        label="Producto Estrella"
        value="Risotto de Trufa"
      />
      <StatCard
        icon="account_balance_wallet"
        iconBg="bg-tertiary-container/30"
        iconColor="text-on-tertiary-container"
        label="Ticket Promedio"
        value="$115.40"
        badge="↓ -2.1%"
        badgeColor="text-error bg-error-container"
      />
    </section>

    {/* ── Middle: Chart + Recent Orders ── */}
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">

      {/* Chart */}
      <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline-md text-[20px] font-semibold text-on-surface">
            Ventas en el Tiempo
          </h2>
          <select className="bg-surface-container border-none text-on-surface font-body-sm rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary outline-none text-sm">
            <option>Hoy</option>
            <option>Esta semana</option>
            <option>Este mes</option>
          </select>
        </div>

        {/* SVG chart */}
        <div className="relative h-[250px] w-full flex items-end gap-2 pb-6 px-2">
          {/* Y-Axis */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[12px] text-on-surface-variant py-2">
            <span>$5k</span><span>$3k</span><span>$1k</span><span>0</span>
          </div>
          {/* Grid lines */}
          <div className="absolute inset-0 pl-10 pt-4 flex flex-col justify-between pointer-events-none">
            {[1,2,3,4].map(i => (
              <div key={i} className={`w-full border-t ${i === 4 ? "border-outline-variant/40" : "border-outline-variant/20"} h-0`} />
            ))}
          </div>
          {/* Line + fill */}
          <div className="ml-10 flex-1 flex items-end justify-between h-[80%] relative z-10">
            <div
              className="w-full absolute bottom-0 left-0 h-full"
              style={{
                background: "linear-gradient(to top, rgba(255,90,31,0.1) 0%, transparent 100%)",
                clipPath: "polygon(0% 100%, 0% 70%, 20% 50%, 40% 80%, 60% 40%, 80% 60%, 100% 20%, 100% 100%)",
              }}
            />
            <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,70 L20,50 L40,80 L60,40 L80,60 L100,20" fill="none" stroke="#ae3200" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              {[[20,50],[40,80],[60,40],[80,60],[100,20]].map(([cx,cy]) => (
                <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="3" fill="#ffffff" stroke="#ae3200" strokeWidth="2" />
              ))}
            </svg>
          </div>
          {/* X-Axis */}
          <div className="absolute bottom-0 left-10 w-[calc(100%-40px)] flex justify-between text-[12px] text-on-surface-variant">
            {["10AM","12PM","2PM","4PM","6PM","8PM"].map(t => <span key={t}>{t}</span>)}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 shadow-sm flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline-md text-[20px] font-semibold text-on-surface">Pedidos Recientes</h2>
          <a href="#" className="text-primary font-body-sm font-medium hover:underline">Ver Todo</a>
        </div>
        <div className="space-y-4 flex-1">
          {recentOrders.map(order => (
            <div key={order.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container/50 transition-colors border border-transparent hover:border-outline-variant/30">
              <div>
                <p className="font-body-md font-medium text-on-surface">{order.id}</p>
                <p className="font-body-sm text-on-surface-variant">{order.items}</p>
              </div>
              <span className={`px-2 py-1 text-[12px] font-medium rounded-full border ${order.statusClass}`}>
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </section>
  </div>
);
