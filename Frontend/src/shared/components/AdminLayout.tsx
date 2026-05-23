import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useLogout } from "../../features/auth/hooks/useAuth";

export const AdminLayout = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // 1. Traemos la info del usuario y la función de logout
    const { user, isAdmin, hasRole } = useAuthStore();
    const { mutate: logout, isPending: isLoggingOut } = useLogout();

    const isActive = (path: string) =>
        path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(path);

    // 2. Filtramos el menú basándonos en los roles del usuario. Cada item tiene una propiedad `show` que determina si se muestra o no.
    const navItems = [
        { name: "Panel", path: "/", icon: "dashboard", show: true },
        { name: "Productos", path: "/productos", icon: "inventory_2", show: isAdmin() || hasRole("STOCK") },
        { name: "Categorías", path: "/categorias", icon: "category", show: isAdmin() },
        { name: "Ingredientes", path: "/ingredientes", icon: "liquor", show: isAdmin() },
        { name: "Pedidos", path: "/pedidos", icon: "view_kanban", show: isAdmin() || hasRole("PEDIDOS") },
    ].filter(item => item.show); // Solo dejamos los permitidos

    return (
        <div className="flex min-h-screen bg-surface-container-low text-on-surface">

            {/* ── Mobile Top Bar ── */}
            <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile py-4 bg-surface shadow-sm md:hidden text-primary">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
                    <span className="font-headline-md text-headline-md font-bold">FoodStore</span>
                </div>
                <button
                    className="active:scale-95 duration-150 p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <span className="material-symbols-outlined text-on-surface-variant">
                        {isMobileMenuOpen ? 'close' : 'menu'}
                    </span>
                </button>
            </header>

            {/* ── Desktop / Mobile Sidebar ── */}
            <aside className={`
        fixed left-0 top-0 h-screen border-r border-outline-variant bg-surface-container-low w-[260px] z-40
        flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static
        `}>
                {/* Brand / User Info */}
                <div className="p-6 border-b border-outline-variant/30 flex items-center gap-3 mt-[60px] md:mt-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold uppercase">
                        {user?.nombre?.charAt(0) || <span className="material-symbols-outlined">person</span>}
                    </div>
                    <div className="overflow-hidden">
                        <h2 className="font-headline-md text-[16px] leading-tight text-primary font-bold truncate">
                            {user ? `${user.nombre} ${user.apellido}` : 'Cargando...'}
                        </h2>
                        <p className="font-body-sm text-[12px] text-on-surface-variant truncate">
                            {user?.roles?.map(r => r.nombre).join(', ') || 'Sin Rol'}
                        </p>
                    </div>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 py-6 px-2 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)} // Cierra el menú al hacer click en mobile
                                className={`mx-2 px-4 py-3 flex items-center gap-4 rounded-lg transition-all duration-200 cursor-pointer ${active
                                        ? "bg-primary-container text-on-primary-container font-medium"
                                        : "text-on-surface-variant hover:bg-surface-container-highest"
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                                <span className="font-body-md text-body-md">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Real */}
                <div className="p-6 border-t border-outline-variant/30">
                    <button
                        onClick={() => logout()}
                        disabled={isLoggingOut}
                        className="w-full text-on-surface-variant flex items-center gap-4 hover:text-error transition-colors cursor-pointer disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="font-body-md text-body-md">{isLoggingOut ? 'Saliendo...' : 'Cerrar sesión'}</span>
                    </button>
                </div>
            </aside>

            {/* ── Overlay oscuro para mobile ── */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* ── Main Content ── */}
            <main className="flex-1 w-full pt-[72px] md:pt-0 min-h-screen flex flex-col overflow-x-hidden">
                {/* Desktop header strip */}
                <header className="hidden md:flex items-center justify-between px-margin-desktop py-6 bg-surface-container-low border-b border-outline-variant/30 sticky top-0 z-30">
                    <div>
                        <h1 className="font-headline-lg text-headline-lg text-on-surface">
                            {navItems.find((n) => isActive(n.path))?.name ?? "Panel"}
                        </h1>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                            FoodStore · Panel de administración
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-highest transition-colors relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
                        </button>
                    </div>
                </header>

                <div className="px-margin-mobile md:px-margin-desktop py-6 flex-1">
                    <Outlet />
                </div>
            </main>

            {/* ── Mobile Bottom Nav (Solo muestra primeros 3 permitidos) ── */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center bg-surface py-2 px-margin-mobile shadow-lg border-t border-outline-variant rounded-t-xl pb-safe">
                {navItems.slice(0, 3).map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center transition-transform duration-200 active:scale-90 p-2 ${active ? "text-primary" : "text-secondary hover:text-primary"
                                }`}
                        >
                            <span
                                className="material-symbols-outlined"
                                style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
                            >
                                {item.icon}
                            </span>
                            <span className="font-label-md text-[10px] mt-1">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};