import { useAuthStore } from '../../../store/useAuthStore';

export const AdminDashboardPage = () => {
  const { user } = useAuthStore();

  return (
    <>
      {/* Marca de agua (Watermark) de fondo a pantalla completa */}
      <div 
        className="fixed inset-0 z-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: "url('/watermark.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />

      {/* Contenedor de la Tarjeta de Bienvenida */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in p-4">
        
        {/* Tarjeta Glassmorphism */}
        <div className="space-y-6 max-w-2xl mx-auto bg-surface/80 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-white/40">
          <div className="w-20 h-20 mx-auto bg-primary text-on-primary rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              waving_hand
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
            ¡Bienvenido, <span className="text-primary">{user?.nombre || 'Equipo'}</span>!
          </h1>
          
          <p className="text-lg md:text-xl text-on-surface-variant font-medium">
            Has ingresado al sistema como{' '}
            <span className="text-secondary font-bold px-3 py-1 bg-secondary-container/50 rounded-lg uppercase text-sm tracking-wider border border-secondary/20 shadow-sm">
              {user?.roles?.[0]?.nombre || 'Usuario'}
            </span>
          </p>
          
          <p className="text-on-surface-variant pt-6 border-t border-outline-variant/30 mt-8 text-base">
            Seleccioná una opción en el menú lateral para empezar a trabajar con el sistema.
          </p>
        </div>

      </div>
    </>
  );
};
